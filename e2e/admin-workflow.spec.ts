import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin login page
    await page.goto('/admin/login');
  });

  test('should handle complete admin workflow', async ({ page }) => {
    // Test login page
    await expect(page.getByText('Admin Access')).toBeVisible();
    await expect(page.getByText('Sign in to access the admin dashboard')).toBeVisible();

    // Fill in default credentials
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    
    // Submit login
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText('Dashboard Overview')).toBeVisible();

    // Test navigation through admin sections
    
    // 1. Test Notifications
    await page.getByRole('link', { name: /notifications/i }).click();
    await expect(page).toHaveURL('/admin/notifications');
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('Manage system notifications')).toBeVisible();

    // 2. Test Articles
    await page.getByRole('link', { name: /^articles$/i }).click();
    await expect(page).toHaveURL('/admin/articles');
    await expect(page.getByText('Manage your published articles')).toBeVisible();

    // 3. Test Drafts
    await page.getByRole('link', { name: /drafts/i }).click();
    await expect(page).toHaveURL('/admin/drafts');
    await expect(page.getByText('Manage your unpublished articles')).toBeVisible();

    // 4. Test Analytics
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page).toHaveURL('/admin/analytics');
    await expect(page.getByText('Track your blog\'s performance')).toBeVisible();

    // 5. Test Settings
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL('/admin/settings');
    await expect(page.getByText('Manage your account, security')).toBeVisible();

    // Test dropdown menu functionality
    await page.goto('/admin');
    
    // Click on user avatar to open dropdown
    await page.getByRole('button', { name: /admin/i }).click();
    
    // Check dropdown menu items are visible
    await expect(page.getByText('OWNER')).toBeVisible();
    await expect(page.getByRole('link', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /notifications/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

    // Test logout functionality
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL('/admin/login');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access admin dashboard directly
    await page.goto('/admin');
    
    // Should redirect to login
    await expect(page).toHaveURL('/admin/login');
    await expect(page.getByText('Admin Access')).toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel(/username or email/i).fill('invalid');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit login
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should remain on login page
    await expect(page).toHaveURL('/admin/login');
  });

  test('should show admin statistics correctly', async ({ page }) => {
    // Login first
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should show dashboard with statistics
    await expect(page.getByText('Total Articles')).toBeVisible();
    await expect(page.getByText('Page Views (30d)')).toBeVisible();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Top Article')).toBeVisible();

    // Should show quick actions
    await expect(page.getByRole('link', { name: /new article/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view drafts/i })).toBeVisible();
  });

  test('should handle articles management', async ({ page }) => {
    // Login first
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to articles
    await page.getByRole('link', { name: /^articles$/i }).click();

    // Should show articles list
    await expect(page.getByText('Articles')).toBeVisible();
    await expect(page.getByText('Total Articles')).toBeVisible();
    await expect(page.getByText('Published')).toBeVisible();
    await expect(page.getByText('Drafts')).toBeVisible();

    // Should show filter options
    await expect(page.getByPlaceholder('Search articles...')).toBeVisible();
    await expect(page.getByText('All Status')).toBeVisible();
    await expect(page.getByText('All Categories')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should show mobile navigation
    await expect(page.getByRole('button', { name: /toggle navigation/i })).toBeVisible();
    
    // Click mobile menu button
    await page.getByRole('button', { name: /toggle navigation/i }).click();
    
    // Should show navigation menu
    await expect(page.getByRole('link', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /articles/i })).toBeVisible();
  });

  test('should handle analytics dashboard', async ({ page }) => {
    // Login first
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to analytics
    await page.getByRole('link', { name: /analytics/i }).click();

    // Should show analytics content
    await expect(page.getByText('Analytics')).toBeVisible();
    await expect(page.getByText('Track your blog\'s performance')).toBeVisible();
    await expect(page.getByText('Total Page Views')).toBeVisible();
    await expect(page.getByText('Daily Average')).toBeVisible();

    // Should show chart tabs
    await expect(page.getByRole('tab', { name: /daily views/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /weekly views/i })).toBeVisible();

    // Test tab switching
    await page.getByRole('tab', { name: /weekly views/i }).click();
    await expect(page.getByText('Weekly Page Views')).toBeVisible();
  });

  test('should handle settings page', async ({ page }) => {
    // Login first
    await page.getByLabel(/username or email/i).fill('admin');
    await page.getByLabel(/password/i).fill('admin123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to settings
    await page.getByRole('link', { name: /settings/i }).click();

    // Should show settings tabs
    await expect(page.getByRole('tab', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /security/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /system/i })).toBeVisible();

    // Test profile tab
    await expect(page.getByText('Profile Information')).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();

    // Test security tab
    await page.getByRole('tab', { name: /security/i }).click();
    await expect(page.getByText('Change Password')).toBeVisible();
    await expect(page.getByLabel(/current password/i)).toBeVisible();
    await expect(page.getByLabel(/new password/i)).toBeVisible();

    // Test system tab
    await page.getByRole('tab', { name: /system/i }).click();
    await expect(page.getByText('Storage Information')).toBeVisible();
    await expect(page.getByText('Danger Zone')).toBeVisible();
  });
});
