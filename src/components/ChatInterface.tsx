import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, Download, ExternalLink, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { GenerationProgress } from '../types/progress';
import { uiGenerator } from '../services/uiGenerator';
import ComponentPreview from './ComponentPreview';
import ProgressDisplay from './ProgressDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  currentCode: string;
  currentProgress?: GenerationProgress | null;
}

export default function ChatInterface({ messages, onSendMessage, isLoading, currentCode, currentProgress }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isGeneratingUI, setIsGeneratingUI] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(currentCode);
  const [showPreview, setShowPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update generated code when currentCode changes
  useEffect(() => {
    setGeneratedCode(currentCode);
  }, [currentCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  // Enhanced UI generation with better prompts
  const generateUIComponent = async (prompt: string) => {
    setIsGeneratingUI(true);
    try {
      const enhancedCode = await uiGenerator.generateUIComponent(prompt, {
        style: 'modern',
        animations: true,
        responsive: true,
        darkMode: true
      });
      setGeneratedCode(enhancedCode);
      setShowPreview(true);
      toast.success('✨ Beautiful UI component generated!');
    } catch (error) {
      toast.error('Failed to generate UI component');
      console.error('UI Generation error:', error);
    } finally {
      setIsGeneratingUI(false);
    }
  };

  const handleStyleChange = async (styleInstruction: string) => {
    if (!generatedCode) return;
    
    setIsGeneratingUI(true);
    try {
      const updatedCode = await uiGenerator.applyStyleChanges(generatedCode, styleInstruction);
      setGeneratedCode(updatedCode);
      toast.success('🎨 Style updated!');
    } catch (error) {
      toast.error('Failed to apply style changes');
      console.error('Style change error:', error);
    } finally {
      setIsGeneratingUI(false);
    }
  };

  const regenerateComponent = async () => {
    if (!input.trim()) {
      toast.error('Please enter a component description');
      return;
    }
    await generateUIComponent(input);
  };


  const deployToNetlify = () => {
    toast.success('Deploy feature coming soon!');
  };

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-slate-950/80 to-slate-900/60 backdrop-blur-xl overflow-hidden">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-gray-900/30 blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gradient-to-tr from-slate-800/30 via-gray-800/20 to-slate-900/30 blur-xl"
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            rotate: [180, 270, 360],
            x: [0, -25, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 16, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div 
          className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
          animate={{ backgroundPosition: ['0px 0px', '48px 48px', '0px 0px'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/15 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <motion.div
              className="absolute -inset-1 bg-white/20 rounded-full blur-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h3 className="text-white font-semibold">Baymax-NX Assistant</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 border-white/20 text-white hover:text-white bg-white/5 hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.success('Deploy feature coming soon!')}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20"
            title="Deploy"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
              <div
                className={`p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-100 border border-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                }`}
              >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Progress Display or Simple Loading */}
        {(isLoading || currentProgress) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                {currentProgress ? (
                  <ProgressDisplay progress={currentProgress} />
                ) : (
                  <div className="p-4 rounded-2xl bg-gray-800 border border-gray-700">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                      <span className="text-gray-400 text-sm ml-2">Baymax-NX is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Component Preview */}
      {showPreview && (
        <div className="border-t border-white/10 p-4 bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-xl">
          <ComponentPreview
            generatedCode={generatedCode}
            isLoading={isGeneratingUI}
            onRegenerate={regenerateComponent}
            onStyleChange={handleStyleChange}
          />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative z-10 px-4 pt-4 pb-2 border-t border-white/10 bg-gradient-to-t from-black/30 to-transparent">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <motion.div 
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-white/10 via-slate-400/20 to-white/10 blur-xl pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the UI component you want to create (e.g., 'Create a modern dashboard card with stats')..."
              className="relative w-full bg-white/5 text-white placeholder-gray-400 rounded-2xl px-4 py-3 border border-white/20 focus:border-blue-400/50 focus:outline-none resize-none min-h-[44px] max-h-[120px] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              rows={1}
              disabled={isLoading || isGeneratingUI}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          {/* AI UI Generation Button */}
          <Button
            type="button"
            onClick={() => generateUIComponent(input)}
            disabled={isGeneratingUI || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-pink-500/20 border border-white/10"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGeneratingUI ? 'Generating...' : 'Generate UI'}
          </Button>
          
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl transition-all duration-200 border ${
              isLoading || !input.trim()
                ? 'bg-white/10 border-white/10 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/30 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Modern login form',
            'Dashboard card with charts', 
            'Hero section for landing page',
            'Product card grid',
            'Testimonial carousel'
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(suggestion);
                generateUIComponent(suggestion);
              }}
              disabled={isGeneratingUI}
              className="text-xs opacity-70 hover:opacity-100"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </form>
    </div>
  );
}