
import { GoogleGenAI, Type } from "@google/genai";
import { Mood } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Routine Recommendation ---
export const getRoutineRecommendation = async (mood: Mood, energyLevel: number) => {
  const modelId = "gemini-2.5-flash";
  const prompt = `The user feels ${mood} and has an energy level of ${energyLevel}/10. 
  Suggest 3 very small, low-barrier, actionable micro-tasks to help them start their day or feel better. 
  Keep tasks simple (e.g., "Drink a glass of water", "Open the window").
  Respond in Korean.
  Return ONLY a JSON array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Routine Error:", error);
    return ["물 한 잔 마시기", "1분간 스트레칭하기", "창문 열고 심호흡하기"];
  }
};

// --- Study Breakdown ---
export const breakDownStudyGoal = async (goal: string) => {
  const modelId = "gemini-2.5-flash";
  const prompt = `The user wants to study: "${goal}". 
  Break this down into 3-4 concrete, small, manageable steps that can be done in 20-30 minutes.
  Be encouraging. Respond in Korean.
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Study Error:", error);
    return { message: "작게 시작해봐요!", steps: ["책/노트북 펴기", "목차 읽기", "핵심 개념 하나 적기"] };
  }
};

// --- Social Simulation ---
export const getSocialSimulationResponse = async (scenario: string, history: {role: string, content: string}[], userMessage: string) => {
  const modelId = "gemini-3-pro-preview"; // Using Pro for better nuance
  
  const systemInstruction = `You are a helpful social skills coach running a simulation. 
  Current Scenario: ${scenario}.
  
  1. Reply to the user as the character in the scenario naturally in Korean.
  2. Provide a 'feedback' object with a politeness/appropriateness score (1-100) and a brief tip in Korean.
  
  Return JSON structure: { "reply": string, "feedback": { "score": number, "advice": string } }`;

  const prompt = `User said: "${userMessage}". Respond as the character and evaluate.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            feedback: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                advice: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Social Error:", error);
    return { 
      reply: "알겠습니다. (시뮬레이션 불가)", 
      feedback: { score: 50, advice: "조금 더 구체적으로 말해보세요. (오프라인 모드)" } 
    };
  }
};

// --- Mental Rescue / Praise ---
export const getPraiseForTask = async (taskName: string) => {
  const modelId = "gemini-2.5-flash";
  const prompt = `The user just achieved a micro-success: "${taskName}". 
  Give a short, warm, enthusiastic one-sentence praise to boost their dopamine in Korean. Use emojis.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text?.trim() || "정말 잘했어요! 계속해봐요! 🎉";
  } catch (error) {
    return "잘했어요! 🌱";
  }
};

export const getMentalRescueTip = async () => {
  const modelId = "gemini-2.5-flash";
  const prompt = `The user is feeling mentally down/overwhelmed. Provide one gentle, 1-minute grounding technique or comforting thought in Korean.`;
   try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text?.trim() || "깊게 숨을 들이마셔보세요. 4초간 마시고, 4초간 멈추고, 4초간 내뱉어보세요.";
  } catch (error) {
    return "10초만 호흡에 집중해보세요. 당신은 안전합니다.";
  }
}

export const generateComfortMessage = async (recipient: string, context: string) => {
  const modelId = "gemini-2.5-flash";
  const prompt = `The user is having a hard time and wants to send a message to "${recipient}". 
  Context: "${context}".
  Write a polite, warm, and appropriate message in Korean that the user can copy and send. 
  It should not be too dramatic, just honest and asking for connection or letting them know they need rest.`;
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text?.trim();
  } catch (error) {
    return "요즘 제가 조금 힘들어서 연락이 늦었어요. 마음이 좀 괜찮아지면 다시 연락드릴게요. 이해해 주셔서 감사합니다.";
  }
}

// --- Exploration Quest ---
export const getOutdoorMissions = async (level: number) => {
  const modelId = "gemini-2.5-flash";
  const prompt = `Suggest 3 micro-missions for a user who finds it hard to go outside (hikikomori/resting). 
  Difficulty Level: ${level} (1 is extremely easy, like opening a window. 5 is going to a store).
  
  Examples:
  Level 1: "Open the front door for 10 seconds", "Look at the sky from the balcony"
  Level 3: "Walk to the convenience store", "Take a picture of a flower outside"
  
  Respond in Korean. Return JSON array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return ["현관문 3초간 열어두기", "우편함 확인하고 오기", "집 앞 10걸음 걷기"];
  }
};
