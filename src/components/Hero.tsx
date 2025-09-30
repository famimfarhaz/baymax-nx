import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Code } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeroProps {
  onStartBuilding: (prompt: string) => void;
  isLoading: boolean;
}

export default function Hero({ onStartBuilding, isLoading }: HeroProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter your idea first!');
      return;
    }
    onStartBuilding(prompt.trim());
  };

  const suggestions = [
    "Create a modern portfolio website for a designer",
    "Build a landing page for a SaaS startup",
    "Make a restaurant menu with online ordering",
    "Design a blog about technology trends"
  ];

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Multiple Floating Gradient Orbs */}
        <motion.div
          className="absolute -top-20 -right-32 w-96 h-96 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-gray-900/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-gray-800/40 via-slate-800/30 to-gray-900/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.4],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-bl from-indigo-900/30 via-purple-900/20 to-gray-800/30 rounded-full blur-2xl"
          animate={{ 
            scale: [0.8, 1.1, 0.9],
            rotate: [0, -90, -180],
            x: [0, 60, 0],
            y: [0, -40, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Animated Grid Pattern */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.15)_1px,transparent_1px)] [background-size:60px_60px]"
          animate={{ 
            backgroundPosition: ['0px 0px', '60px 60px', '0px 0px']
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
        
        {/* Constellation Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 6px rgba(255,255,255,0.4)'
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Connecting Lines Between Stars */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </svg>
        
        {/* Glass morphism overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-gray-900/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/5 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo and Branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20">
              <div className="relative">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Vibe Coding</h1>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            What will{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Baymax-NX
            </span>{' '}
            build today?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your ideas into beautiful, functional websites with the power of AI. 
            No coding required, just describe what you want.
          </motion.p>

          {/* Main Input */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative">
              {/* Glass morphism glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-white/10 via-gray-500/20 to-white/10 rounded-2xl blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              {/* Glass morphism input container */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl ring-1 ring-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your idea and we'll build it together with Baymax-NX..."
                      className="w-full bg-white/5 text-white text-lg placeholder-gray-400 border-none outline-none resize-none min-h-[60px] max-h-[120px] selection:bg-white/20 rounded-xl p-3 backdrop-blur-sm"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-xl ${
                      isLoading || !prompt.trim()
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/20'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 hover:border-white/50 hover:shadow-lg hover:shadow-white/10'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Building...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Build</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.form>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8"
          >
            <p className="text-gray-400 text-sm mb-4 flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Try these ideas or create your own
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-sm rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-xl hover:shadow-white/10"
                  disabled={isLoading}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}