/**
 * Types and interfaces for tracking Baymax code generation progress
 */

export type ProgressStepType = 
  | 'analyzing' 
  | 'planning' 
  | 'generating_html'
  | 'generating_css'
  | 'generating_js'
  | 'optimizing'
  | 'validating'
  | 'finalizing'
  | 'complete'
  | 'error';

export interface ProgressStep {
  id: string;
  type: ProgressStepType;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  details?: string[];
  currentAction?: string;
}

export interface GenerationProgress {
  id: string;
  overallStatus: 'initializing' | 'in_progress' | 'completed' | 'error';
  currentStep: number;
  totalSteps: number;
  steps: ProgressStep[];
  startTime: Date;
  endTime?: Date;
  estimatedTimeRemaining?: number;
  currentPlan?: string[];
  nextSteps?: string[];
}

export interface ProgressCallback {
  onProgressUpdate: (progress: GenerationProgress) => void;
  onStepUpdate: (stepId: string, update: Partial<ProgressStep>) => void;
  onComplete: (result: any) => void;
  onError: (error: Error, step?: ProgressStep) => void;
}

// Predefined progress steps for different types of generation
export const DEFAULT_GENERATION_STEPS: Omit<ProgressStep, 'id' | 'status' | 'startTime' | 'endTime'>[] = [
  {
    type: 'analyzing',
    title: '🔍 Analyzing Request',
    description: 'Understanding your requirements and planning the structure',
    details: [
      'Parsing user requirements',
      'Identifying component structure',
      'Determining technology stack'
    ]
  },
  {
    type: 'planning',
    title: '📋 Creating Blueprint',
    description: 'Designing the architecture and layout structure',
    details: [
      'Planning HTML structure',
      'Designing CSS architecture',
      'Planning JavaScript interactions'
    ]
  },
  {
    type: 'generating_html',
    title: '🏗️ Building HTML Structure',
    description: 'Creating the semantic HTML foundation',
    details: [
      'Building HTML skeleton',
      'Adding semantic elements',
      'Setting up accessibility features'
    ]
  },
  {
    type: 'generating_css',
    title: '🎨 Styling Components',
    description: 'Crafting beautiful and responsive CSS',
    details: [
      'Creating base styles',
      'Implementing responsive design',
      'Adding animations and transitions'
    ]
  },
  {
    type: 'generating_js',
    title: '⚡ Adding Interactivity',
    description: 'Implementing JavaScript functionality',
    details: [
      'Adding event listeners',
      'Implementing business logic',
      'Enhancing user interactions'
    ]
  },
  {
    type: 'optimizing',
    title: '⚡ Optimizing Performance',
    description: 'Fine-tuning code for optimal performance',
    details: [
      'Optimizing CSS for performance',
      'Minimizing JavaScript overhead',
      'Ensuring cross-browser compatibility'
    ]
  },
  {
    type: 'validating',
    title: '✅ Quality Assurance',
    description: 'Validating code quality and functionality',
    details: [
      'Checking HTML validity',
      'Verifying accessibility standards',
      'Testing responsive behavior'
    ]
  },
  {
    type: 'finalizing',
    title: '🚀 Finalizing',
    description: 'Preparing the final code for preview',
    details: [
      'Cleaning up code',
      'Adding final touches',
      'Preparing for deployment'
    ]
  }
];

// Utility functions for progress management
export const createProgress = (requestId: string): GenerationProgress => {
  const steps: ProgressStep[] = DEFAULT_GENERATION_STEPS.map((stepTemplate, index) => ({
    ...stepTemplate,
    id: `${requestId}-step-${index}`,
    status: 'pending' as const
  }));

  return {
    id: requestId,
    overallStatus: 'initializing',
    currentStep: 0,
    totalSteps: steps.length,
    steps,
    startTime: new Date(),
    currentPlan: [
      'Analyze your requirements thoroughly',
      'Design optimal architecture',
      'Generate clean, modern code',
      'Ensure responsive design',
      'Optimize for performance'
    ],
    nextSteps: [
      'Understanding your request...',
      'Planning the structure...',
      'Building components...'
    ]
  };
};

export const updateProgressStep = (
  progress: GenerationProgress,
  stepIndex: number,
  update: Partial<ProgressStep>
): GenerationProgress => {
  const updatedSteps = [...progress.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    ...update,
    ...(update.status === 'in_progress' && !updatedSteps[stepIndex].startTime 
      ? { startTime: new Date() } 
      : {}),
    ...(update.status === 'completed' || update.status === 'error'
      ? { endTime: new Date() }
      : {})
  };

  return {
    ...progress,
    steps: updatedSteps,
    currentStep: stepIndex,
    overallStatus: update.status === 'error' ? 'error' : 
                   stepIndex === progress.totalSteps - 1 && update.status === 'completed' ? 'completed' : 'in_progress'
  };
};