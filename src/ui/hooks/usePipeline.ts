import { useMutation } from '@tanstack/react-query';
import { useDashboardStore } from '../state/useDashboardStore';
import { PipelineResponse, SuccessResponse } from '../../shared/types';

export const usePipeline = () => {
  const { setPipelineData, setIsGenerating, setError, reset, setIsCinematicLoading } = useDashboardStore();

  return useMutation({
    mutationFn: async (goal: string): Promise<PipelineResponse> => {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: {
            description: goal,
            context: ""
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || err.error || `Failed with status: ${res.status}`);
      }

      const json = await res.json() as SuccessResponse;
      return json.data as PipelineResponse;
    },
    onMutate: () => {
      reset();
      setIsGenerating(true);
      setIsCinematicLoading(true);
    },
    onSuccess: (data) => {
      setPipelineData({
        proposal: data.proposal,
        graph: data.plan.roadmap.graph,
        schedule: data.plan.roadmap.schedule,
        feasibility: data.plan.analysis.feasibility,
        confidence: data.plan.analysis.confidence,
        bottlenecks: data.plan.analysis.bottlenecks
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsGenerating(false);
      setIsCinematicLoading(false);
    }
  });
};
