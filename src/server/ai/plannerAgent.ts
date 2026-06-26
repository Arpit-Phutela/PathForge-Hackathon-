import { UserRequest, PlannerProposal, PlannerProposalSchema } from "../../shared/types";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { v5 as uuidv5, validate as validateUUID } from "uuid";

// We use the modern @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * Prompts Gemini to break down a project goal into a structured list of tasks
 * and proposed dependencies. 
 */
export async function executePlannerAgent(request: UserRequest): Promise<PlannerProposal> {
  let attempt = 0;
  const maxRetries = 3;
  let lastError: any = null;
  
  // We don't force UUIDs from the LLM to avoid formatting issues,
  // instead we can let it use string IDs and map them to UUIDs, or just ask it to use UUID-like strings.
  // Actually, asking it to generate short IDs and mapping them later is safer, but the schema requires UUID.
  // Since GraphBuilder handles "ID hashing, array-to-map transformations", 
  // wait, the schema expects valid UUIDs! 
  // Let's ask Gemini to generate standard UUIDs, or we can intercept and map them.
  // We'll ask Gemini to use simple string IDs (e.g. "task_1") and map them to UUIDs before Zod parsing,
  // or just define the schema such that we map them.
  // Let's look at PlannerProposalSchema. It requires UUIDs.
  
  const systemInstruction = `You are the PathForge Planner Agent, an expert AI project manager.
Your job is to break down a user's project goal into a detailed, granular list of tasks and logical dependencies.
You must output a strictly valid JSON object.
Use simple alphanumeric IDs for tasks (e.g., "task_1", "task_2"). They will be converted to UUIDs internally.

The JSON object MUST follow this structure:
{
  "tasks": [
    {
      "taskId": "task_1",
      "title": "Clear task title",
      "description": "Detailed description of the task",
      "optimisticDuration": 1.5, // in days
      "mostLikelyDuration": 2.0,
      "pessimisticDuration": 3.5,
      "requiredSkills": ["TypeScript", "React"],
      "resourceAssumptions": ["Has access to API keys"]
    }
  ],
  "dependencies": [
    {
      "fromTaskId": "task_1",
      "toTaskId": "task_2",
      "rationale": "Task 1 must be completed before Task 2 can start because..."
    }
  ],
  "assumptions": ["List of overall project assumptions"],
  "plannerConfidence": 0.85, // 0.0 to 1.0 confidence in the plan
  "aiReasoning": "Explanation of how you approached breaking down the goal."
}
`;

  const prompt = `Goal: ${request.goal.description}
Context: ${request.goal.context || "None"}
Constraints: ${JSON.stringify(request.constraints || {})}
Preferences: ${JSON.stringify(request.preferences || {})}`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      tasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            taskId: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            optimisticDuration: { type: Type.NUMBER },
            mostLikelyDuration: { type: Type.NUMBER },
            pessimisticDuration: { type: Type.NUMBER },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            resourceAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["taskId", "title", "description", "optimisticDuration", "mostLikelyDuration", "pessimisticDuration"]
        }
      },
      dependencies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            fromTaskId: { type: Type.STRING },
            toTaskId: { type: Type.STRING },
            rationale: { type: Type.STRING }
          },
          required: ["fromTaskId", "toTaskId", "rationale"]
        }
      },
      assumptions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      plannerConfidence: { type: Type.NUMBER },
      aiReasoning: { type: Type.STRING }
    },
    required: ["tasks", "dependencies", "assumptions", "plannerConfidence", "aiReasoning"]
  };

  let messages: any[] = [{ text: prompt }];

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: messages,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.2,
        }
      });

      const text = response.text || "";
      let parsed = JSON.parse(text);

      // Map simple IDs to UUIDs deterministically, preserving existing ones
      const idMap = new Map<string, string>();
      const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // standard DNS namespace
      
      for (const t of parsed.tasks || []) {
        if (t.taskId && !idMap.has(t.taskId)) {
          if (validateUUID(t.taskId)) {
            idMap.set(t.taskId, t.taskId);
          } else {
            idMap.set(t.taskId, uuidv5(t.taskId, NAMESPACE));
          }
        }
        t.taskId = idMap.get(t.taskId);
      }
      for (const d of parsed.dependencies || []) {
        if (d.fromTaskId && !idMap.has(d.fromTaskId)) {
           idMap.set(d.fromTaskId, validateUUID(d.fromTaskId) ? d.fromTaskId : uuidv5(d.fromTaskId, NAMESPACE));
        }
        if (d.toTaskId && !idMap.has(d.toTaskId)) {
           idMap.set(d.toTaskId, validateUUID(d.toTaskId) ? d.toTaskId : uuidv5(d.toTaskId, NAMESPACE));
        }
        d.fromTaskId = idMap.get(d.fromTaskId) || d.fromTaskId;
        d.toTaskId = idMap.get(d.toTaskId) || d.toTaskId;
      }

      // Validate against Zod schema
      const validated = PlannerProposalSchema.parse(parsed);
      return validated;

    } catch (error: any) {
      lastError = error;
      attempt++;
      
      const errorMessage = `Attempt ${attempt} failed. Your previous output was invalid. Fix the errors:\n${error.message || error.toString()}`;
      messages.push({ text: errorMessage });
    }
  }

  throw new Error(`Planner Agent failed to generate a valid proposal after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}
