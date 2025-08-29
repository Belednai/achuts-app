import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscription Flow', () => {
  test('user can access subscribe page from navbar', async ({ page }) => {
    await page.goto('/');
    
    // Click Subscribe button in navbar
    const subscribeButton = page.locator('header button:has-text("Subscribe")');
    await expect(subscribeButton).toBeVisible();
    await subscribeButton.click();
    
    // Should navigate to subscribe page
    await expect(page).toHaveURL('/subscribe');
    await expect(page.locator('h1:has-text("Subscribe to Our Newsletter")')).toBeVisible();
  });

  test('user can subscribe to newsletter', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Fill out form
    const emailInput = page.locator('input[type="email"]');
    const firstNameInput = page.locator('input[placeholder*="first name"]');
    const submitButton = page.locator('button:has-text("Subscribe to Newsletter")');
    
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    await firstNameInput.fill('John');
    await emailInput.fill('john@example.com');
    
    // Submit form
    await submitButton.click();
    
    // Should show loading state
    await expect(page.locator('button:has-text("Subscribing")')).toBeVisible();
    
    // Should show success message
    await expect(page.locator('text=Successfully Subscribed')).toBeVisible({ timeout: 10000 });
    
    // Form should be reset
    await expect(emailInput).toHaveValue('');
    await expect(firstNameInput).toHaveValue('');
  });

  test('form validates email input', async ({ page }) => {
    await page.goto('/subscribe');
    
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("Subscribe to Newsletter")');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Should show validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('form implements rate limiting', async ({ page }) => {
    await page.goto('/subscribe');
    
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("Subscribe to Newsletter")');
    
    // Make multiple rapid submissions
    for (let i = 0; i < 4; i++) {
      await emailInput.fill(`test${i}@example.com`);
      await submitButton.click();
      
      if (i < 3) {
        // Wait for submission to complete
        await page.waitForSelector('button:has-text("Subscribing")', { state: 'visible' });
        await page.waitForSelector('button:has-text("Subscribing")', { state: 'hidden', timeout: 5000 });
      }
    }
    
    // Should show rate limit error
    await expect(page.locator('text=Too many requests')).toBeVisible();
  });

  test('subscribe page has proper accessibility', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Check form labels
    const emailInput = page.locator('input[type="email"]');
    const firstNameInput = page.locator('input[placeholder*="first name"]');
    
    await expect(emailInput).toHaveAttribute('aria-describedby');
    await expect(firstNameInput).toHaveAttribute('aria-describedby');
    
    // Check that form can be navigated with keyboard
    await page.keyboard.press('Tab');
    await expect(firstNameInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button:has-text("Subscribe to Newsletter")');
    await expect(submitButton).toBeFocused();
  });

  test('mobile navigation subscribe button works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Click Subscribe in mobile menu
    const mobileSubscribeButton = page.locator('text=Subscribe').last();
    await expect(mobileSubscribeButton).toBeVisible();
    await mobileSubscribeButton.click();
    
    // Should navigate to subscribe page
    await expect(page).toHaveURL('/subscribe');
  });

  test('subscribe page has privacy notice', async ({ page }) => {
    await page.goto('/subscribe');
    
    // Should have privacy notice
    await expect(page.locator('text=Privacy & Data Protection')).toBeVisible();
    await expect(page.locator('text=Kenya Data Protection Act')).toBeVisible();
    
    // Privacy policy link should work
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
  });
});
