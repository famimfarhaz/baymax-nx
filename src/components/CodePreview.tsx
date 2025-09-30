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
    <div className="h-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-gray-300 text-sm">Preview</span>
        </div>
        
        <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-md p-1">
          {[
            { size: 'desktop' as ViewportSize, icon: Monitor },
            { size: 'tablet' as ViewportSize, icon: Tablet },
            { size: 'mobile' as ViewportSize, icon: Smartphone },
          ].map(({ size, icon: Icon }) => (
            <button
              key={size}
              onClick={() => setViewport(size)}
              className={`p-2 rounded transition-colors ${
                viewport === size
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#333]'
              }`}
              title={`${size} view`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-[#0d0d0d] overflow-hidden relative">
        {/* Bolt.new style background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {isLoading ? (
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Your preview will appear here</p>
            </div>
          </div>
        ) : code ? (
          <div className="relative h-full flex items-center justify-center p-4">
            <div 
              className={`${getViewportClass()} transition-all duration-300 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200`}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Website Preview"
              />
            </div>
          </div>
        ) : (
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Your preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}