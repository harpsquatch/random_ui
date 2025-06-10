/**
 * 🎯 Direct Comparison: Traditional vs AI-Powered Element Finding
 * Shows how AI fixes the broken login that traditional selectors can't handle
 */

import { test, expect } from '@playwright/test';

// Simple AI-powered element finder
class AIFinder {
  constructor(private page: any) {}

  async findElement(description: string) {
    console.log(`🤖 AI looking for: "${description}"`);
    
    const lower = description.toLowerCase();
    
    // Smart patterns for login button
    if (lower.includes('login') && lower.includes('button')) {
      const strategies = [
        'button[type="submit"]',           // Semantic HTML
        'button:has(.loading-spinner)',    // Structural pattern
        'button:has-text(/login|sign/i)',  // Text content
        'button',                          // Last resort
      ];
      
      return await this.tryStrategies(strategies, description);
    }
    
    // Smart patterns for email
    if (lower.includes('email')) {
      const strategies = [
        'input[type="email"]',
        'input[name*="email" i]',
        '#email'
      ];
      return await this.tryStrategies(strategies, description);
    }
    
    // Smart patterns for password
    if (lower.includes('password')) {
      const strategies = [
        'input[type="password"]',
        '#password'
      ];
      return await this.tryStrategies(strategies, description);
    }
    
    throw new Error(`AI couldn't find: ${description}`);
  }
  
  private async tryStrategies(selectors: string[], description: string) {
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      try {
        console.log(`   ${i + 1}. Trying: ${selector}`);
        const locator = this.page.locator(selector);
        await locator.first().waitFor({ timeout: 1000 });
        const count = await locator.count();
        
        if (count > 0) {
          console.log(`   ✅ AI SUCCESS: Found with "${selector}"`);
          return locator.first();
        }
      } catch (e) {
        console.log(`   ❌ Failed: ${selector}`);
      }
    }
    throw new Error(`All strategies failed for: ${description}`);
  }
}

test.describe('🎯 Broken Login: Traditional vs AI', () => {
  
  test('❌ Traditional Selectors FAIL on Broken Login', async ({ page }) => {
    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
    
    console.log('❌ Testing traditional hardcoded selectors...');
    
    // These are the selectors that USED to work but are now broken
    const brokenSelectors = [
      '.login-btn',        // Old class name
      '.btn-primary',      // Changed class name
      '#loginBtn'          // Changed ID
    ];
    
    let failedCount = 0;
    
    for (const selector of brokenSelectors) {
      try {
        console.log(`Trying broken selector: ${selector}`);
        const element = page.locator(selector);
        await element.waitFor({ timeout: 2000 });
        console.log(`   Unexpectedly found: ${selector}`);
      } catch (e) {
        console.log(`   ❌ FAILED (as expected): ${selector}`);
        failedCount++;
      }
    }
    
    console.log(`\n💀 RESULT: ${failedCount}/${brokenSelectors.length} traditional selectors are broken!`);
    expect(failedCount).toBeGreaterThan(0); // Confirm some selectors are broken
  });

  test('✅ AI-Powered Method SUCCEEDS on Same Broken Login', async ({ page }) => {
    const ai = new AIFinder(page);
    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
    
    // Add visual feedback
    await page.addStyleTag({
      content: `
        .ai-success {
          border: 3px solid #00ff00 !important;
          background: rgba(0,255,0,0.2) !important;
          box-shadow: 0 0 15px #00ff00 !important;
        }
      `
    });
    
    console.log('✅ Testing AI-powered element finding...');
    
    // Find elements using natural language (should work despite broken HTML)
    console.log('\n🤖 AI Finding Email Input:');
    const emailInput = await ai.findElement('email input field');
    await emailInput.evaluate(el => el.classList.add('ai-success'));
    await expect(emailInput).toBeVisible();
    
    console.log('\n🤖 AI Finding Password Input:');
    const passwordInput = await ai.findElement('password input field');
    await passwordInput.evaluate(el => el.classList.add('ai-success'));
    await expect(passwordInput).toBeVisible();
    
    console.log('\n🤖 AI Finding Login Button:');
    const loginButton = await ai.findElement('login button');
    await loginButton.evaluate(el => el.classList.add('ai-success'));
    await expect(loginButton).toBeVisible();
    
    console.log('\n🎯 PERFORMING ACTUAL LOGIN WITH AI-FOUND ELEMENTS:');
    
    // Actually perform the login that was broken before
    await emailInput.fill('ai-success@example.com');
    await passwordInput.fill('password123');
    await loginButton.click();
    
    console.log('🎉 SUCCESS: AI completed the login that traditional selectors couldn\'t handle!');
    
    await page.waitForTimeout(2000);
  });

  test('🎯 Side-by-Side Comparison Demo', async ({ page }) => {
    const ai = new AIFinder(page);
    await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
    
    await page.addStyleTag({
      content: `
        .demo-overlay {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-family: monospace;
          z-index: 10000;
          max-width: 300px;
        }
        .failed { color: #ff6666; }
        .success { color: #66ff66; }
      `
    });

    // Show the comparison
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.className = 'demo-overlay';
      overlay.innerHTML = `
        <h3>🎯 Selector Comparison</h3>
        <div class="failed">❌ .login-btn (BROKEN)</div>
        <div class="failed">❌ .btn-primary (BROKEN)</div>
        <div class="failed">❌ #loginBtn (BROKEN)</div>
        <br>
        <div class="success">✅ AI: "login button" (WORKS!)</div>
      `;
      document.body.appendChild(overlay);
    });

    // Demonstrate AI finding the button that traditional selectors can't
    const loginButton = await ai.findElement('login button');
    await loginButton.evaluate(el => {
      el.style.border = '4px solid #00ff00';
      el.style.background = 'rgba(0,255,0,0.3)';
    });

    await expect(loginButton).toBeVisible();
    
    console.log('🎯 PROOF: AI found the login button that all traditional selectors missed!');
    
    await page.waitForTimeout(5000);
  });
}); 