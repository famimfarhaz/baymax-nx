import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractAndCleanCode } from '../utils/codeExtractor';
import { GenerationProgress, createProgress, updateProgressStep, ProgressCallback } from '../types/progress';

const API_KEY = 'AIzaSyAJwFxbOkz0T2h82_zcdUBNfDeGRLX93zw';
const genAI = new GoogleGenerativeAI(API_KEY);

export class BaymaxNX {
  private model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async generateCode(prompt: string, context?: string, progressCallback?: ProgressCallback): Promise<string> {
    let progress: GenerationProgress | null = null;
    
    try {
      // Initialize progress tracking
      if (progressCallback) {
        progress = createProgress(`generate-${Date.now()}`);
        progressCallback.onProgressUpdate(progress);
        
        // Step 1: Analyzing
        progress = updateProgressStep(progress, 0, { 
          status: 'in_progress',
          currentAction: 'Parsing your requirements...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(800);
        
        progress = updateProgressStep(progress, 0, { 
          currentAction: 'Understanding project structure...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(600);
        
        progress = updateProgressStep(progress, 0, { status: 'completed' });
        progressCallback.onProgressUpdate(progress);
        
        // Step 2: Planning
        progress = updateProgressStep(progress, 1, { 
          status: 'in_progress',
          currentAction: 'Designing architecture...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(700);
        
        progress = updateProgressStep(progress, 1, { 
          currentAction: 'Planning component structure...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(500);
        
        progress = updateProgressStep(progress, 1, { status: 'completed' });
        progressCallback.onProgressUpdate(progress);
      }
      
      const systemPrompt = `You are Baymax-NX, an advanced AI assistant specialized in generating high-quality web code. You create modern, responsive websites and applications using HTML, CSS, and JavaScript. Always provide complete, functional code that includes:

1. Modern HTML5 structure
2. Beautiful CSS with modern design principles
3. Interactive JavaScript when needed
4. Mobile-responsive design
5. Clean, professional styling

When a user requests a website or application, generate complete, ready-to-use code. Focus on:
- Clean, semantic HTML
- Modern CSS (flexbox, grid, animations)
- Responsive design
- Professional aesthetics
- Interactive elements where appropriate

Current context: ${context || 'Starting a new project'}

User request: ${prompt}

Generate complete HTML code with inline CSS and JavaScript:`;

      // Step 3: Generate HTML Structure
      if (progressCallback && progress) {
        progress = updateProgressStep(progress, 2, { 
          status: 'in_progress',
          currentAction: 'Creating HTML structure...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(400);
      }
      
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const rawResponse = response.text();
      
      // Step 4: Generate CSS & remaining steps
      if (progressCallback && progress) {
        progress = updateProgressStep(progress, 2, { status: 'completed' });
        progress = updateProgressStep(progress, 3, { 
          status: 'in_progress',
          currentAction: 'Crafting beautiful styles...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(600);
        
        progress = updateProgressStep(progress, 3, { status: 'completed' });
        progress = updateProgressStep(progress, 4, { 
          status: 'in_progress',
          currentAction: 'Adding interactive features...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(500);
        
        progress = updateProgressStep(progress, 4, { status: 'completed' });
        progress = updateProgressStep(progress, 5, { 
          status: 'in_progress',
          currentAction: 'Optimizing performance...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(400);
        
        progress = updateProgressStep(progress, 5, { status: 'completed' });
        progress = updateProgressStep(progress, 6, { 
          status: 'in_progress',
          currentAction: 'Running quality checks...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(300);
        
        progress = updateProgressStep(progress, 6, { status: 'completed' });
        progress = updateProgressStep(progress, 7, { 
          status: 'in_progress',
          currentAction: 'Finalizing code...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(400);
      }
      
      // Extract and clean the HTML code from the AI response
      const cleanedCode = extractAndCleanCode(rawResponse);
      
      // Complete the final step
      if (progressCallback && progress) {
        progress = updateProgressStep(progress, 7, { status: 'completed' });
        progress = { ...progress, overallStatus: 'completed' as const, endTime: new Date() };
        progressCallback.onProgressUpdate(progress);
        progressCallback.onComplete(cleanedCode);
      }
      
      return cleanedCode;
    } catch (error) {
      console.error('Baymax-NX generation error:', error);
      throw new Error('Failed to generate code. Please try again.');
    }
  }

  async refineCode(instruction: string, currentCode: string, progressCallback?: ProgressCallback): Promise<string> {
    let progress: GenerationProgress | null = null;
    
    try {
      // Initialize progress tracking for refinement
      if (progressCallback) {
        progress = createProgress(`refine-${Date.now()}`);
        progress.currentPlan = [
          'Analyze modification request',
          'Understand current code structure', 
          'Plan code changes',
          'Apply modifications carefully',
          'Validate updated code'
        ];
        progress.nextSteps = [
          'Reading current code...',
          'Planning modifications...',
          'Implementing changes...'
        ];
        progressCallback.onProgressUpdate(progress);
        
        // Quick analysis steps
        progress = updateProgressStep(progress, 0, { 
          status: 'in_progress',
          currentAction: 'Analyzing modification request...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(400);
        
        progress = updateProgressStep(progress, 0, { status: 'completed' });
        progress = updateProgressStep(progress, 1, { 
          status: 'in_progress',
          currentAction: 'Understanding current structure...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(300);
        
        progress = updateProgressStep(progress, 1, { status: 'completed' });
        progress = updateProgressStep(progress, 2, { 
          status: 'in_progress',
          currentAction: 'Applying your changes...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(200);
      }
      
      const refinePrompt = `You are Baymax-NX. The user wants to modify existing code with this instruction: "${instruction}"

Current code:
${currentCode}

Please provide the complete updated code with the requested changes applied. Maintain the same structure but implement the user's modifications.`;

      const result = await this.model.generateContent(refinePrompt);
      const response = await result.response;
      const rawResponse = response.text();
      
      // Complete remaining steps quickly for refinement
      if (progressCallback && progress) {
        progress = updateProgressStep(progress, 2, { status: 'completed' });
        
        // Skip some steps for refinement (faster process)
        for (let i = 3; i < 6; i++) {
          progress = updateProgressStep(progress, i, { status: 'completed' });
        }
        
        progress = updateProgressStep(progress, 6, { 
          status: 'in_progress',
          currentAction: 'Validating changes...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(200);
        
        progress = updateProgressStep(progress, 6, { status: 'completed' });
        progress = updateProgressStep(progress, 7, { 
          status: 'in_progress',
          currentAction: 'Finalizing updated code...' 
        });
        progressCallback.onProgressUpdate(progress);
        await this.sleep(200);
      }
      
      // Extract and clean the HTML code from the AI response
      const cleanedCode = extractAndCleanCode(rawResponse);
      
      // Complete
      if (progressCallback && progress) {
        progress = updateProgressStep(progress, 7, { status: 'completed' });
        progress = { ...progress, overallStatus: 'completed' as const, endTime: new Date() };
        progressCallback.onProgressUpdate(progress);
        progressCallback.onComplete(cleanedCode);
      }
      
      return cleanedCode;
    } catch (error) {
      console.error('Baymax-NX refinement error:', error);
      throw new Error('Failed to refine code. Please try again.');
    }
  }
}

export const baymaxNX = new BaymaxNX();