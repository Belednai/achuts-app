// Core data types for the admin system

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'OWNER';
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readingTime?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'WARN' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export interface PageView {
  id: string;
  path: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT';
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string;
}

// Analytics types
export interface AnalyticsData {
  dailyViews: { date: string; views: number }[];
  weeklyViews: { week: string; views: number }[];
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  topArticles: { slug: string; title: string; views: number }[];
  recentActivity: ActivityEvent[];
}

export interface ActivityEvent {
  id: string;
  type: 'ARTICLE_CREATED' | 'ARTICLE_PUBLISHED' | 'ARTICLE_UPDATED' | 'LOGIN';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// UI State types
export interface AdminLayoutState {
  sidebarCollapsed: boolean;
  currentPage: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
