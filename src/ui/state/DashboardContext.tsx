import React, { createContext, useContext, useState } from "react";
import { ExecutionPlan } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

interface DashboardState {
  plan: ExecutionPlan | null;
  isLoading: boolean;
  error: Error | null;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state] = useState<DashboardState>({
    plan: null,
    isLoading: false,
    error: null,
  });

  return (
    <DashboardContext.Provider value={state}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardState must be used within a DashboardProvider");
  }
  return context;
}
