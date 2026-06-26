import { create } from 'zustand';
import { ExecutionPlan, Graph, PlannerProposal, Schedule, RiskReport, Roadmap, FeasibilityReport, ConfidenceReport, BottleneckReport } from '../../shared/types';

interface DashboardState {
  goal: string;
  setGoal: (goal: string) => void;
  
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;

  // Pipeline Data
  proposal: PlannerProposal | null;
  graph: Graph | null;
  schedule: Schedule | null;
  feasibility: FeasibilityReport | null;
  confidence: ConfidenceReport | null;
  bottlenecks: BottleneckReport | null;
  
  setPipelineData: (data: Partial<Omit<DashboardState, 'goal' | 'setGoal' | 'isGenerating' | 'setIsGenerating' | 'error' | 'setError' | 'setPipelineData' | 'reset'>>) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  goal: '',
  setGoal: (goal) => set({ goal }),
  
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  error: null,
  setError: (error) => set({ error }),
  
  proposal: null,
  graph: null,
  schedule: null,
  feasibility: null,
  confidence: null,
  bottlenecks: null,
  
  setPipelineData: (data) => set((state) => ({ ...state, ...data })),
  
  reset: () => set({
    isGenerating: false,
    error: null,
    proposal: null,
    graph: null,
    schedule: null,
    feasibility: null,
    confidence: null,
    bottlenecks: null,
  }),
}));
