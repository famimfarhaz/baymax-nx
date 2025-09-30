import { aiRouter } from './aiRouter';

export interface UIGenerationOptions {
  componentType: 'page' | 'component' | 'layout' | 'form' | 'dashboard' | 'landing';
  style: 'modern' | 'minimal' | 'vibrant' | 'corporate' | 'creative';
  complexity: 'simple' | 'intermediate' | 'complex';
  animations: boolean;
  responsive: boolean;
  darkMode: boolean;
}

export class UIGenerator {
  
  private getStylePreferences(style: string): string {
    const styleMap = {
      modern: 'clean lines, subtle shadows, modern typography, balanced white space, neutral colors with accent colors',
      minimal: 'maximum white space, simple typography, monochromatic palette, clean borders, focus on content',
      vibrant: 'bold colors, gradients, strong contrast, dynamic elements, energetic feel',
      corporate: 'professional appearance, structured layout, blue/gray palette, formal typography',
      creative: 'unique layouts, artistic elements, creative color combinations, unconventional design patterns'
    };
    return styleMap[style as keyof typeof styleMap] || styleMap.modern;
  }

  private getComponentStructure(componentType: string): string {
    const structureMap = {
      page: 'full page layout with header, main content area, and footer',
      component: 'reusable component with props interface and proper TypeScript types',
      layout: 'layout component with slot areas for different content sections',
      form: 'form component with validation, error handling, and submission logic',
      dashboard: 'dashboard layout with widgets, charts, and data visualization areas',
      landing: 'landing page with hero section, features, testimonials, and call-to-action'
    };
    return structureMap[componentType as keyof typeof structureMap] || structureMap.component;
  }

  async generateUIComponent(
    prompt: string, 
    options: Partial<UIGenerationOptions> = {}
  ): Promise<string> {
    const opts: UIGenerationOptions = {
      componentType: 'component',
      style: 'modern',
      complexity: 'intermediate',
      animations: true,
      responsive: true,
      darkMode: true,
      ...options
    };

    const stylePrefs = this.getStylePreferences(opts.style);
    const componentStructure = this.getComponentStructure(opts.componentType);

    const enhancedPrompt = `Create a stunning React component with TypeScript and Tailwind CSS.

PROJECT SETUP:
- This project uses Shadcn/ui components (import from @/components/ui/*)
- Available Shadcn components: Button, Card, Badge, Textarea, Input, Label, Select, Separator, Tabs, Dialog, Sheet
- Use Framer Motion for animations (already installed)
- Tailwind CSS is configured with proper variables
- TypeScript with strict mode

USER REQUEST: ${prompt}

COMPONENT SPECIFICATIONS:
- Type: ${componentStructure}
- Style: ${stylePrefs}
- Complexity: ${opts.complexity}
- Responsive: ${opts.responsive ? 'Mobile-first responsive design' : 'Desktop-focused design'}
- Animations: ${opts.animations ? 'Smooth animations with Framer Motion' : 'No animations, focus on performance'}
- Dark Mode: ${opts.darkMode ? 'Support for dark/light mode with CSS variables' : 'Light mode only'}

REQUIREMENTS:
1. **Modern React Patterns:**
   - Use functional components with hooks
   - Proper TypeScript interfaces
   - Clean props destructuring
   - Custom hooks if needed

2. **Tailwind CSS Best Practices:**
   - Use CSS variables for theming: hsl(var(--primary)), hsl(var(--background))
   - Responsive breakpoints: sm:, md:, lg:, xl:
   - Modern spacing: space-y-*, gap-*, p-*, m-*
   - Use Tailwind's design tokens

3. **Shadcn/ui Integration:**
   - Import needed components from @/components/ui/
   - Use consistent styling with Shadcn components
   - Follow Shadcn's design patterns

4. **Accessibility (A11Y):**
   - Proper ARIA labels and roles
   - Keyboard navigation support
   - Focus management
   - Screen reader friendly

5. **Performance:**
   - Optimized re-renders
   - Lazy loading where appropriate
   - Efficient state management

6. **Animation Guidelines (if enabled):**
   - Use Framer Motion for complex animations
   - Subtle micro-interactions
   - Respect prefers-reduced-motion
   - Performance-conscious animations

EXAMPLE IMPORT STRUCTURE:
\`\`\`typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Star } from "lucide-react";
\`\`\`

DESIGN PRINCIPLES:
- Follow the ${opts.style} design aesthetic
- Use consistent spacing and typography
- Implement proper hover and focus states
- Include loading and error states
- Follow modern UI patterns and trends

Please generate ONLY the React component code with proper imports and TypeScript interfaces. Make it production-ready and visually stunning.`;

    return await aiRouter.generateUIComponent(enhancedPrompt);
  }

  async generateFullPage(
    description: string,
    options: Partial<UIGenerationOptions> = {}
  ): Promise<string> {
    return this.generateUIComponent(description, {
      ...options,
      componentType: 'page'
    });
  }

  async generateDashboard(
    description: string,
    options: Partial<UIGenerationOptions> = {}
  ): Promise<string> {
    return this.generateUIComponent(description, {
      ...options,
      componentType: 'dashboard',
      complexity: 'complex'
    });
  }

  async generateLandingPage(
    description: string,
    options: Partial<UIGenerationOptions> = {}
  ): Promise<string> {
    return this.generateUIComponent(description, {
      ...options,
      componentType: 'landing',
      complexity: 'complex',
      animations: true
    });
  }

  async generateForm(
    description: string,
    options: Partial<UIGenerationOptions> = {}
  ): Promise<string> {
    const formPrompt = `${description}

Additional Form Requirements:
- Proper form validation with error messages
- Loading states during submission
- Success/error feedback
- Accessible form labels and inputs
- Form state management with React hooks
- TypeScript interfaces for form data`;

    return this.generateUIComponent(formPrompt, {
      ...options,
      componentType: 'form'
    });
  }

  // Quick style iterations
  async applyStyleChanges(
    currentCode: string,
    styleChanges: string
  ): Promise<string> {
    const instruction = `Apply these style changes to the component: ${styleChanges}

Keep the same functionality but update the visual styling, colors, spacing, or animations as requested. Maintain the existing component structure and TypeScript interfaces.`;

    return await aiRouter.quickIteration(instruction, currentCode);
  }

  // Generate responsive variants
  async makeResponsive(currentCode: string): Promise<string> {
    const instruction = `Make this component fully responsive with mobile-first design:

- Add appropriate Tailwind responsive breakpoints (sm:, md:, lg:, xl:)
- Optimize layout for mobile, tablet, and desktop
- Adjust typography scales for different screen sizes
- Ensure touch-friendly interaction areas on mobile
- Optimize spacing and layout for different viewports`;

    return await aiRouter.quickIteration(instruction, currentCode);
  }

  // Add animations to existing component
  async addAnimations(currentCode: string): Promise<string> {
    const instruction = `Add smooth animations using Framer Motion to this component:

- Import motion from 'framer-motion'
- Add enter/exit animations
- Include hover and tap animations
- Add staggered animations for list items if present
- Ensure animations respect prefers-reduced-motion
- Keep animations subtle and professional`;

    return await aiRouter.quickIteration(instruction, currentCode);
  }
}

export const uiGenerator = new UIGenerator();