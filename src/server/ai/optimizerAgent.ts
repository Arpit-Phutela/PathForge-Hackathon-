import { GoogleGenAI, Type, Schema } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { 
  ExecutionPlan, 
  PlannerProposal, 
  OptimizationReport, 
  OptimizationStrategy, 
  ScenarioMutation, 
  ScenarioMutationSchema 
} from "../../shared/types";
import { executeScenario } from "../algorithms/scenario";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function executeOptimizationAgent(
  plan: ExecutionPlan, 
  proposal: PlannerProposal
): Promise<OptimizationReport> {
  const systemInstruction = `You are the PathForge Timeline Optimization Agent, an expert operations research AI.
Your job is to analyze the current Execution Plan and propose multiple candidate strategies to reduce the total project duration or improve feasibility without violating logical constraints.

You must output a strictly valid JSON object containing an array of candidate strategies.
Each strategy MUST contain an array of mutations to apply.

Available mutation types:
- DELAY_TASK (taskId, delayDays)
- SHORTEN_TASK (taskId, shortenDays)
- REMOVE_DEPENDENCY (fromTaskId, toTaskId)
- ADD_DEPENDENCY (fromTaskId, toTaskId)
- MARK_BLOCKED (taskId)
- MARK_COMPLETED (taskId)

Focus on:
1. Shortening critical path tasks.
2. Parallelizing sequential tasks by removing strict dependencies (if logically sound).
3. Delaying non-critical tasks to smooth resource usage.

The JSON object MUST follow this structure:
{
  "candidates": [
    {
      "title": "Strategy Title",
      "description": "Why this works.",
      "tradeOffs": ["Increased risk", "Requires more resources"],
      "mutations": [
        { "type": "SHORTEN_TASK", "taskId": "some-uuid", "shortenDays": 1 },
        { "type": "REMOVE_DEPENDENCY", "fromTaskId": "uuid1", "toTaskId": "uuid2" }
      ]
    }
  ],
  "naturalLanguageExplanation": "Overall analysis of optimization opportunities."
}
`;

  const prompt = `Current Execution Plan:
Project Duration: ${plan.roadmap.schedule.projectDuration} days
Critical Path: ${plan.roadmap.schedule.criticalPathIds.join(", ")}
Feasibility Score: ${plan.analysis.feasibility.score}
Bottlenecks: ${JSON.stringify(plan.analysis.bottlenecks.bottleneckNodes)}

Tasks:
${JSON.stringify(plan.roadmap.graph.nodes.map(n => ({ id: n.id, title: n.baseData?.title, duration: n.baseData?.mostLikelyDuration })))}

Dependencies:
${JSON.stringify(plan.roadmap.graph.edges)}

Analyze the plan and propose up to 3 candidate strategies to optimize it.`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      candidates: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tradeOffs: { type: Type.ARRAY, items: { type: Type.STRING } },
            mutations: { type: Type.ARRAY, items: { type: Type.OBJECT } } // Zod will validate the exact union types
          },
          required: ["title", "description", "tradeOffs", "mutations"]
        }
      },
      naturalLanguageExplanation: { type: Type.STRING }
    },
    required: ["candidates", "naturalLanguageExplanation"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    }
  });

  const text = response.text || "";
  const parsed = JSON.parse(text);

  const rankedStrategies: OptimizationStrategy[] = [];

  for (const candidate of parsed.candidates || []) {
    try {
      // 1. Validate mutations schema
      const validMutations: ScenarioMutation[] = [];
      for (const m of candidate.mutations || []) {
        validMutations.push(ScenarioMutationSchema.parse(m));
      }

      // 2. Invoke Scenario Simulation
      const scenarioResult = executeScenario(plan, validMutations, proposal);

      // 3. Evaluate Improvement
      const durationImprovement = -scenarioResult.delta.durationDelta; // positive is good
      
      // We only accept the strategy if it improves duration or feasibility without introducing a cycle
      if (durationImprovement > 0 || scenarioResult.delta.feasibilityDelta > 0) {
        
        // Calculate bottlenecks reduced
        const oldBottlenecks = plan.analysis.bottlenecks.bottleneckNodes.length;
        const newBottlenecks = scenarioResult.simulatedPlan.analysis.bottlenecks.bottleneckNodes.length;
        const bottlenecksReduced = oldBottlenecks - newBottlenecks;

        rankedStrategies.push({
          id: uuidv4(),
          title: candidate.title,
          description: candidate.description,
          mutations: validMutations,
          deterministicEvidence: {
            durationImprovementDays: durationImprovement,
            feasibilityImprovement: scenarioResult.delta.feasibilityDelta,
            confidenceImpact: scenarioResult.simulatedPlan.analysis.confidence.score - plan.analysis.confidence.score,
            bottlenecksReduced,
            criticalPathChanged: scenarioResult.delta.criticalPathChanged
          },
          tradeOffs: candidate.tradeOffs
        });
      }
    } catch (err) {
      // Simulation failed (e.g., introduced a cycle, or invalid mutation)
      // We safely discard this candidate
      console.warn("Discarded optimization candidate due to simulation failure:", err);
    }
  }

  // Rank strategies primarily by duration improvement
  rankedStrategies.sort((a, b) => b.deterministicEvidence.durationImprovementDays - a.deterministicEvidence.durationImprovementDays);

  return {
    rankedStrategies,
    naturalLanguageExplanation: parsed.naturalLanguageExplanation || "Optimization analysis completed."
  };
}
