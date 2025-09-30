import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Zap,
  Code2,
  Brain,
  Sparkles,
  ArrowRight,
  Timer
} from 'lucide-react';
import { GenerationProgress, ProgressStep } from '../types/progress';

interface ProgressDisplayProps {
  progress: GenerationProgress;
  className?: string;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress, className = '' }) => {
  const getStepIcon = (step: ProgressStep) => {
    switch (step.type) {
      case 'analyzing':
        return <Brain className="w-5 h-5" />;
      case 'planning':
        return <Code2 className="w-5 h-5" />;
      case 'generating_html':
      case 'generating_css':
      case 'generating_js':
        return <Zap className="w-5 h-5" />;
      case 'optimizing':
        return <Sparkles className="w-5 h-5" />;
      case 'validating':
      case 'finalizing':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStepStatusColor = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-300 bg-green-400/10 border-green-400/20';
      case 'in_progress':
        return 'text-blue-300 bg-blue-400/10 border-blue-400/20 animate-pulse';
      case 'error':
        return 'text-red-300 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-300 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getElapsedTime = () => {
    const elapsed = Date.now() - progress.startTime.getTime();
    return Math.floor(elapsed / 1000);
  };

  const currentStep = progress.steps[progress.currentStep];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}
    >
      {/* Accent Backgrounds (match Hero style) */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-violet-900/40 blur-2xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 120, 240] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-slate-800/40 via-gray-800/30 to-slate-900/40 blur-2xl"
          animate={{ scale: [1.1, 0.95, 1.1], rotate: [360, 180, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:52px_52px]"
          animate={{ backgroundPosition: ['0px 0px', '52px 52px', '0px 0px'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
            />
            <div>
            <h3 className="text-lg font-semibold text-white">
              Baymax-NX is working...
            </h3>
            <p className="text-sm text-gray-300">
              Step {progress.currentStep + 1} of {progress.totalSteps}
            </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Timer className="w-4 h-4" />
            <span>{getElapsedTime()}s</span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(((progress.currentStep + 1) / progress.totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="relative h-2 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
              initial={{ width: 0 }}
              animate={{ width: `${((progress.currentStep + 1) / progress.totalSteps) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Current Step Highlight */}
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getStepStatusColor(currentStep.status)}`}>
                {getStepIcon(currentStep)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">
                  {currentStep.title}
                </h4>
                <p className="text-sm text-gray-200/90 mb-2">
                  {currentStep.description}
                </p>
                {currentStep.currentAction && (
                  <motion.p
                    key={currentStep.currentAction}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-sky-300 font-medium"
                  >
                    → {currentStep.currentAction}
                  </motion.p>
                )}
                {currentStep.details && currentStep.status === 'in_progress' && (
                  <div className="mt-3">
                    <AnimatePresence>
                      {currentStep.details.map((detail, index) => (
                        <motion.div
                          key={detail}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className="flex items-center gap-2 text-xs text-gray-300 mb-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-300" />
                          {detail}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Plan */}
        {progress.currentPlan && progress.currentPlan.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Current Plan
            </h5>
            <div className="space-y-1">
              {progress.currentPlan.map((plan, index) => (
                <div
                  key={plan}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    index <= progress.currentStep 
                      ? 'bg-green-400' 
                      : index === progress.currentStep + 1 
                      ? 'bg-blue-400 animate-pulse' 
                      : 'bg-gray-600'
                  }`} />
                  {plan}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {progress.nextSteps && progress.nextSteps.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Coming Next
            </h5>
            <div className="space-y-1">
              {progress.nextSteps.slice(0, 3).map((nextStep) => (
                <div
                  key={nextStep}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  {nextStep}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps Overview */}
        <div className="border-t border-white/10 pt-4">
          <h5 className="text-sm font-medium text-gray-200 mb-3">All Steps</h5>
          <div className="space-y-2">
            {progress.steps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: step.status === 'in_progress' || step.status === 'completed' ? 1 : 0.6,
                  scale: step.status === 'in_progress' ? 1.02 : 1
                }}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <div className={`p-1.5 rounded-md ${getStepStatusColor(step.status)}`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : step.status === 'in_progress' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      {getStepIcon(step)}
                    </motion.div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-current opacity-30" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      step.status === 'completed' ? 'text-green-300' :
                      step.status === 'in_progress' ? 'text-blue-300' :
                      step.status === 'error' ? 'text-red-300' :
                      'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                    {step.endTime && (
                      <span className="text-xs text-gray-400">
                        {formatTime(step.endTime)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {progress.overallStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-400/20 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Generation Error</span>
            </div>
            <p className="text-sm text-red-200 mt-1">
              An error occurred during code generation. Please try again.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressDisplay;
