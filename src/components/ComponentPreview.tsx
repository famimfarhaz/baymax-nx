import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Code, 
  Copy, 
  Download, 
  Smartphone, 
  Tablet, 
  Monitor,
  Palette,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ComponentPreviewProps {
  generatedCode: string;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onStyleChange?: (style: string) => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  generatedCode,
  isLoading = false,
  onRegenerate,
  onStyleChange
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [copied, setCopied] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Extract component name from code
  const getComponentName = (code: string): string => {
    const match = code.match(/(?:export\s+)?(?:default\s+)?(?:const|function)\s+(\w+)/);
    return match ? match[1] : 'GeneratedComponent';
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Download code as file
  const handleDownload = () => {
    const componentName = getComponentName(generatedCode);
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get viewport classes
  const getViewportClasses = (size: ViewportSize): string => {
    switch (size) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
        return 'w-full';
    }
  };

  // Render the preview component safely
  const PreviewComponent = () => {
    try {
      // In a real implementation, you would use dynamic imports or eval safely
      // For demo purposes, we'll show a placeholder
      return (
        <div className={`transition-all duration-300 ${getViewportClasses(viewport)}`}>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Component Preview</h3>
                <p className="text-muted-foreground">
                  Generated component would render here
                </p>
                <Badge variant="outline" className="mt-2">
                  {getComponentName(generatedCode)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Preview error');
      return (
        <div className="border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">Preview Error</h3>
          <p className="text-red-600 text-sm mt-2">{previewError}</p>
        </div>
      );
    }
  };

  const viewportIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Component Preview</h2>
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              Generating...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Controls */}
          <div className="flex border rounded-lg p-1">
            {Object.entries(viewportIcons).map(([size, Icon]) => (
              <Button
                key={size}
                variant={viewport === size ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewport(size as ViewportSize)}
                className="px-3"
              >
                <Icon className="w-4 h-4" />
                <span className="sr-only">{size}</span>
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!generatedCode}
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!generatedCode}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          {onRegenerate && (
            <Button
              variant="default"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              <Palette className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <Card className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {activeTab === 'preview' ? 'Live Preview' : 'Generated Code'}
              </CardTitle>
              <TabsList>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              <TabsContent value="preview" className="mt-0 p-6">
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  }>
                    <PreviewComponent />
                  </Suspense>
                </motion.div>
              </TabsContent>

              <TabsContent value="code" className="mt-0 p-0">
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <pre className="bg-muted/50 p-6 text-sm overflow-auto max-h-96 border-t">
                    <code className="text-foreground">
                      {generatedCode || '// Generated code will appear here...'}
                    </code>
                  </pre>
                  
                  {generatedCode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="absolute top-4 right-4 opacity-70 hover:opacity-100"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </CardContent>
        </Tabs>
      </Card>

      {/* Style Suggestions */}
      {onStyleChange && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Quick Style Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'Make it more modern',
                'Add animations',
                'Make it minimal',
                'Add dark mode',
                'Make it responsive',
                'Add hover effects',
                'Use vibrant colors',
                'Make it corporate style'
              ].map((style) => (
                <Button
                  key={style}
                  variant="outline"
                  size="sm"
                  onClick={() => onStyleChange(style)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {style}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComponentPreview;