/**
 * 🛠️ Self-Healing Playwright Selectors
 * Provides fallback strategies when UI selectors change
 * Automatically adapts when class names, IDs, or structure changes
 */

import { Page, Locator, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Get a locator using fallback strategies
 * Tries multiple selectors until one is found
 */
export async function getLocatorWithFallback(
  page: Page, 
  selectors: string[], 
  elementName: string,
  timeout: number = 5000
): Promise<Locator> {
  console.log(`🔍 Finding ${elementName} with fallback selectors...`);
  
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    try {
      console.log(`   ${i + 1}. Trying: ${selector}`);
      const locator = page.locator(selector);
      
      // Wait for element with short timeout
      await locator.first().waitFor({ timeout: Math.min(timeout / selectors.length, 2000) });
      const count = await locator.count();
      
      if (count > 0) {
        console.log(`   ✅ SUCCESS: Found ${count} element(s) with "${selector}"`);
        return locator.first();
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${selector}`);
      continue;
    }
  }
  
  throw new Error(`❌ Could not find ${elementName} with any of the provided selectors: ${selectors.join(', ')}`);
}

/**
 * Wait for element to exist using fallback selectors
 */
export async function waitForElementWithFallback(
  page: Page,
  selectors: string[],
  elementName: string,
  timeout: number = 10000
): Promise<Locator> {
  return await getLocatorWithFallback(page, selectors, elementName, timeout);
}

/**
 * Check if element exists using fallback selectors
 */
export async function elementExistsWithFallback(
  page: Page,
  selectors: string[],
  timeout: number = 5000
): Promise<boolean> {
  for (const selector of selectors) {
    try {
      const locator = page.locator(selector);
      await locator.first().waitFor({ timeout: Math.min(timeout / selectors.length, 1000) });
      const count = await locator.count();
      if (count > 0) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }
  return false;
}

/**
 * Expect text content using fallback selectors
 */
export async function expectTextWithFallback(
  page: Page,
  elementSelectors: string[],
  expectedTexts: string[],
  elementName: string
): Promise<void> {
  const element = await getLocatorWithFallback(page, elementSelectors, elementName);
  const textContent = await element.textContent();
  
  const hasExpectedText = expectedTexts.some(expectedText => 
    textContent?.toLowerCase().includes(expectedText.toLowerCase())
  );
  
  expect(hasExpectedText).toBe(true);
  console.log(`✅ ${elementName} contains expected text: "${textContent}"`);
}

/**
 * Get local file path for cross-platform compatibility
 */
export function getLocalFilePath(filename: string): string {
  const absolutePath = path.resolve(process.cwd(), filename);
  return `file://${absolutePath}`;
}

/**
 * Self-Healing Selectors Class
 * Provides pre-configured fallback strategies for common UI elements
 */
export class SelfHealingSelectors {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get email input with fallback selectors
   */
  async getEmailInput(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '#email',
      '[name="email"]',
      '[type="email"]',
      '.email-input',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
      'input[aria-label*="email" i]'
    ], 'email input');
  }

  /**
   * Get password input with fallback selectors
   */
  async getPasswordInput(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '#password',
      '[name="password"]',
      '[type="password"]',
      '.password-input',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password" i]',
      'input[aria-label*="password" i]'
    ], 'password input');
  }

  /**
   * Get login button with fallback selectors
   * This specifically handles the .login-btn → .btn-primary change
   */
  async getLoginButton(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.login-btn',              // Original selector
      '.btn-primary',            // New selector (user's change)
      'button[type="submit"]',   // Semantic fallback
      '.submit-button',          // Alternative class
      '.login-submit',           // Another alternative
      'text=Sign In',            // Text-based fallback
      'text=Login',              // Alternative text
      'button:has-text("Sign In")', // More specific text
      'button:has-text("Login")',   // Alternative text
      'form button:first-of-type'   // Structural fallback
    ], 'login button');
  }

  /**
   * Get password toggle button with fallback selectors
   */
  async getPasswordToggle(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.password-toggle',
      '.toggle-password',
      '.password-visibility',
      '.eye-icon',
      '.password-show-hide',
      'button[aria-label*="password" i]',
      '.password-input-group button',
      '.password-container button'
    ], 'password toggle');
  }

  /**
   * Get remember me checkbox with fallback selectors
   */
  async getRememberCheckbox(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '#remember',
      '[name="remember"]',
      '[type="checkbox"]',
      '.remember-checkbox',
      '.remember-me input',
      'input[aria-label*="remember" i]'
    ], 'remember me checkbox');
  }

  /**
   * Get Google login button with fallback selectors
   */
  async getGoogleButton(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.google-btn',
      '.google-login',
      '.social-google',
      'button:has-text("Google")',
      '[aria-label*="Google" i]',
      '.social-buttons button:first-child'
    ], 'Google login button');
  }

  /**
   * Get GitHub login button with fallback selectors
   */
  async getGithubButton(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.github-btn',
      '.github-login',
      '.social-github',
      'button:has-text("GitHub")',
      '[aria-label*="GitHub" i]',
      '.social-buttons button:last-child'
    ], 'GitHub login button');
  }

  /**
   * Get forgot password link with fallback selectors
   */
  async getForgotPasswordLink(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.forgot-password',
      '.forgot-link',
      'a:has-text("Forgot")',
      'a:has-text("forgot")',
      '[href*="forgot"]',
      'text=Forgot password?',
      'text=Forgot Password?'
    ], 'forgot password link');
  }

  /**
   * Get signup link with fallback selectors
   */
  async getSignupLink(): Promise<Locator> {
    return getLocatorWithFallback(this.page, [
      '.signup-link',
      '.register-link',
      'a:has-text("Sign up")',
      'a:has-text("Register")',
      '[href*="signup"]',
      '[href*="register"]',
      'text=Sign up',
      'text=Create account'
    ], 'signup link');
  }

  /**
   * Get any custom element by providing your own selectors
   */
  async getCustomElement(selectors: string[], elementName: string): Promise<Locator> {
    return getLocatorWithFallback(this.page, selectors, elementName);
  }
} 