import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRequest } from '../../shared/types';
import { GoogleGenAI } from '@google/genai';

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', NUMBER: 'NUMBER', ARRAY: 'ARRAY' }
  };
});

import { executePlannerAgent } from './plannerAgent';

describe('Planner Agent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully generate a valid PlannerProposal', async () => {
    const request: UserRequest = {
      goal: { description: 'Build a web app' }
    };

    const mockResponse = {
      text: JSON.stringify({
        tasks: [
          {
            taskId: 'task_1',
            title: 'Design UI',
            description: 'Create wireframes',
            optimisticDuration: 1,
            mostLikelyDuration: 2,
            pessimisticDuration: 3
          }
        ],
        dependencies: [],
        assumptions: ['Assume react'],
        plannerConfidence: 0.9,
        aiReasoning: 'Standard web app'
      })
    };

    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const result = await executePlannerAgent(request);
    expect(result.tasks.length).toBe(1);
    expect(result.plannerConfidence).toBe(0.9);
  });

  it('should retry on malformed JSON or schema validation failure', async () => {
    const request: UserRequest = {
      goal: { description: 'Build a web app' }
    };

    const badResponse = { text: '{"malformed": true' };
    const goodResponse = {
      text: JSON.stringify({
        tasks: [
          {
            taskId: 'task_1',
            title: 'Design UI',
            description: 'Create wireframes',
            optimisticDuration: 1,
            mostLikelyDuration: 2,
            pessimisticDuration: 3
          }
        ],
        dependencies: [],
        assumptions: ['Assume react'],
        plannerConfidence: 0.9,
        aiReasoning: 'Standard web app'
      })
    };

    mockGenerateContent
      .mockResolvedValueOnce(badResponse) // first attempt fails
      .mockResolvedValueOnce(goodResponse); // second attempt succeeds

    const result = await executePlannerAgent(request);
    expect(result.tasks.length).toBe(1);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('should throw an error after max retries fail', async () => {
    const request: UserRequest = {
      goal: { description: 'Build a web app' }
    };

    const badResponse = { text: '{"malformed": true' };

    mockGenerateContent.mockResolvedValue(badResponse);

    await expect(executePlannerAgent(request)).rejects.toThrow(/Planner Agent failed to generate a valid proposal after 3 attempts/);
    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
  });
});
