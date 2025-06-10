/**
 * 🎬 Visual Self-Healing Demo - Complete User Flow
 * Watch the self-healing selectors work in real-time with your actual login UI
 * Now includes complete user journey from form filling to final destination
 */

const { chromium } = require('playwright-chromium');
const path = require('path');

// Self-healing selector function with enhanced visual feedback
async function findElementWithFallbacks(page, selectors, elementName) {
  console.log(`\n🔍 SEARCHING for ${elementName}...`);
  
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    console.log(`   ${i + 1}. Trying: ${selector}`);
    
    // Add visual searching indicator
    await page.evaluate((sel, index) => {
      const indicator = document.createElement('div');
      indicator.id = 'search-indicator';
      indicator.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: #007acc; color: white; padding: 10px; border-radius: 5px;
        font-family: monospace; font-size: 14px;
      `;
      indicator.textContent = `🔍 Searching... ${sel}`;
      document.body.appendChild(indicator);
    }, selector, i + 1);
    
    // Wait a moment for visual effect
    await page.waitForTimeout(1500);
    
    const locator = page.locator(selector);
    const count = await locator.count();
    
    // Remove search indicator
    await page.evaluate(() => {
      const indicator = document.getElementById('search-indicator');
      if (indicator) indicator.remove();
    });
    
    if (count > 0) {
      console.log(`   ${i + 1}. ✅ FOUND: ${selector}`);
      
      // Highlight the found element with animation
      await locator.evaluate(el => {
        el.style.border = '3px solid #00ff00';
        el.style.background = 'rgba(0,255,0,0.2)';
        el.style.transform = 'scale(1.05)';
        el.style.transition = 'all 0.5s ease';
        el.style.boxShadow = '0 0 20px rgba(0,255,0,0.5)';
      });
      
      // Add success indicator
      await page.evaluate((selName) => {
        const success = document.createElement('div');
        success.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 10000;
          background: #00aa00; color: white; padding: 10px; border-radius: 5px;
          font-family: monospace; font-size: 14px;
        `;
        success.textContent = `✅ Found ${selName}!`;
        document.body.appendChild(success);
        setTimeout(() => success.remove(), 2000);
      }, elementName);
      
      await page.waitForTimeout(2000);
      return locator;
    } else {
      console.log(`   ${i + 1}. ❌ NOT FOUND: ${selector}`);
      
      // Add failure indicator
      await page.evaluate((sel) => {
        const failure = document.createElement('div');
        failure.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 10000;
          background: #cc0000; color: white; padding: 10px; border-radius: 5px;
          font-family: monospace; font-size: 14px;
        `;
        failure.textContent = `❌ Not found: ${sel}`;
        document.body.appendChild(failure);
        setTimeout(() => failure.remove(), 1000);
      }, selector);
      
      await page.waitForTimeout(1000);
    }
  }
  
  throw new Error(`❌ Element ${elementName} not found with any selector`);
}

// Enhanced user interaction with visual feedback
async function performUserAction(page, action, delay = 1000) {
  console.log(`   🎬 ${action}...`);
  
  // Show action indicator
  await page.evaluate((actionText) => {
    const indicator = document.createElement('div');
    indicator.id = 'action-indicator';
    indicator.style.cssText = `
      position: fixed; top: 60px; right: 20px; z-index: 10000;
      background: #ff6600; color: white; padding: 10px; border-radius: 5px;
      font-family: monospace; font-size: 14px; animation: pulse 1s infinite;
    `;
    indicator.textContent = `🎬 ${actionText}`;
    document.body.appendChild(indicator);
  }, action);
  
  await page.waitForTimeout(delay);
  
  // Remove action indicator
  await page.evaluate(() => {
    const indicator = document.getElementById('action-indicator');
    if (indicator) indicator.remove();
  });
}

async function runCompleteUserFlowDemo() {
  console.log('🎬 Starting Complete User Flow Demo');
  console.log('==========================================');
  console.log('Watch the entire user journey with self-healing selectors!');
  console.log('');
  
  // Launch browser with visible UI
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 // Slow down for better visibility
  });
  
  const page = await browser.newPage();
  
  // Navigate to your login page
  const loginPagePath = `file://${path.resolve(__dirname, 'index.html')}`;
  console.log(`📄 Loading login page: ${loginPagePath}`);
  
  await page.goto(loginPagePath);
  await page.waitForTimeout(2000);
  
  try {
    console.log('\n🎯 PHASE 1: Finding UI Elements with Self-Healing');
    console.log('================================================');
    
    // Find email input with fallbacks
    await performUserAction(page, 'Locating email input field');
    const emailInput = await findElementWithFallbacks(page, [
      '#email-wrong',           // Will fail
      '.email-missing',         // Will fail  
      '#email',                 // Will succeed
      '[name="email"]',         // Backup
      '[type="email"]'          // Another backup
    ], 'email input');
    
    // Find password input with fallbacks
    await performUserAction(page, 'Locating password input field');
    const passwordInput = await findElementWithFallbacks(page, [
      '#password-wrong',        // Will fail
      '#password',              // Will succeed
      '[type="password"]'       // Backup
    ], 'password input');
    
    // Find login button with your specific selector change
    await performUserAction(page, 'Locating login button (testing selector change)');
    const loginButton = await findElementWithFallbacks(page, [
      '.login-btn',              // Old selector (will fail)
      '.btn-primary',            // New selector (will succeed!)
      'button[type="submit"]',   // Backup
      'text=Sign In'             // Text-based backup
    ], 'login button');
    
    console.log('\n🎯 PHASE 2: Complete User Interaction Flow');
    console.log('===========================================');
    
    // Step 1: Enter email address
    await performUserAction(page, 'User entering email address', 1500);
    await emailInput.fill('demo@example.com');
    console.log('   ✅ Email entered: demo@example.com');
    
    // Visual typing effect
    await page.evaluate(() => {
      const email = document.querySelector('#email, [type="email"]');
      if (email) {
        email.style.background = 'rgba(0,255,0,0.1)';
        email.style.border = '2px solid #00aa00';
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Step 2: Enter password
    await performUserAction(page, 'User entering password', 1500);
    await passwordInput.fill('password123');
    console.log('   ✅ Password entered: ********');
    
    // Visual password feedback
    await page.evaluate(() => {
      const password = document.querySelector('#password, [type="password"]');
      if (password) {
        password.style.background = 'rgba(0,255,0,0.1)';
        password.style.border = '2px solid #00aa00';
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Step 3: Click login button
    await performUserAction(page, 'User clicking Sign In button', 2000);
    
    // Add click animation
    await loginButton.evaluate(el => {
      el.style.transform = 'scale(0.95)';
      el.style.background = '#0066cc';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    });
    
    await loginButton.click();
    console.log('   🚀 Login button clicked!');
    
    console.log('\n🎯 PHASE 3: Following the User Journey');
    console.log('=====================================');
    
    // Step 4: Wait for and observe the login process
    await performUserAction(page, 'Waiting for login processing', 3000);
    console.log('   ⏳ Observing login simulation...');
    
    // Check if we were redirected
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('demo.html')) {
      console.log('   🎉 SUCCESS: User was redirected to demo page!');
      console.log('   📄 Current URL:', currentUrl);
      
      // Show demo page interaction
      await performUserAction(page, 'User arrived at success page', 2000);
      
      // Find and highlight demo page elements
      console.log('\n🎯 PHASE 4: Demo Page Interaction');
      console.log('=================================');
      
      // Look for back button or navigation
      try {
        const backButton = await findElementWithFallbacks(page, [
          '.back-btn',
          '.btn-secondary',
          'button:has-text("Back")',
          'a:has-text("Back")'
        ], 'back button');
        
        await performUserAction(page, 'User can navigate back', 2000);
        console.log('   ✅ Navigation options available');
        
      } catch (e) {
        console.log('   ℹ️ No back navigation found (that\'s okay)');
      }
      
    } else {
      console.log('   ⚠️ Login failed this time (70% success rate simulation)');
      console.log('   📄 Remained on login page');
      
      // Check if there's an error message
      try {
        await page.waitForSelector('.error-message, .toast', { timeout: 2000 });
        console.log('   🔍 Error message displayed to user');
        
        // Highlight error message
        await page.evaluate(() => {
          const error = document.querySelector('.error-message, .toast');
          if (error) {
            error.style.border = '2px solid #ff6600';
            error.style.background = 'rgba(255,102,0,0.1)';
          }
        });
        
      } catch (e) {
        console.log('   ℹ️ No error message visible');
      }
    }
    
    console.log('\n🎉 COMPLETE USER FLOW DEMO FINISHED!');
    console.log('=====================================');
    console.log('✅ Self-healing selectors worked throughout entire user journey');
    console.log('✅ Automatically found .btn-primary when .login-btn failed');
    console.log('✅ Complete form interaction demonstrated');
    console.log('✅ Login flow followed from start to finish');
    console.log('✅ UI changes handled without breaking the test');
    console.log('');
    console.log('💡 This demonstrates how robust your test suite is!');
    console.log('💡 Users can complete their journey regardless of UI selector changes');
    console.log('💡 QA automation continues working even when developers change CSS classes');
    
    // Keep browser open longer to see complete results
    console.log('\n⏰ Browser will close in 15 seconds...');
    console.log('   (You can manually close it anytime)');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n🔧 This might happen if:');
    console.log('   - The HTML structure has changed significantly');
    console.log('   - JavaScript errors occurred');
    console.log('   - Network or file loading issues');
  } finally {
    await browser.close();
  }
}

// Run the complete demo
runCompleteUserFlowDemo().catch(console.error); 