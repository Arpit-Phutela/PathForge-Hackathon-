import { useMutation } from '@tanstack/react-query';
import { useDashboardStore } from '../state/useDashboardStore';
import { PlannerProposal, Graph, Schedule, FeasibilityReport, ConfidenceReport, BottleneckReport } from '../../shared/types';

interface PipelineResponse {
  proposal: PlannerProposal;
  graph: Graph;
  schedule: Schedule;
  analysis: {
    feasibility: FeasibilityReport;
    confidence: ConfidenceReport;
    bottlenecks: BottleneckReport;
  };
}

export const usePipeline = () => {
  const { setPipelineData, setIsGenerating, setError, reset } = useDashboardStore();

  return useMutation({
    mutationFn: async (goal: string): Promise<PipelineResponse> => {
      // For now, this points to the backend /api/plan which will throw NotImplementedError,
      // but it establishes the API integration point for Phase 2.
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed with status: ${res.status}`);
      }

      return res.json();
    },
    onMutate: () => {
      reset();
      setIsGenerating(true);
    },
    onSuccess: (data) => {
      setPipelineData({
        proposal: data.proposal,
        graph: data.graph,
        schedule: data.schedule,
        feasibility: data.analysis.feasibility,
        confidence: data.analysis.confidence,
        bottlenecks: data.analysis.bottlenecks
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsGenerating(false);
    }
  });
};
