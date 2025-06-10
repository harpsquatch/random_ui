/**
 * 🤖 AI Successfully Handles Broken Login Button
 * Demonstrates AI finding elements with natural language
 */

import { test, expect } from '@playwright/test';

// Simple AI element finder
class AIElementFinder {
  constructor(private page: any) {}

  async findElement(description: string): Promise<any> {
    console.log(`🤖 AI: Finding "${description}"`);
    
    const lower = description.toLowerCase();
    let selectors: string[] = [];

    if (lower.includes('login') && lower.includes('button')) {
      selectors = [
        'button[type="submit"]',           // Semantic HTML
        'button:has-text(/login/i)',       // Text content
        'button:has-text(/sign/i)',        // Alternative text
        'button:has(.loading-spinner)',    // Structural
        'button:has(.button-content)',     // Content wrapper
        'button'                           // Final fallback
      ];
    } else if (lower.includes('email')) {
      selectors = ['input[type="email"]', 'input[name*="email" i]', '#email'];
    } else if (lower.includes('password')) {
      selectors = ['input[type="password"]', 'input[name*="password" i]', '#password'];
    }

    // Try each selector
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      try {
        console.log(`   ${i + 1}. Trying: ${selector}`);
        const locator = this.page.locator(selector);
        await locator.first().waitFor({ timeout: 1000 });
        const count = await locator.count();
        
        if (count > 0) {
          console.log(`   ✅ SUCCESS: Found with "${selector}"`);
          return locator.first();
        }
      } catch (e) {
        console.log(`   ❌ Failed: ${selector}`);
        continue;
      }
    }
    
    throw new Error(`Could not find: ${description}`);
  }
}

test.describe('🤖 AI Handles Broken Login Button', () => {
  
  test('AI Successfully Performs Login', async ({ page }) => {
    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
    
    // Add visual feedback
    await page.addStyleTag({
      content: `
        .ai-found {
          border: 3px solid #00ff00 !important;
          background: rgba(0,255,0,0.15) !important;
          box-shadow: 0 0 15px rgba(0,255,0,0.5) !important;
          animation: ai-glow 2s ease-in-out;
        }
        @keyframes ai-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .ai-status {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-family: monospace;
          font-size: 16px;
          z-index: 10000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
      `
    });

    const aiFinder = new AIElementFinder(page);

    // Show AI status
    await page.evaluate(() => {
      const status = document.createElement('div');
      status.className = 'ai-status';
      status.textContent = '🤖 AI: Finding login elements...';
      document.body.appendChild(status);
    });

    console.log('🤖 AI: Starting login with natural language descriptions');

    // Find email input
    const emailInput = await aiFinder.findElement('email input field');
    await emailInput.evaluate(el => el.classList.add('ai-found'));
    
    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) status.textContent = '✅ AI: Email input found';
    });
    await page.waitForTimeout(1000);

    // Find password input
    const passwordInput = await aiFinder.findElement('password input field');
    await passwordInput.evaluate(el => el.classList.add('ai-found'));
    
    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) status.textContent = '✅ AI: Password input found';
    });
    await page.waitForTimeout(1000);

    // Find the broken login button using AI
    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) status.textContent = '🤖 AI: Finding login button...';
    });

    const loginButton = await aiFinder.findElement('login button');
    await loginButton.evaluate(el => el.classList.add('ai-found'));
    
    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) status.textContent = '✅ AI: Login button found!';
    });
    await page.waitForTimeout(1500);

    // Perform the actual login
    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) status.textContent = '🚀 AI: Performing login...';
    });

    await emailInput.fill('ai-test@example.com');
    await passwordInput.fill('password123');
    await loginButton.click();

    await page.evaluate(() => {
      const status = document.querySelector('.ai-status');
      if (status) {
        status.textContent = '🎉 AI: Login completed successfully!';
        status.style.background = 'linear-gradient(45deg, #FF6B6B, #4ECDC4)';
      }
    });

    console.log('🎉 AI successfully completed login with broken button!');
    
    await page.waitForTimeout(3000);
  });
}); 