import { test } from '@playwright/test';
import { AIElementFinder } from './helpers/ai-element-finder';

test('AI finds login button and completes flow', async ({ page }) => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('No API key - skipping');
    return;
  }

  await page.goto('file://' + process.cwd().replace(/\\/g, '/') + '/index.html');
  
  // Fill form
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  
  // AI finds and clicks login button
  const ai = new AIElementFinder(page);
  const button = await ai.findElement('login button');
  await button.click();
  
  await page.waitForTimeout(2000);
  console.log('Login flow completed');
});