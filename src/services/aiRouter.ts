import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { extractAndCleanCode } from '../utils/codeExtractor';

// API Keys - In production, use environment variables
const GEMINI_API_KEY = 'AIzaSyAJwFxbOkz0T2h82_zcdUBNfDeGRLX93zw';
const CLAUDE_API_KEY = ''; // Add your Claude API key here
const GROQ_API_KEY = ''; // Add your Groq API key here

// Initialize AI clients
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - use server-side in production
});
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - use server-side in production
});

export enum AIProvider {
  GEMINI = 'gemini',
  CLAUDE = 'claude',
  GROQ = 'groq'
}

export enum TaskType {
  UI_DESIGN = 'ui_design',
  BACKEND_LOGIC = 'backend_logic',
  QUICK_ITERATION = 'quick_iteration',
  CODE_REVIEW = 'code_review',
  COMPONENT_GENERATION = 'component_generation'
}

export class AIRouter {
  private geminiModel = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

  // Route task to the best AI provider
  private routeTask(taskType: TaskType): AIProvider {
    switch (taskType) {
      case TaskType.UI_DESIGN:
      case TaskType.COMPONENT_GENERATION:
        return AIProvider.CLAUDE; // Claude is best for UI/UX
      
      case TaskType.QUICK_ITERATION:
        return AIProvider.GROQ; // Groq is fastest
      
      case TaskType.BACKEND_LOGIC:
      case TaskType.CODE_REVIEW:
        return AIProvider.GEMINI; // Gemini is good for logic
      
      default:
        return AIProvider.GEMINI;
    }
  }

  // Generate UI components using Claude (best for UI design)
  async generateUIComponent(prompt: string, context?: string): Promise<string> {
    const provider = this.routeTask(TaskType.UI_DESIGN);
    
    const uiPrompt = `You are a UI/UX expert specializing in modern React components with Tailwind CSS. Create beautiful, responsive, and accessible components.

Requirements:
- Use React with TypeScript
- Use Tailwind CSS for styling
- Include proper animations and interactions
- Follow modern design principles
- Make it mobile-responsive
- Include proper accessibility attributes

Context: ${context || 'New component'}

User Request: ${prompt}

Generate a complete React component with:
1. Clean TypeScript interface definitions
2. Beautiful Tailwind styling
3. Smooth animations using Framer Motion if needed
4. Proper responsive design
5. Modern UI patterns

Return only the React component code:`;

    if (provider === AIProvider.CLAUDE && CLAUDE_API_KEY) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{ role: 'user', content: uiPrompt }]
        });
        
        const rawResponse = response.content[0].type === 'text' ? response.content[0].text : '';
        return extractAndCleanCode(rawResponse);
      } catch (error) {
        console.warn('Claude API failed, falling back to Gemini:', error);
        return this.fallbackToGemini(uiPrompt);
      }
    } else {
      // Fallback to Gemini with improved UI prompt
      return this.fallbackToGemini(uiPrompt);
    }
  }

  // Quick iterations using Groq (fastest response)
  async quickIteration(instruction: string, currentCode: string): Promise<string> {
    const provider = this.routeTask(TaskType.QUICK_ITERATION);
    
    const iterationPrompt = `Make this quick modification to the React component:

Instruction: ${instruction}

Current Code:
${currentCode}

Return the complete updated component code:`;

    if (provider === AIProvider.GROQ && GROQ_API_KEY) {
      try {
        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: iterationPrompt }],
          model: 'llama-3.1-70b-versatile',
          max_tokens: 2000,
          temperature: 0.3
        });
        
        const rawResponse = response.choices[0]?.message?.content || '';
        return extractAndCleanCode(rawResponse);
      } catch (error) {
        console.warn('Groq API failed, falling back to Gemini:', error);
        return this.fallbackToGemini(iterationPrompt);
      }
    } else {
      return this.fallbackToGemini(iterationPrompt);
    }
  }

  // Backend logic generation using Gemini
  async generateBackendLogic(prompt: string, context?: string): Promise<string> {
    const logicPrompt = `You are a backend development expert. Generate clean, efficient backend code.

Context: ${context || 'New backend logic'}
Request: ${prompt}

Focus on:
- Clean architecture
- Error handling
- Type safety
- Performance
- Security best practices

Generate the complete backend code:`;

    return this.fallbackToGemini(logicPrompt);
  }

  // Fallback to Gemini for any task
  private async fallbackToGemini(prompt: string): Promise<string> {
    try {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const rawResponse = response.text();
      return extractAndCleanCode(rawResponse);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('All AI providers failed. Please try again.');
    }
  }

  // Check which providers are available
  getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [AIProvider.GEMINI]; // Gemini is always available
    
    if (CLAUDE_API_KEY) providers.push(AIProvider.CLAUDE);
    if (GROQ_API_KEY) providers.push(AIProvider.GROQ);
    
    return providers;
  }
}

export const aiRouter = new AIRouter();