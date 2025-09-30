import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, MessageCircle } from 'lucide-react';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-6 w-80 h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
              <div className="flex items-center space-x-3">
                <Bot className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-white font-semibold">Baymax-NX</h3>
                  <p className="text-blue-100 text-sm">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-full">
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    👋 Hi! I'm Baymax-NX, your AI coding assistant. I can help you:
                  </p>
                </div>
                
                <div className="space-y-2">
                  {[
                    'Build websites from scratch',
                    'Add new features to existing code',
                    'Fix bugs and improve performance',
                    'Make your site mobile responsive',
                    'Add animations and interactions'
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 text-sm text-gray-300"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Building</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}