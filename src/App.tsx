import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import CodePreview from './components/CodePreview';
import Footer from './components/Footer';
import ImportOptions from './components/ImportOptions';
import ProgressDisplay from './components/ProgressDisplay';
import { baymaxNX } from './services/gemini';
import { Message } from './types';
import { GenerationProgress, ProgressCallback } from './types/progress';
import toast from 'react-hot-toast';

function App() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<GenerationProgress | null>(null);

  const addMessage = useCallback((type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const handleStartBuilding = useCallback(async (prompt: string) => {
    setIsBuilding(true);
    setIsLoading(true);
    setShowBuilder(true);
    setCurrentProgress(null);
    
    // Add user message
    addMessage('user', prompt);
    
    // Progress callback
    const progressCallback: ProgressCallback = {
      onProgressUpdate: (progress: GenerationProgress) => {
        setCurrentProgress(progress);
      },
      onStepUpdate: (stepId: string, update: any) => {
        // Handle individual step updates if needed
      },
      onComplete: (result: any) => {
        setCurrentCode(result);
        setCurrentProgress(null);
        addMessage('assistant', 'I\'ve created your website! You can see the preview on the right. Feel free to ask me to make any changes or improvements.');
        toast.success('Website generated successfully!');
      },
      onError: (error: Error, step?: any) => {
        console.error('Generation error:', error);
        setCurrentProgress(null);
        addMessage('assistant', 'I apologize, but I encountered an error while generating your website. Please try again with a different prompt or check your internet connection.');
        toast.error('Failed to generate website. Please try again.');
      }
    };
    
    try {
      await baymaxNX.generateCode(prompt, undefined, progressCallback);
    } catch (error) {
      progressCallback.onError(error as Error);
    } finally {
      setIsLoading(false);
      setIsBuilding(false);
    }
  }, [addMessage]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!currentCode) {
      toast.error('Please start building a website first!');
      return;
    }

    setIsLoading(true);
    setCurrentProgress(null);
    addMessage('user', message);

    // Progress callback for refinement
    const progressCallback: ProgressCallback = {
      onProgressUpdate: (progress: GenerationProgress) => {
        setCurrentProgress(progress);
      },
      onStepUpdate: (stepId: string, update: any) => {
        // Handle individual step updates if needed
      },
      onComplete: (result: any) => {
        setCurrentCode(result);
        setCurrentProgress(null);
        addMessage('assistant', 'I\'ve updated your website based on your request. Check out the changes in the preview!');
        toast.success('Website updated successfully!');
      },
      onError: (error: Error, step?: any) => {
        console.error('Refinement error:', error);
        setCurrentProgress(null);
        addMessage('assistant', 'I had trouble processing that request. Could you try rephrasing it or being more specific about what you\'d like me to change?');
        toast.error('Failed to update website. Please try again.');
      }
    };

    try {
      await baymaxNX.refineCode(message, currentCode, progressCallback);
    } catch (error) {
      progressCallback.onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, currentCode]);

  return (
    <div className="min-h-screen h-screen bg-[#0d0d0d] flex flex-col overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />

      <AnimatePresence mode="wait">
        {!showBuilder ? (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto">
              <Hero onStartBuilding={handleStartBuilding} isLoading={isBuilding} />
              
              {/* Import Options Section */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <ImportOptions />
                </motion.div>
              </div>
              
              <Footer />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex-1 flex flex-col bg-black overflow-hidden"
          >
            {/* Animated Accent Background */}
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-violet-900/40 blur-3xl"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 120, 240] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-32 -left-24 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-slate-800/40 via-gray-800/30 to-slate-900/40 blur-3xl"
                animate={{ scale: [1.1, 0.95, 1.1], rotate: [360, 180, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-bl from-blue-900/30 via-indigo-900/20 to-gray-800/30 blur-2xl"
                animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [0.9, 1.05, 0.95] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:52px_52px]"
                animate={{ backgroundPosition: ['0px 0px', '52px 52px', '0px 0px'] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowBuilder(false);
                    setMessages([]);
                    setCurrentCode('');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </motion.button>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm">Baymax-NX</span>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* Main Builder Interface */}
            <div className="relative z-10 flex-1 flex overflow-hidden bg-[#0d0d0d]">
              {/* Chat Panel */}
              <div className="w-1/2 border-r border-[#2a2a2a] bg-[#1a1a1a]">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  currentCode={currentCode}
                  currentProgress={currentProgress}
                />
              </div>
              
              {/* Preview Panel */}
              <div className="w-1/2 bg-[#0d0d0d]">
                <CodePreview code={currentCode} isLoading={isLoading} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;