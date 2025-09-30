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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update generated code when currentCode changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} max-w-none`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-[#2563eb]'
                      : 'bg-[#1a1a1a] border border-[#333]'
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
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-[#2a2a2a] text-gray-100 border border-[#333]'
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
            className="flex justify-start max-w-none"
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                {currentProgress ? (
                  <ProgressDisplay progress={currentProgress} />
                ) : (
                  <div className="p-4 rounded-2xl bg-[#2a2a2a] border border-[#333]">
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
                      <span className="text-gray-400 text-sm ml-2">Baymax-NX is working...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#2a2a2a] p-4 bg-[#1a1a1a]">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can Bolt help you today? (or /command)"
              className="w-full bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg px-4 py-3 border border-[#333] focus:border-blue-500 focus:outline-none resize-none min-h-[44px] max-h-[120px] transition-colors"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-lg transition-colors ${
              isLoading || !input.trim()
                ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}