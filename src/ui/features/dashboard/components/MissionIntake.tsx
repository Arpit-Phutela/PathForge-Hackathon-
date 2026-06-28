import React, { useState } from 'react';
import { useDashboardStore } from '../../../state/useDashboardStore';
import { usePipeline } from '../../../hooks/usePipeline';
import { ArrowRight, Sparkles, AlertCircle, Calendar, ShieldCheck, Zap, Layers, Cpu, Code, Globe, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HoverTilt } from '../../../components/HoverTilt';
import { samplePlannerProposal, sampleExecutionPlan } from '../../../../demo';

export const MissionIntake: React.FC = () => {
  const { goal, setGoal, experienceStage, setExperienceStage, error, setError, setIsDemo, setPipelineData, reset } = useDashboardStore();
  const { mutate, isPending } = usePipeline();
  
  // Local form states
  const [missionText, setMissionText] = useState('');
  const [timelineValue, setTimelineValue] = useState('3');
  const [timelineUnit, setTimelineUnit] = useState<'Days' | 'Weeks' | 'Months'>('Weeks');
  const [priority, setPriority] = useState<'Standard' | 'Aggressive' | 'Research'>('Standard');
  const [isFocused, setIsFocused] = useState(false);

  // Quick Start Templates
  const templates = [
    {
      id: 'saas',
      title: 'Launch SaaS',
      subtitle: 'B2B platform setup',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      description: 'Design database schema, specify REST & GraphQL APIs, develop client dashboard, integrate payment gateways, and provision scalable cloud containers.',
      duration: '3',
      unit: 'Weeks' as const,
      priority: 'Aggressive' as const,
    },
    {
      id: 'portfolio',
      title: 'Portfolio Website',
      subtitle: 'Interactive visual gallery',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      description: 'Build an immersive high-end designer portfolio featuring 3D asset preloading, responsive layout styling, fluid page transitions, and deploy to staging.',
      duration: '10',
      unit: 'Days' as const,
      priority: 'Standard' as const,
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      subtitle: 'Native health tracker',
      icon: <Code className="w-4 h-4 text-purple-400" />,
      description: 'Create a native mobile fitness and nutrition app with local SQLite storage, background sensor sync, visual progress graphs, and App Store metadata preparation.',
      duration: '2',
      unit: 'Months' as const,
      priority: 'Standard' as const,
    },
    {
      id: 'hackathon',
      title: 'Hackathon Project',
      subtitle: 'AI voice study coworker',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      description: 'Deploy an real-time speech assistant with semantic vector memory search, sleek Chat UI, and dynamic slide layouts under an intensive 48-hour development schedule.',
      duration: '2',
      unit: 'Days' as const,
      priority: 'Aggressive' as const,
    },
    {
      id: 'startup',
      title: 'AI Startup',
      subtitle: 'Multi-agent coding ecosystem',
      icon: <Cpu className="w-4 h-4 text-rose-400" />,
      description: 'Design a decentralized autonomous network orchestrator linking multiple code agents, sandboxed safe execution layers, and continuous integration pipeline hooks.',
      duration: '1',
      unit: 'Months' as const,
      priority: 'Research' as const,
    }
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setMissionText(tpl.description);
    setTimelineValue(tpl.duration);
    setTimelineUnit(tpl.unit);
    setPriority(tpl.priority);
  };

  const handleStartCampaign = () => {
    if (!missionText.trim()) return;
    
    // Construct rich, structured prompt to ensure quality parsing
    const compositeGoal = `${missionText.trim()} (Target: ${timelineValue} ${timelineUnit}, Priority: ${priority})`;
    
    setGoal(compositeGoal);
    setError(null);
    setIsDemo(false);
    
    // Trigger mutation
    setExperienceStage('AI_ANALYSIS');
    mutate(compositeGoal);
  };

  const handleStartDemo = () => {
    // 1. Clear any errors
    setError(null);
    
    // 2. Set Demo mode
    setIsDemo(true);
    
    // 3. Set the demo goal in the store
    const demoGoal = "Launch E-Commerce Platform: Design DB, configure APIs, design and code frontend, integrate payment portal, and test staging deployment.";
    setGoal(demoGoal);
    
    // 4. Fill store with demo data
    setPipelineData({
      proposal: samplePlannerProposal,
      graph: sampleExecutionPlan.roadmap.graph,
      schedule: sampleExecutionPlan.roadmap.schedule,
      feasibility: sampleExecutionPlan.analysis.feasibility,
      confidence: sampleExecutionPlan.analysis.confidence,
      bottlenecks: sampleExecutionPlan.analysis.bottlenecks
    });

    // 5. Trigger transition via Cinematic AI Analysis
    setExperienceStage('AI_ANALYSIS');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e05_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* 1. Header Area with Minimal Layout (Assembles first) */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="px-8 py-6 flex items-center justify-between z-20 max-w-7xl mx-auto w-full"
      >
        <div className="space-y-0.5">
          <div className="text-sm font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5">
            <Command className="w-4 h-4 text-indigo-400" />
            <span>PathForge</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
            <span>Plan smarter.</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Execute with confidence.</span>
          </div>
        </div>

        <motion.button
          whileHover={{ 
            y: -1.5, 
            scale: 1.02, 
            borderColor: "rgba(255,255,255,0.15)",
            color: "#ffffff"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartDemo}
          className="px-4 py-1.5 rounded-full btn-material-secondary text-zinc-300 text-xs font-mono cursor-pointer"
        >
          Try Demo Mission
        </motion.button>
      </motion.header>

      {/* 2. Main Intake Content */}
      <div className="max-w-4xl w-full mx-auto px-6 py-6 space-y-8 z-10 flex-1 flex flex-col justify-center">
        
        {/* Intro (Assembles second) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 text-center max-w-xl mx-auto"
        >
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans leading-tight">
            Initiate a New Mission
          </h1>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Define your objectives and schedule parameters. Our AI engine compiles topological dependencies and computes mathematically verified timelines.
          </p>
        </motion.div>

        {/* Value Proposition Bento Panel (Under 5 seconds explanation) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 space-y-2">
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">1. WHAT IS PATHFORGE?</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
              An execution intelligence platform combining generative Gemini sequencing with deterministic scheduling algorithms to prevent missed deadlines.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 space-y-2">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">2. WHY SHOULD I CARE?</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
              We mathematically verify task networks, flag bottlenecks, and dynamically compress schedules to keep complex projects on budget and on schedule.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 space-y-2">
            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">3. WHAT HAPPENS NEXT?</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
              Enter your mission description below or start the Try Demo Mission. Step through interactive planning, path-optimizations, and real focus sessions.
            </p>
          </div>
        </motion.div>

        {/* Input Sandbox Block (Assembles third) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-floating light-edge-top rounded-2xl p-6 space-y-6 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column (2/3): Mission Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                Mission Objectives
              </label>
              <div className="relative">
                <textarea
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full min-h-[160px] p-4 rounded-xl border border-zinc-800/50 bg-[#060608]/80 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 text-xs leading-relaxed transition-all resize-none font-sans shadow-inner"
                  placeholder="Describe your goals in detail... e.g., Launching a SaaS portal, performing schema translations, and deployment."
                />
              </div>
            </div>

            {/* Right Column (1/3): Parameters Configuration */}
            <div className="space-y-6 flex flex-col justify-between">
              
              {/* Target Timeline */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  Target Timeline
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={timelineValue}
                    onChange={(e) => setTimelineValue(e.target.value)}
                    className="w-16 p-2 rounded-lg border border-zinc-800/60 bg-[#060608]/80 text-center text-xs font-mono text-zinc-100 focus:outline-none focus:border-indigo-500/40"
                  />
                  
                  <div className="flex-1 bg-[#060608]/80 border border-zinc-800/60 rounded-lg p-0.5 flex gap-0.5 shadow-inner">
                    {(['Days', 'Weeks', 'Months'] as const).map((unit) => (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        key={unit}
                        type="button"
                        onClick={() => setTimelineUnit(unit)}
                        className={`flex-1 text-[9px] font-mono font-bold py-1.5 rounded transition-all cursor-pointer ${
                          timelineUnit === unit 
                            ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {unit}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  Priority Profile
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#060608]/80 border border-zinc-800/60 rounded-lg p-0.5 shadow-inner">
                  {(['Standard', 'Aggressive', 'Research'] as const).map((p) => (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`text-[9px] font-mono font-bold py-1.5 rounded transition-all cursor-pointer ${
                        priority === p 
                          ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Begin Planning Trigger (Physical, sprung, elevates on hover) */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStartCampaign}
                disabled={!missionText.trim() || isPending}
                className="w-full btn-material-primary py-3 rounded-xl cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed group mt-2 font-mono flex items-center justify-center gap-1.5 text-xs tracking-wider uppercase shadow-lg"
              >
                <span>Begin Planning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

            </div>

          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="text-[10px] text-rose-400 font-sans leading-normal">
                <span className="font-bold font-mono uppercase mr-1">Error:</span> {error}
              </div>
            </motion.div>
          )}

        </motion.div>

        {/* Quick Start Presets Slider (Assembles fourth, with staggered entrance) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 pt-2"
        >
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
            Quick Start Templates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 overflow-x-auto pb-2 scrollbar-none">
            {templates.map((tpl, idx) => (
              <HoverTilt 
                key={tpl.id}
                maxRotate={2.5} 
                scale={1.015}
                onClick={() => handleApplyTemplate(tpl)}
                className="h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + idx * 0.08, duration: 0.5 }}
                  className="p-4 text-left glass-card rounded-xl flex flex-col justify-between space-y-3 group cursor-pointer text-ellipsis overflow-hidden min-h-[140px] h-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="p-1.5 bg-zinc-900/60 border border-zinc-850 rounded-lg group-hover:border-zinc-700 transition-all">
                      {tpl.icon}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">
                      {tpl.duration} {tpl.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                      {tpl.description}
                    </p>
                  </div>
                </motion.div>
              </HoverTilt>
            ))}
          </div>
        </motion.div>

      </div>

      {/* 3. Footer (Assembles last) */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.8 }}
        className="px-8 py-4 border-t border-zinc-900/60 z-20 text-[10px] text-zinc-600 font-mono text-center flex items-center justify-between max-w-7xl mx-auto w-full"
      >
        <span>PathForge Project Manager Partner</span>
        <span>Secure & Mathematically Verified</span>
      </motion.footer>
    </div>
  );
};
