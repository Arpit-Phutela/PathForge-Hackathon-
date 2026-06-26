# Component Hierarchy

```
<Dashboard>
  <DashboardShell>
    <LeftColumn>
      <MissionControl>
        <MissionHeader />
        <GoalInput />
        <SaveDeadlineCTA />
      </MissionControl>
    </LeftColumn>

    <CenterColumn>
      <ExecutionOverview>
        <PipelineStatus />
        <MissionSummary />
        <ExecutionStatus />
        <TodaysMissionCard />
        <UpcomingMilestones />
        <FutureInteractiveContainer />
      </ExecutionOverview>
    </CenterColumn>

    <RightColumn>
      <AIIntelligence>
        <MissionHealthCard />
        <ProbabilityCard />
        <RiskCard />
        <RecommendationCard />
        <AIExplanationCard />
      </AIIntelligence>
    </RightColumn>
  </DashboardShell>
</Dashboard>
```
