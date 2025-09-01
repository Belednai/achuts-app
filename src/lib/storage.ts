// LocalStorage abstraction layer for admin data
// This provides a foundation for easy migration to a real backend

import type { 
  User, 
  Article, 
  Notification, 
  PageView, 
  AuthSession, 
  ActivityEvent,
  AnalyticsData 
} from './types';

const STORAGE_KEYS = {
  USERS: 'admin_users',
  ARTICLES: 'admin_articles',
  NOTIFICATIONS: 'admin_notifications',
  PAGE_VIEWS: 'admin_page_views',
  SESSION: 'admin_session',
  ACTIVITY: 'admin_activity',
  SETTINGS: 'admin_settings'
} as const;

  // Generic storage utilities
class StorageManager {
  // Migration support
  migrateArticles(): void {
    const articles = this.getArticles();
    let hasChanges = false;
    
    articles.forEach(article => {
      if (article.isArchived === undefined) {
        article.isArchived = false;
        hasChanges = true;
      }
      if (article.archivedAt === undefined) {
        article.archivedAt = undefined;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      this.setArticles(articles);
      console.log('Articles migrated to support archiving');
    }
  }
  private getStorageData<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return defaultValue;
    }
  }

  private setStorageData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  // User management
  getUsers(): User[] {
    return this.getStorageData(STORAGE_KEYS.USERS, []);
  }

  setUsers(users: User[]): void {
    this.setStorageData(STORAGE_KEYS.USERS, users);
  }

  getUserByEmailOrUsername(emailOrUsername: string): User | null {
    try {
      const users = this.getUsers();
      const user = users.find(u => 
        u.email === emailOrUsername || u.username === emailOrUsername
      ) || null;
      
      console.log(`Looking for user: ${emailOrUsername}`);
      console.log(`Found ${users.length} total users`);
      console.log(`Found user:`, user ? `${user.username} (${user.email})` : 'None');
      
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  // Article management
  getArticles(): Article[] {
    return this.getStorageData(STORAGE_KEYS.ARTICLES, []);
  }

  setArticles(articles: Article[]): void {
    this.setStorageData(STORAGE_KEYS.ARTICLES, articles);
  }

  getArticleById(id: string): Article | null {
    return this.getArticles().find(a => a.id === id) || null;
  }

  getArticleBySlug(slug: string): Article | null {
    return this.getArticles().find(a => a.slug === slug && !a.isArchived) || null;
  }

  getPublishedArticles(): Article[] {
    return this.getArticles().filter(a => a.status === 'PUBLISHED' && !a.isArchived);
  }

  getDraftArticles(): Article[] {
    return this.getArticles().filter(a => a.status === 'DRAFT' && !a.isArchived);
  }

  getArchivedArticles(): Article[] {
    return this.getArticles().filter(a => a.isArchived);
  }

  addArticle(article: Article): void {
    const articles = this.getArticles();
    articles.push(article);
    this.setArticles(articles);
  }

  updateArticle(updatedArticle: Article): void {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);
    if (index !== -1) {
      articles[index] = updatedArticle;
      this.setArticles(articles);
    }
  }

  archiveArticle(id: string): void {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        isArchived: true,
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.setArticles(articles);
    }
  }

  unarchiveArticle(id: string): void {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        isArchived: false,
        archivedAt: undefined,
        updatedAt: new Date().toISOString()
      };
      this.setArticles(articles);
    }
  }

  deleteArticle(id: string): void {
    const articles = this.getArticles().filter(a => a.id !== id);
    this.setArticles(articles);
  }

  // Notification management
  getNotifications(): Notification[] {
    return this.getStorageData(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  setNotifications(notifications: Notification[]): void {
    this.setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification); // Add to beginning
    this.setNotifications(notifications);
  }

  getNotificationById(id: string): Notification | null {
    return this.getNotifications().find(n => n.id === id) || null;
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.setNotifications(notifications);
    }
  }

  markNotificationAsUnread(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = false;
      this.setNotifications(notifications);
    }
  }

  deleteNotification(id: string): void {
    const notifications = this.getNotifications().filter(n => n.id !== id);
    this.setNotifications(notifications);
  }

  // Page view tracking
  getPageViews(): PageView[] {
    return this.getStorageData(STORAGE_KEYS.PAGE_VIEWS, []);
  }

  addPageView(pageView: PageView): void {
    const views = this.getPageViews();
    views.push(pageView);
    // Keep only last 1000 page views to prevent storage bloat
    if (views.length > 1000) {
      views.splice(0, views.length - 1000);
    }
    this.setStorageData(STORAGE_KEYS.PAGE_VIEWS, views);
  }

  // Session management
  getSession(): AuthSession | null {
    return this.getStorageData(STORAGE_KEYS.SESSION, null);
  }

  setSession(session: AuthSession | null): void {
    this.setStorageData(STORAGE_KEYS.SESSION, session);
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // Activity tracking
  getActivity(): ActivityEvent[] {
    return this.getStorageData(STORAGE_KEYS.ACTIVITY, []);
  }

  addActivity(event: ActivityEvent): void {
    const activities = this.getActivity();
    activities.unshift(event); // Add to beginning
    // Keep only last 100 activity events
    if (activities.length > 100) {
      activities.splice(100);
    }
    this.setStorageData(STORAGE_KEYS.ACTIVITY, activities);
  }

  // Analytics aggregation
  getAnalytics(): AnalyticsData {
    const articles = this.getArticles();
    const pageViews = this.getPageViews();
    const activity = this.getActivity();

    // Calculate daily views for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyViews = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const viewsForDate = pageViews.filter(pv => 
        pv.timestamp.startsWith(dateStr)
      ).length;
      
      dailyViews.push({ date: dateStr, views: viewsForDate });
    }

    // Calculate weekly views for last 8 weeks
    const weeklyViews = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekStr = `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`;
      
      const viewsForWeek = pageViews.filter(pv => {
        const viewDate = new Date(pv.timestamp);
        return viewDate >= weekStart && viewDate <= weekEnd;
      }).length;
      
      weeklyViews.push({ week: weekStr, views: viewsForWeek });
    }

    // Top articles by views
    const articleViewCounts = new Map<string, number>();
    pageViews.forEach(pv => {
      if (pv.path.startsWith('/articles/')) {
        const slug = pv.path.replace('/articles/', '');
        articleViewCounts.set(slug, (articleViewCounts.get(slug) || 0) + 1);
      }
    });

    const topArticles = Array.from(articleViewCounts.entries())
      .map(([slug, views]) => ({
        slug,
        title: articles.find(a => a.slug === slug)?.title || slug,
        views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      dailyViews,
      weeklyViews,
      totalArticles: articles.filter(a => !a.isArchived).length,
      publishedArticles: articles.filter(a => a.status === 'PUBLISHED' && !a.isArchived).length,
      draftArticles: articles.filter(a => a.status === 'DRAFT' && !a.isArchived).length,
      archivedArticles: articles.filter(a => a.isArchived).length,
      topArticles,
      recentActivity: activity.slice(0, 10)
    };
  }

  // Clear all admin data (for testing/reset)
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new StorageManager();
