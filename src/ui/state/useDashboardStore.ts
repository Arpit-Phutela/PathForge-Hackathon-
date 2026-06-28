import { create } from 'zustand';
import { ExecutionPlan, Graph, PlannerProposal, Schedule, RiskReport, Roadmap, FeasibilityReport, ConfidenceReport, BottleneckReport, ScenarioResult } from '../../shared/types';

export type ExperienceStage = 
  | 'MISSION_INTAKE'
  | 'AI_ANALYSIS'
  | 'MISSION_BRIEFING'
  | 'EXECUTION_WORKSPACE'
  | 'OPTIMIZATION_LAB'
  | 'FOCUS_MODE'
  | 'MISSION_COMPLETE';

interface DashboardState {
  goal: string;
  setGoal: (goal: string) => void;
  
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  isCinematicLoading: boolean;
  setIsCinematicLoading: (isCinematicLoading: boolean) => void;
  
  experienceStage: ExperienceStage;
  setExperienceStage: (stage: ExperienceStage) => void;
  
  error: string | null;
  setError: (error: string | null) => void;

  // Demo Mode State
  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;

  // Execution Layer State
  completedTaskIds: string[];
  setCompletedTaskIds: (ids: string[]) => void;
  toggleTaskComplete: (id: string) => void;
  isFocusMode: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;

  // Pipeline Data
  proposal: PlannerProposal | null;
  graph: Graph | null;
  schedule: Schedule | null;
  feasibility: FeasibilityReport | null;
  confidence: ConfidenceReport | null;
  bottlenecks: BottleneckReport | null;

  // Simulation Sandbox State
  simulatedResult: ScenarioResult | null;
  setSimulatedResult: (result: ScenarioResult | null) => void;
  
  setPipelineData: (data: Partial<Omit<DashboardState, 'goal' | 'setGoal' | 'isGenerating' | 'setIsGenerating' | 'error' | 'setError' | 'isDemo' | 'setIsDemo' | 'setPipelineData' | 'reset' | 'completedTaskIds' | 'setCompletedTaskIds' | 'toggleTaskComplete' | 'isFocusMode' | 'setIsFocusMode' | 'simulatedResult' | 'setSimulatedResult' | 'experienceStage' | 'setExperienceStage'>>) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  goal: '',
  setGoal: (goal) => set({ goal }),
  
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  isCinematicLoading: false,
  setIsCinematicLoading: (isCinematicLoading) => set({ isCinematicLoading }),

  experienceStage: 'MISSION_INTAKE',
  setExperienceStage: (experienceStage) => set({ experienceStage }),
  
  error: null,
  setError: (error) => set({ error }),

  isDemo: false,
  setIsDemo: (isDemo) => set({ isDemo }),

  // Execution Layer State
  completedTaskIds: [],
  setCompletedTaskIds: (completedTaskIds) => set({ completedTaskIds }),
  toggleTaskComplete: (id) => set((state) => {
    const exists = state.completedTaskIds.includes(id);
    const completedTaskIds = exists
      ? state.completedTaskIds.filter((tId) => tId !== id)
      : [...state.completedTaskIds, id];
    return { completedTaskIds };
  }),
  isFocusMode: false,
  setIsFocusMode: (isFocusMode) => set({ isFocusMode }),
  
  proposal: null,
  graph: null,
  schedule: null,
  feasibility: null,
  confidence: null,
  bottlenecks: null,

  simulatedResult: null,
  setSimulatedResult: (simulatedResult) => set({ simulatedResult }),
  
  setPipelineData: (data) => set((state) => ({ ...state, ...data })),
  
  reset: () => set({
    isGenerating: false,
    isCinematicLoading: false,
    experienceStage: 'MISSION_INTAKE',
    error: null,
    isDemo: false,
    completedTaskIds: [],
    isFocusMode: false,
    proposal: null,
    graph: null,
    schedule: null,
    feasibility: null,
    confidence: null,
    bottlenecks: null,
    simulatedResult: null,
  }),
}));
