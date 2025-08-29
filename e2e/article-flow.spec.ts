import { test, expect } from '@playwright/test';

test.describe('Article User Flow', () => {
  test('user can navigate from article list to article detail', async ({ page }) => {
    await page.goto('/articles');
    
    // Wait for articles to load
    await page.waitForSelector('[data-testid="article-card"]', { timeout: 10000 });
    
    // Click on the first "Read Article" button
    const firstReadButton = page.locator('button:has-text("Read Article")').first();
    await expect(firstReadButton).toBeVisible();
    await firstReadButton.click();
    
    // Should navigate to article detail page
    await expect(page).toHaveURL(/\/articles\/[\w-]+/);
    
    // Should show article content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="article"]')).toBeVisible();
    
    // Should have breadcrumbs
    await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
    
    // Should have share button
    await expect(page.locator('button:has-text("Share")')).toBeVisible();
  });

  test('user can search articles', async ({ page }) => {
    await page.goto('/articles');
    
    // Wait for search input to be available
    const searchInput = page.locator('input[placeholder*="Search articles"]');
    await expect(searchInput).toBeVisible();
    
    // Search for "constitutional"
    await searchInput.fill('constitutional');
    
    // Should show search results
    await expect(page.locator('text=articles for "constitutional"')).toBeVisible();
    
    // Should show filtered articles
    const articles = page.locator('[data-testid="article-card"]');
    await expect(articles).toHaveCount(1); // Should find constitutional article
  });

  test('user can load more articles', async ({ page }) => {
    await page.goto('/articles');
    
    // Wait for initial articles to load
    await page.waitForSelector('[data-testid="article-card"]');
    
    // Count initial articles
    const initialCount = await page.locator('[data-testid="article-card"]').count();
    expect(initialCount).toBe(6); // Initial page size
    
    // Click Load More button
    const loadMoreButton = page.locator('button:has-text("Load More Articles")');
    await expect(loadMoreButton).toBeVisible();
    await loadMoreButton.click();
    
    // Should show loading state
    await expect(page.locator('button:has-text("Loading Articles")')).toBeVisible();
    
    // Should load more articles
    await page.waitForFunction(() => {
      const articles = document.querySelectorAll('[data-testid="article-card"]');
      return articles.length > 6;
    });
    
    const newCount = await page.locator('[data-testid="article-card"]').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('article detail page has proper SEO elements', async ({ page }) => {
    await page.goto('/articles/constitutional-rights-digital-age');
    
    // Should have proper page title
    await expect(page).toHaveTitle(/Constitutional Rights in the Digital Age/);
    
    // Should have meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Should have canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
    
    // Should have Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('404 page for non-existent article', async ({ page }) => {
    await page.goto('/articles/non-existent-article');
    
    // Should show 404 content
    await expect(page.locator('h1:has-text("Article Not Found")')).toBeVisible();
    await expect(page.locator('text=Back to Articles')).toBeVisible();
    
    // Back to Articles button should work
    await page.click('text=Back to Articles');
    await expect(page).toHaveURL('/articles');
  });
});
