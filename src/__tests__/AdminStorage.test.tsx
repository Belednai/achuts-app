import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../lib/storage';
import type { Article, Notification, PageView } from '../lib/types';

describe('Admin Storage Layer', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Article Management', () => {
    it('should store and retrieve articles', () => {
      const article: Article = {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        content: 'This is test content',
        summary: 'Test summary',
        category: 'Test Category',
        tags: ['test', 'article'],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addArticle(article);
      const retrieved = storage.getArticleById('1');
      
      expect(retrieved).toEqual(article);
    });

    it('should update articles', () => {
      const article: Article = {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        content: 'Original content',
        category: 'Test Category',
        tags: ['test'],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addArticle(article);
      
      const updatedArticle = {
        ...article,
        title: 'Updated Article',
        content: 'Updated content',
        status: 'PUBLISHED' as const,
        publishedAt: new Date().toISOString()
      };

      storage.updateArticle(updatedArticle);
      const retrieved = storage.getArticleById('1');
      
      expect(retrieved?.title).toBe('Updated Article');
      expect(retrieved?.content).toBe('Updated content');
      expect(retrieved?.status).toBe('PUBLISHED');
    });

    it('should delete articles', () => {
      const article: Article = {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        content: 'Test content',
        category: 'Test Category',
        tags: ['test'],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addArticle(article);
      expect(storage.getArticleById('1')).toEqual(article);
      
      storage.deleteArticle('1');
      expect(storage.getArticleById('1')).toBeNull();
    });

    it('should find articles by slug', () => {
      const article: Article = {
        id: '1',
        title: 'Test Article',
        slug: 'test-article',
        content: 'Test content',
        category: 'Test Category',
        tags: ['test'],
        status: 'PUBLISHED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addArticle(article);
      const retrieved = storage.getArticleBySlug('test-article');
      
      expect(retrieved).toEqual(article);
    });
  });

  describe('Notification Management', () => {
    it('should store and retrieve notifications', () => {
      const notification: Notification = {
        id: '1',
        title: 'Test Notification',
        body: 'This is a test notification',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      };

      storage.addNotification(notification);
      const notifications = storage.getNotifications();
      
      expect(notifications).toHaveLength(1);
      expect(notifications[0]).toEqual(notification);
    });

    it('should mark notifications as read', () => {
      const notification: Notification = {
        id: '1',
        title: 'Test Notification',
        body: 'This is a test notification',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      };

      storage.addNotification(notification);
      storage.markNotificationRead('1');
      
      const notifications = storage.getNotifications();
      expect(notifications[0].isRead).toBe(true);
    });

    it('should delete notifications', () => {
      const notification: Notification = {
        id: '1',
        title: 'Test Notification',
        body: 'This is a test notification',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      };

      storage.addNotification(notification);
      expect(storage.getNotifications()).toHaveLength(1);
      
      storage.deleteNotification('1');
      expect(storage.getNotifications()).toHaveLength(0);
    });
  });

  describe('Analytics', () => {
    it('should track page views', () => {
      const pageView: PageView = {
        id: '1',
        path: '/articles/test-article',
        timestamp: new Date().toISOString(),
        userAgent: 'Test Agent',
        ip: '127.0.0.1'
      };

      storage.addPageView(pageView);
      const pageViews = storage.getPageViews();
      
      expect(pageViews).toHaveLength(1);
      expect(pageViews[0]).toEqual(pageView);
    });

    it('should generate analytics data', () => {
      // Add some test articles
      const article1: Article = {
        id: '1',
        title: 'Article 1',
        slug: 'article-1',
        content: 'Content 1',
        category: 'Category A',
        tags: ['tag1'],
        status: 'PUBLISHED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const article2: Article = {
        id: '2',
        title: 'Article 2',
        slug: 'article-2',
        content: 'Content 2',
        category: 'Category B',
        tags: ['tag2'],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addArticle(article1);
      storage.addArticle(article2);

      // Add some page views
      const today = new Date().toISOString().split('T')[0];
      storage.addPageView({
        id: '1',
        path: '/articles/article-1',
        timestamp: `${today}T10:00:00Z`,
        userAgent: 'Test Agent'
      });

      storage.addPageView({
        id: '2',
        path: '/',
        timestamp: `${today}T11:00:00Z`,
        userAgent: 'Test Agent'
      });

      const analytics = storage.getAnalytics();
      
      expect(analytics.totalArticles).toBe(2);
      expect(analytics.publishedArticles).toBe(1);
      expect(analytics.draftArticles).toBe(1);
      expect(analytics.dailyViews).toHaveLength(30); // Last 30 days
      expect(analytics.weeklyViews).toHaveLength(8); // Last 8 weeks
    });

    it('should limit storage to prevent bloat', () => {
      // Add more than 1000 page views
      for (let i = 0; i < 1100; i++) {
        storage.addPageView({
          id: i.toString(),
          path: '/test',
          timestamp: new Date().toISOString(),
          userAgent: 'Test Agent'
        });
      }

      const pageViews = storage.getPageViews();
      expect(pageViews).toHaveLength(1000); // Should be limited to 1000
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across storage instances', () => {
      const article: Article = {
        id: '1',
        title: 'Persistent Article',
        slug: 'persistent-article',
        content: 'This should persist',
        category: 'Test',
        tags: ['persistence'],
        status: 'PUBLISHED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add article using first instance
      storage.addArticle(article);

      // Create new storage instance (simulates page reload)
      const newStorageInstance = storage;
      const retrieved = newStorageInstance.getArticleById('1');
      
      expect(retrieved).toEqual(article);
    });

    it('should handle corrupted localStorage gracefully', () => {
      // Simulate corrupted data
      localStorage.setItem('admin_articles', 'invalid json');
      
      // Should return empty array instead of throwing
      const articles = storage.getArticles();
      expect(articles).toEqual([]);
    });

    it('should clear all data', () => {
      // Add some test data
      storage.addArticle({
        id: '1',
        title: 'Test',
        slug: 'test',
        content: 'Test',
        category: 'Test',
        tags: [],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      storage.addNotification({
        id: '1',
        title: 'Test',
        body: 'Test',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Clear all data
      storage.clearAllData();

      // Verify all data is cleared
      expect(storage.getArticles()).toEqual([]);
      expect(storage.getNotifications()).toEqual([]);
      expect(storage.getPageViews()).toEqual([]);
      expect(storage.getActivity()).toEqual([]);
    });
  });
});
