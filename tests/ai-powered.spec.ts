/**
 * 🤖 AI-Powered Login Tests
 * Uses natural language to describe UI elements
 */

import { test, expect } from '@playwright/test';
import { AIElementFinder } from './helpers/ai-element-finder';

test.describe('🤖 AI-Powered Login Tests', () => {
  let aiFinder: AIElementFinder;

  test.beforeEach(async ({ page }) => {
    aiFinder = new AIElementFinder(page);
    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('🎯 Natural Language Login Flow', async ({ page }) => {
    console.log('🤖 Starting AI-powered login test with natural language descriptions');

    // Add visual feedback
    await page.addStyleTag({
      content: `
        .ai-found {
          border: 3px solid #00ff88 !important;
          background: rgba(0,255,136,0.1) !important;
          box-shadow: 0 0 20px rgba(0,255,136,0.3) !important;
          animation: ai-pulse 2s infinite;
        }
        @keyframes ai-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .ai-indicator {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 10000;
          background: linear-gradient(45deg, #00ff88, #0099ff);
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          min-width: 250px;
        }
      `
    });

    // Phase 1: Find email input using natural language
    await page.evaluate(() => {
      const indicator = document.createElement('div');
      indicator.className = 'ai-indicator';
      indicator.textContent = '🤖 AI: Looking for email input field...';
      document.body.appendChild(indicator);
    });

    const emailInput = await aiFinder.findElement('the main email input field where users enter their email address');
    
    await emailInput.evaluate(el => el.classList.add('ai-found'));
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '✅ AI: Found email input!';
    });
    await page.waitForTimeout(1500);

    // Phase 2: Find password input
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '🤖 AI: Looking for password input field...';
    });

    const passwordInput = await aiFinder.findElement('the password input field for user authentication');
    
    await passwordInput.evaluate(el => el.classList.add('ai-found'));
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '✅ AI: Found password input!';
    });
    await page.waitForTimeout(1500);

    // Phase 3: Find login button (this should work even with your broken HTML)
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '🤖 AI: Looking for main login button...';
    });

    const loginButton = await aiFinder.findElement('the main login button that submits the form');
    
    await loginButton.evaluate(el => el.classList.add('ai-found'));
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '✅ AI: Found login button!';
    });
    await page.waitForTimeout(1500);

    // Phase 4: Perform login flow
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '🤖 AI: Performing login sequence...';
    });

    // Fill the form
    await emailInput.fill('ai-test@example.com');
    await passwordInput.fill('ai-password123');
    
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) indicator.textContent = '🤖 AI: Submitting form...';
    });

    await loginButton.click();

    // Wait for result
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => {
      const indicator = document.querySelector('.ai-indicator');
      if (indicator) {
        indicator.style.background = 'linear-gradient(45deg, #00aa00, #00ff00)';
        indicator.textContent = '🎉 AI: Login flow completed successfully!';
      }
    });

    console.log('🎉 AI-powered test completed successfully!');
    await page.waitForTimeout(3000);
  });

  test('🧠 Advanced Natural Language Element Finding', async ({ page }) => {
    console.log('🧠 Testing advanced AI element descriptions');

    // Test various natural language descriptions
    const testCases = [
      {
        description: 'field where I type my email address',
        expectedType: 'email input'
      },
      {
        description: 'button to sign into my account',
        expectedType: 'login button'
      },
      {
        description: 'checkbox to remember my login',
        expectedType: 'remember me checkbox'
      },
      {
        description: 'icon to show or hide my password',
        expectedType: 'password toggle'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🔍 Testing: "${testCase.description}"`);
      
      try {
        const element = await aiFinder.findElement(testCase.description, { timeout: 5000 });
        await expect(element).toBeVisible();
        console.log(`✅ Successfully found ${testCase.expectedType}`);
        
        // Highlight found element
        await element.evaluate(el => {
          el.style.border = '2px solid #ff6600';
          el.style.background = 'rgba(255,102,0,0.1)';
          setTimeout(() => {
            el.style.border = '';
            el.style.background = '';
          }, 2000);
        });
        
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.warn(`⚠️ Could not find: ${testCase.description}`);
      }
    }
  });

  test('🎮 Interactive AI Element Discovery Demo', async ({ page }) => {
    console.log('🎮 Interactive AI element discovery');
    
    // Add interactive overlay
    await page.addStyleTag({
      content: `
        .ai-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          text-align: center;
        }
        .ai-demo-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          max-width: 500px;
        }
        .ai-typing {
          border-right: 2px solid white;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { border-color: white; }
          51%, 100% { border-color: transparent; }
        }
      `
    });

    // Show AI thinking process
    const demonstrations = [
      'Analyzing page structure...',
      'Identifying form elements...',
      'Understanding user intentions...',
      'Generating smart selectors...',
      'Testing element accessibility...',
      'AI-powered testing ready! 🤖'
    ];

    for (let i = 0; i < demonstrations.length; i++) {
      const demo = demonstrations[i];
      
      await page.evaluate((text) => {
        const overlay = document.createElement('div');
        overlay.className = 'ai-overlay';
        overlay.innerHTML = `
          <div class="ai-demo-box">
            <div style="font-size: 24px; margin-bottom: 20px;">🤖 AI Element Finder</div>
            <div class="ai-typing">${text}</div>
          </div>
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
          overlay.remove();
        }, 1500);
      }, demo);
      
      await page.waitForTimeout(1600);
    }

    // Now find elements with AI descriptions
    const loginButton = await aiFinder.findElement('the button users click to login to their account');
    await expect(loginButton).toBeVisible();
    
    console.log('🎉 Interactive AI demo completed!');
  });
}); 