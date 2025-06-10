/**
 * 🤖 AI-Powered Element Finder
 * Uses OpenAI to convert natural language descriptions into CSS selectors
 */

import { Page, Locator } from '@playwright/test';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface ElementDescription {
  description: string;
  suggestedSelectors?: string[];
  context?: string;
}

interface SelectorSuggestion {
  selector: string;
  confidence: number;
  reasoning: string;
  type: 'css' | 'xpath' | 'text' | 'role';
}

class AIElementFinder {
  private openai: OpenAI;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found. Using fallback selector generation.');
    } else {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * Find element using AI-generated selectors from natural language
   */
  async findElement(description: string, options?: {
    maxAttempts?: number;
    timeout?: number;
    includeContext?: boolean;
  }): Promise<Locator> {
    const maxAttempts = options?.maxAttempts || 5;
    const timeout = options?.timeout || 10000;
    const includeContext = options?.includeContext !== false;

    console.log(`🤖 AI: Finding element described as "${description}"`);

    // Get page context if requested
    let pageContext = '';
    if (includeContext) {
      pageContext = await this.getPageContext();
    }

    // Get AI-generated selectors
    const suggestions = await this.generateSelectors(description, pageContext);
    
    // Try each suggestion
    for (let i = 0; i < Math.min(suggestions.length, maxAttempts); i++) {
      const suggestion = suggestions[i];
      
      try {
        console.log(`   ${i + 1}. Trying: ${suggestion.selector} (${suggestion.confidence}% confidence)`);
        console.log(`      Reasoning: ${suggestion.reasoning}`);
        
        const locator = this.page.locator(suggestion.selector);
        
        // Test if element exists and is actionable
        await locator.first().waitFor({ timeout: 2000 });
        const count = await locator.count();
        
        if (count > 0) {
          console.log(`   ✅ AI SUCCESS: Found ${count} element(s) with "${suggestion.selector}"`);
          return locator.first();
        }
        
      } catch (error) {
        console.log(`   ❌ Failed: ${suggestion.selector}`);
        continue;
      }
    }
    
    // If all AI suggestions fail, try semantic fallbacks
    console.log('🔄 AI suggestions failed, trying semantic fallbacks...');
    return await this.semanticFallback(description);
  }

  /**
   * Generate CSS selectors using OpenAI
   */
  private async generateSelectors(description: string, pageContext: string): Promise<SelectorSuggestion[]> {
    if (!this.openai) {
      return this.fallbackSelectorGeneration(description);
    }

    try {
      const prompt = this.buildPrompt(description, pageContext);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Faster and cheaper for this task
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(response);
      
    } catch (error) {
      console.warn(`⚠️ OpenAI API error: ${error.message}`);
      return this.fallbackSelectorGeneration(description);
    }
  }

  /**
   * Build the AI prompt with context
   */
  private buildPrompt(description: string, pageContext: string): string {
    return `You are a web testing expert. Generate CSS selectors for Playwright based on natural language descriptions.

DESCRIPTION: "${description}"

PAGE CONTEXT:
${pageContext}

Please provide 5 CSS selectors ranked by confidence (1-100). Consider:
- Element semantics (form controls, buttons, inputs)
- Text content and labels  
- HTML structure and attributes
- Accessibility attributes (aria-label, role, etc.)
- Context within the page

Return ONLY a JSON array in this exact format:
[
  {
    "selector": "css-selector-here",
    "confidence": 95,
    "reasoning": "Why this selector should work",
    "type": "css"
  }
]

Focus on robust selectors that won't break easily. Prefer semantic attributes over classes.`;
  }

  /**
   * Parse AI response into selector suggestions
   */
  private parseAIResponse(response: string): SelectorSuggestion[] {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      
      // Validate and sort by confidence
      return suggestions
        .filter((s: any) => s.selector && s.confidence && s.reasoning)
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 5); // Take top 5
        
    } catch (error) {
      console.warn(`⚠️ Failed to parse AI response: ${error.message}`);
      return this.fallbackSelectorGeneration(description);
    }
  }

  /**
   * Get relevant page context for AI
   */
  private async getPageContext(): Promise<string> {
    try {
      // Get page HTML structure (simplified)
      const context = await this.page.evaluate(() => {
        const body = document.body;
        const elements: string[] = [];
        
        // Get form elements
        const forms = body.querySelectorAll('form');
        forms.forEach((form, i) => {
          elements.push(`FORM ${i + 1}:`);
          const inputs = form.querySelectorAll('input, button, select, textarea');
          inputs.forEach(input => {
            const tag = input.tagName.toLowerCase();
            const type = input.getAttribute('type') || '';
            const id = input.id || '';
            const className = input.className || '';
            const placeholder = input.getAttribute('placeholder') || '';
            const text = input.textContent?.trim() || '';
            const ariaLabel = input.getAttribute('aria-label') || '';
            
            elements.push(`  ${tag}${type ? '[type="' + type + '"]' : ''}${id ? '#' + id : ''}${className ? '.' + className.split(' ').join('.') : ''} - "${text || placeholder || ariaLabel}"`);
          });
        });
        
        // Get buttons outside forms
        const buttons = body.querySelectorAll('button:not(form button)');
        if (buttons.length > 0) {
          elements.push('BUTTONS:');
          buttons.forEach(btn => {
            const id = btn.id || '';
            const className = btn.className || '';
            const text = btn.textContent?.trim() || '';
            elements.push(`  button${id ? '#' + id : ''}${className ? '.' + className.split(' ').join('.') : ''} - "${text}"`);
          });
        }
        
        return elements.join('\n');
      });
      
      return context || 'No relevant context found';
      
    } catch (error) {
      return 'Failed to extract page context';
    }
  }

  /**
   * Fallback selector generation (no AI)
   */
  private fallbackSelectorGeneration(description: string): SelectorSuggestion[] {
    const lower = description.toLowerCase();
    const suggestions: SelectorSuggestion[] = [];

    // Login button patterns
    if (lower.includes('login') && lower.includes('button')) {
      suggestions.push(
        { selector: 'button[type="submit"]', confidence: 90, reasoning: 'Submit buttons are commonly login buttons', type: 'css' },
        { selector: 'text=/sign.*in/i', confidence: 85, reasoning: 'Text-based matching for sign in', type: 'text' },
        { selector: 'button:has-text("login")', confidence: 80, reasoning: 'Button containing login text', type: 'css' },
        { selector: 'input[type="submit"]', confidence: 75, reasoning: 'Submit input alternative', type: 'css' },
        { selector: '[role="button"]:has-text(/login|sign/i)', confidence: 70, reasoning: 'ARIA button role with login text', type: 'css' }
      );
    }

    // Email input patterns
    if (lower.includes('email') && lower.includes('input')) {
      suggestions.push(
        { selector: 'input[type="email"]', confidence: 95, reasoning: 'Semantic email input type', type: 'css' },
        { selector: 'input[name*="email"]', confidence: 85, reasoning: 'Input with email in name attribute', type: 'css' },
        { selector: 'input[placeholder*="email"]', confidence: 80, reasoning: 'Input with email in placeholder', type: 'css' },
        { selector: '#email', confidence: 75, reasoning: 'Common email input ID', type: 'css' }
      );
    }

    // Password input patterns
    if (lower.includes('password') && lower.includes('input')) {
      suggestions.push(
        { selector: 'input[type="password"]', confidence: 95, reasoning: 'Semantic password input type', type: 'css' },
        { selector: 'input[name*="password"]', confidence: 85, reasoning: 'Input with password in name', type: 'css' },
        { selector: '#password', confidence: 80, reasoning: 'Common password input ID', type: 'css' }
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Semantic fallback when AI fails
   */
  private async semanticFallback(description: string): Promise<Locator> {
    const lower = description.toLowerCase();
    
    // Try common patterns
    const patterns = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button',
      '[role="button"]',
      'a[href]',
      '*'
    ];

    for (const pattern of patterns) {
      try {
        const locator = this.page.locator(pattern);
        const count = await locator.count();
        
        if (count > 0) {
          console.log(`🔧 Semantic fallback found: ${pattern}`);
          return locator.first();
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error(`❌ Could not find element: "${description}"`);
  }
}

export { AIElementFinder, ElementDescription, SelectorSuggestion }; 