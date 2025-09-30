import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  isLoading: boolean;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function CodePreview({ code, isLoading }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = React.useState<ViewportSize>('desktop');

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        try {
          doc.open();
          doc.write(code);
          doc.close();
        } catch (error) {
          console.error('Error rendering code in preview:', error);
          // Fallback to display error message
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html>
            <head><title>Preview Error</title></head>
            <body style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
              <h2>Preview Error</h2>
              <p>There was an issue rendering the generated code.</p>
              <p>Please try generating the code again.</p>
            </body>
            </html>
          `);
          doc.close();
        }
      }
    }
  }, [code]);

  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-[768px] h-[600px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-950/70 to-slate-900/50 backdrop-blur-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/15 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]">
        <h3 className="text-white font-semibold">Live Preview</h3>
        
        <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1 border border-white/20">
          {[
            { size: 'desktop' as ViewportSize, icon: Monitor },
            { size: 'tablet' as ViewportSize, icon: Tablet },
            { size: 'mobile' as ViewportSize, icon: Smartphone },
          ].map(({ size, icon: Icon }) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewport(size)}
              className={`p-2 rounded-md transition-colors ${
                viewport === size
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title={`${size} view`}
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-0 bg-gradient-to-br from-slate-900/30 to-slate-950/50 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400">Generating your website...</p>
            </div>
          </div>
        ) : code ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex items-center justify-center"
          >
            <div 
              className={`${getViewportClass()} transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden`}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Website Preview"
              />
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your website preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}