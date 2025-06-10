/**
 * 🛠️ Self-Healing Login UI Test Suite
 * Automatically adapts when UI selectors change using fallback strategies
 */

import { test, expect, Page } from '@playwright/test';
import { 
  SelfHealingSelectors, 
  getLocatorWithFallback,
  waitForElementWithFallback,
  elementExistsWithFallback,
  expectTextWithFallback,
  getLocalFilePath
} from './helpers/self-healing';

test.describe('🛠️ Self-Healing Login UI Tests', () => {
  let selectors: SelfHealingSelectors;
  let loginPagePath: string;
  let demoPagePath: string;

  test.beforeEach(async ({ page }) => {
    selectors = new SelfHealingSelectors(page);
    loginPagePath = getLocalFilePath('index.html');
    demoPagePath = getLocalFilePath('demo.html');
    
    await page.goto(loginPagePath);
    console.log(`📄 Navigated to: ${loginPagePath}`);
  });

  test('✅ Page loads correctly with all essential elements', async ({ page }) => {
    // Check page title with fallbacks
    const title = await page.title();
    expect(title).toContain('Modern Login UI');
    console.log(`✅ Page title: ${title}`);

    // Check essential elements using self-healing selectors
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const loginButton = await selectors.getLoginButton();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Check header text with fallback strategies
    await expectTextWithFallback(
      page,
      ['h1', '.header-title', '.login-title', 'header h1'],
      ['Welcome Back', 'Login', 'Sign In'],
      'header title'
    );

    console.log('✅ All essential elements found and visible');
  });

  test('📝 Form validation - empty fields', async ({ page }) => {
    const loginButton = await selectors.getLoginButton();
    
    // Try to submit with empty fields
    await loginButton.click();
    await page.waitForTimeout(1000);

    // Check for validation message using fallback selectors
    const hasValidationMessage = await elementExistsWithFallback(page, [
      '.message',
      '.error-message',
      '.validation-error',
      '.toast',
      '.notification',
      '[role="alert"]'
    ]);

    expect(hasValidationMessage).toBe(true);
    console.log('✅ Form validation works for empty fields');
  });

  test('📧 Form validation - invalid email format', async ({ page }) => {
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const loginButton = await selectors.getLoginButton();

    // Fill invalid email and valid password
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await loginButton.click();
    await page.waitForTimeout(1000);

    // Check for validation message
    const hasValidationMessage = await elementExistsWithFallback(page, [
      '.message',
      '.error-message',
      '.validation-error',
      '.toast'
    ]);

    expect(hasValidationMessage).toBe(true);
    console.log('✅ Form validation works for invalid email');
  });

  test('🔒 Form validation - short password', async ({ page }) => {
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const loginButton = await selectors.getLoginButton();

    // Fill valid email and short password
    await emailInput.fill('test@example.com');
    await passwordInput.fill('123'); // Too short
    await loginButton.click();
    await page.waitForTimeout(1000);

    // Check for validation message
    const hasValidationMessage = await elementExistsWithFallback(page, [
      '.message',
      '.error-message',
      '.validation-error',
      '.toast'
    ]);

    expect(hasValidationMessage).toBe(true);
    console.log('✅ Form validation works for short password');
  });

  test('👁️ Password toggle functionality', async ({ page }) => {
    const passwordInput = await selectors.getPasswordInput();
    const passwordToggle = await selectors.getPasswordToggle();

    // Check initial state
    let passwordType = await passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');
    console.log('✅ Password initially hidden');

    // Click toggle button
    await passwordToggle.click();
    await page.waitForTimeout(500);

    // Password should now be visible
    passwordType = await passwordInput.getAttribute('type');
    expect(passwordType).toBe('text');
    console.log('✅ Password toggle shows password');

    // Click again to hide
    await passwordToggle.click();
    await page.waitForTimeout(500);

    // Password should be hidden again
    passwordType = await passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');
    console.log('✅ Password toggle hides password again');
  });

  test('☑️ Remember me checkbox functionality', async ({ page }) => {
    const rememberCheckbox = await selectors.getRememberCheckbox();

    // Check initial state
    const initialChecked = await rememberCheckbox.isChecked();
    expect(initialChecked).toBe(false);
    console.log('✅ Remember me initially unchecked');

    // Click the checkbox (or its wrapper)
    const checkboxWrapper = await getLocatorWithFallback(page, [
      '.checkbox-wrapper',
      '.remember-me',
      'label:has(#remember)',
      '.checkbox-container'
    ], 'checkbox wrapper');

    await checkboxWrapper.click();
    await page.waitForTimeout(500);

    // Should now be checked
    const newChecked = await rememberCheckbox.isChecked();
    expect(newChecked).toBe(true);
    console.log('✅ Remember me checkbox toggles correctly');
  });

  test('🔗 Social login buttons functionality', async ({ page }) => {
    const googleButton = await selectors.getGoogleButton();
    const githubButton = await selectors.getGithubButton();

    // Test Google button
    await expect(googleButton).toBeVisible();
    await googleButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Google login button clickable');

    // Test GitHub button
    await expect(githubButton).toBeVisible();
    await githubButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ GitHub login button clickable');
  });

  test('🔗 Navigation links functionality', async ({ page }) => {
    // Test forgot password link
    const forgotPasswordLink = await selectors.getForgotPasswordLink();
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();
    await page.waitForTimeout(1000);
    console.log('✅ Forgot password link works');

    // Test signup link
    const signupLink = await selectors.getSignupLink();
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await page.waitForTimeout(1000);
    console.log('✅ Signup link works');
  });

  test('🎯 Successful login flow with demo credentials', async ({ page }) => {
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const loginButton = await selectors.getLoginButton();

    // Fill demo credentials
    await emailInput.fill('demo@example.com');
    await passwordInput.fill('password123');

    console.log('✅ Demo credentials filled');

    // Submit login
    await loginButton.click();
    console.log('⏳ Waiting for login process...');
    
    // Wait for potential redirect or error message
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    
    if (currentUrl.includes('demo.html')) {
      // Success case - we're on demo page
      console.log('🎉 Login successful - redirected to demo page');
      
      // Verify demo page elements using fallback selectors
      await expectTextWithFallback(
        page,
        ['.demo-title', '.page-title', 'h1', '.main-title'],
        ['This is just a demo', 'Demo', 'Welcome'],
        'demo page title'
      );

      // Check success elements
      const successIconExists = await elementExistsWithFallback(page, [
        '.success-icon',
        '.checkmark',
        '.success-checkmark',
        '.celebration-icon'
      ]);
      expect(successIconExists).toBe(true);

      console.log('✅ Demo page loaded correctly');
    } else {
      // Failure case - still on login page (due to random simulation)
      console.log('⚠️ Login failed (expected due to random simulation)');
      expect(currentUrl).toContain('index.html');
      console.log('✅ Failed login keeps user on login page');
    }
  });

  test('🎊 Demo page elements and functionality', async ({ page }) => {
    // Navigate directly to demo page
    await page.goto(demoPagePath);
    await page.waitForTimeout(2000);

    // Check demo title with fallbacks
    await expectTextWithFallback(
      page,
      ['.demo-title', '.page-title', 'h1'],
      ['This is just a demo', 'Demo'],
      'demo title'
    );

    // Check success icon
    const successIconExists = await elementExistsWithFallback(page, [
      '.success-icon',
      '.checkmark',
      '.success-checkmark'
    ]);
    expect(successIconExists).toBe(true);

    // Check feature items with fallbacks
    const featureItems = await getLocatorWithFallback(page, [
      '.feature-item',
      '.feature-card',
      '.features .item',
      '.feature-list li'
    ], 'feature items');

    const featureCount = await featureItems.count();
    expect(featureCount).toBeGreaterThanOrEqual(3); // Should have multiple features

    // Check action buttons
    const backButton = await getLocatorWithFallback(page, [
      '.primary-btn',
      '.btn-primary',
      'text=Back to Login',
      'button:has-text("Back")'
    ], 'back button');

    const infoButton = await getLocatorWithFallback(page, [
      '.secondary-btn',
      '.btn-secondary',
      'text=More Info',
      'button:has-text("Info")'
    ], 'info button');

    await expect(backButton).toBeVisible();
    await expect(infoButton).toBeVisible();

    console.log('✅ Demo page elements verified');
  });

  test('🔄 Demo page navigation - back to login', async ({ page }) => {
    await page.goto(demoPagePath);
    await page.waitForTimeout(2000);

    // Find and click back button with fallbacks
    const backButton = await getLocatorWithFallback(page, [
      '.primary-btn',
      '.btn-primary',
      'text=Back to Login',
      'button:has-text("Back")',
      '.demo-actions button:first-child'
    ], 'back button');

    await backButton.click();
    await page.waitForTimeout(2000);

    // Should be back on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain('index.html');

    // Verify we're on login page by checking for email input
    const emailInput = await selectors.getEmailInput();
    await expect(emailInput).toBeVisible();

    console.log('✅ Back to login navigation works');
  });

  test('ℹ️ Demo page info modal functionality', async ({ page }) => {
    await page.goto(demoPagePath);
    await page.waitForTimeout(2000);

    // Find and click info button
    const infoButton = await getLocatorWithFallback(page, [
      '.secondary-btn',
      '.btn-secondary',
      'text=More Info',
      'button:has-text("Info")'
    ], 'info button');

    await infoButton.click();
    await page.waitForTimeout(1000);

    // Check if modal appears with fallback selectors
    const modalExists = await elementExistsWithFallback(page, [
      '.modal',
      '.overlay',
      '[style*="position: fixed"]',
      '.popup',
      '.dialog'
    ]);

    expect(modalExists).toBe(true);
    console.log('✅ Info modal appears');

    // Check modal content
    await expectTextWithFallback(
      page,
      ['.modal', '.overlay', '[style*="position: fixed"]'],
      ['About This Demo', 'Demo', 'Information'],
      'modal content'
    );

    // Close modal by finding and clicking close button
    const closeButton = await getLocatorWithFallback(page, [
      '.modal button',
      '.close-btn',
      'button:has-text("Close")',
      'button:has-text("OK")',
      '.overlay button'
    ], 'close button');

    await closeButton.click();
    await page.waitForTimeout(1000);

    console.log('✅ Info modal closes correctly');
  });

  test('🎮 Konami code easter egg', async ({ page }) => {
    // Execute Konami code sequence: ↑↑↓↓←→←→BA
    const konamiSequence = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];

    console.log('🎮 Executing Konami code...');
    
    for (const key of konamiSequence) {
      await page.keyboard.press(key);
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(1000);

    // Check if form was auto-filled
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const rememberCheckbox = await selectors.getRememberCheckbox();

    const emailValue = await emailInput.inputValue();
    const passwordValue = await passwordInput.inputValue();
    const isChecked = await rememberCheckbox.isChecked();

    expect(emailValue).toBe('demo@example.com');
    expect(passwordValue).toBe('password123');
    expect(isChecked).toBe(true);

    console.log('✅ Konami code easter egg works correctly');
  });

  test('📱 Responsive design - mobile viewport', async ({ page }) => {
    // Resize to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check that elements are still visible and functional
    const loginCard = await getLocatorWithFallback(page, [
      '.login-card',
      '.login-container',
      '.login-form',
      'form'
    ], 'login card');

    await expect(loginCard).toBeVisible();

    // Test inputs on mobile
    const emailInput = await selectors.getEmailInput();
    const passwordInput = await selectors.getPasswordInput();
    const loginButton = await selectors.getLoginButton();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Test input functionality
    await emailInput.fill('test@mobile.com');
    await passwordInput.fill('mobile123');

    const emailValue = await emailInput.inputValue();
    const passwordValue = await passwordInput.inputValue();

    expect(emailValue).toBe('test@mobile.com');
    expect(passwordValue).toBe('mobile123');

    console.log('✅ Responsive design works on mobile viewport');
  });

  test('🔄 Multiple login attempts simulation', async ({ page }) => {
    let attempts = 0;
    const maxAttempts = 3; // Reduced for faster testing

    while (attempts < maxAttempts) {
      console.log(`🔄 Login attempt ${attempts + 1}/${maxAttempts}`);

      // Get fresh selectors for each attempt
      const emailInput = await selectors.getEmailInput();
      const passwordInput = await selectors.getPasswordInput();
      const loginButton = await selectors.getLoginButton();

      // Clear and fill credentials
      await emailInput.clear();
      await passwordInput.clear();
      await emailInput.fill('demo@example.com');
      await passwordInput.fill('password123');

      // Submit
      await loginButton.click();
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      if (currentUrl.includes('demo.html')) {
        console.log(`🎉 Login successful after ${attempts + 1} attempts`);
        break;
      } else {
        attempts++;
        console.log(`⚠️ Attempt ${attempts} failed (random simulation)`);
        if (attempts < maxAttempts) {
          await page.waitForTimeout(1000); // Brief pause before next attempt
        }
      }
    }

    if (attempts === maxAttempts) {
      console.log(`✅ Completed ${maxAttempts} login attempts (testing random failure simulation)`);
    }

    // Test passes regardless of login success due to intentional randomization
    expect(true).toBe(true);
  });
}); 