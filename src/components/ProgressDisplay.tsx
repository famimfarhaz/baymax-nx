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
  const currentStep = progress.steps[progress.currentStep];

  return (
    <div className={`bg-[#2a2a2a] border border-[#333] rounded-lg p-4 ${className}`}>
      {/* Bolt.new style progress */}
      <div className="space-y-3">
        {/* Header with collapsible arrow */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-sm font-medium">Importing GitHub Repository</span>
        </div>
        
        {/* Progress Steps */}
        <div className="ml-6 space-y-2">
          {progress.steps.slice(0, 3).map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-green-600' 
                  : step.status === 'in_progress'
                  ? 'bg-blue-600'
                  : 'bg-gray-600'
              }`}>
                {step.status === 'completed' && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
                {step.status === 'in_progress' && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-300">
                  {step.status === 'completed' ? step.title : 
                   step.status === 'in_progress' ? step.currentAction || step.title :
                   step.title}
                </div>
                {step.status === 'in_progress' && step.currentAction && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.currentAction}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Install dependencies step */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-300">Install dependencies</div>
              <div className="bg-[#1a1a1a] rounded p-2 mt-1 font-mono text-xs text-gray-400">
                <span className="text-orange-400">npm</span> <span className="text-blue-400">install</span>
              </div>
            </div>
          </div>
          
          {/* Start application step */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-300">Start application</div>
              <div className="bg-[#1a1a1a] rounded p-2 mt-1 font-mono text-xs text-gray-400">
                <span className="text-orange-400">npm</span> <span className="text-blue-400">run</span> <span className="text-green-400">dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
