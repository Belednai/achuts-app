// Authentication and security utilities

import type { User, AuthSession, LoginRequest, ActivityEvent } from './types';
import { storage } from './storage';

// Simple password hashing using Web Crypto API (for demo purposes)
// In production, use bcrypt or Argon2 on the server side
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_admin_dashboard_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// Generate secure token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < this.windowMs);
    
    // Update the attempts for this identifier
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    userAttempts.push(now);
    this.attempts.set(identifier, userAttempts);
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestRecentAttempt = Math.min(...userAttempts);
    const timeLeft = this.windowMs - (Date.now() - oldestRecentAttempt);
    return Math.max(0, timeLeft);
  }
}

export const rateLimiter = new RateLimiter();

// CSRF token management
class CSRFManager {
  private token: string | null = null;

  generateToken(): string {
    this.token = generateToken();
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }

  validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token && token === this.token;
  }

  getToken(): string | null {
    if (!this.token) {
      const stored = sessionStorage.getItem('csrf_token');
      if (stored) {
        this.token = stored;
      }
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

export const csrf = new CSRFManager();

// Auth service
export class AuthService {
  private currentUser: User | null = null;

  async login(request: LoginRequest): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const identifier = request.usernameOrEmail.toLowerCase();

    // Check rate limiting
    if (rateLimiter.isRateLimited(identifier)) {
      const remainingTime = rateLimiter.getRemainingTime(identifier);
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${minutes} minutes.`
      };
    }

    // Record attempt
    rateLimiter.recordAttempt(identifier);

    // Find user
    const user = storage.getUserByEmailOrUsername(identifier);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(request.password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check role
    if (user.role !== 'OWNER') {
      return { success: false, error: 'Access denied' };
    }

    // Create session
    const session: AuthSession = {
      userId: user.id,
      token: generateToken(),
      expiresAt: new Date(Date.now() + (request.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString(),
      rememberMe: request.rememberMe
    };

    // Store session
    storage.setSession(session);
    this.currentUser = user;

    // Generate CSRF token
    csrf.generateToken();

    // Log activity
    this.logActivity({
      id: generateToken(),
      type: 'LOGIN',
      description: `User ${user.username} logged in`,
      timestamp: new Date().toISOString(),
      metadata: { rememberMe: request.rememberMe }
    });

    return { success: true, session };
  }

  logout(): void {
    if (this.currentUser) {
      this.logActivity({
        id: generateToken(),
        type: 'LOGIN',
        description: `User ${this.currentUser.username} logged out`,
        timestamp: new Date().toISOString()
      });
    }

    storage.clearSession();
    csrf.clearToken();
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const session = this.getValidSession();
    if (session) {
      const user = storage.getUserByEmailOrUsername(session.userId);
      if (user) {
        this.currentUser = user;
        return user;
      }
    }

    return null;
  }

  getValidSession(): AuthSession | null {
    const session = storage.getSession();
    if (!session) return null;

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      storage.clearSession();
      csrf.clearToken();
      return null;
    }

    return session;
  }

  isAuthenticated(): boolean {
    return this.getValidSession() !== null;
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    return true;
  }

  requireOwner(): boolean {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'OWNER') {
      throw new Error('Owner access required');
    }
    return true;
  }

  private logActivity(event: ActivityEvent): void {
    storage.addActivity(event);
  }

  // Initialize default owner account if none exists
  async initializeOwnerAccount(): Promise<void> {
    const users = storage.getUsers();
    if (users.length === 0) {
      // Create default owner from environment or use defaults
      const email = process.env.ADMIN_EMAIL || 'admin@achutslegal.com';
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123!';

      const hashedPassword = await hashPassword(password);
      
      const defaultOwner: User = {
        id: generateToken(),
        email,
        username,
        passwordHash: hashedPassword,
        role: 'OWNER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.setUsers([defaultOwner]);

      console.log('Default owner account created:');
      console.log(`Email: ${email}`);
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      console.log('Please change these credentials after first login.');
    }
  }

  // Rotate owner credentials
  async rotateCredentials(currentPassword: string, newEmail: string, newUsername: string, newPassword: string): Promise<boolean> {
    this.requireOwner();
    
    const user = this.getCurrentUser()!;
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    
    if (!isValidPassword) {
      return false;
    }

    const hashedNewPassword = await hashPassword(newPassword);
    
    const updatedUser: User = {
      ...user,
      email: newEmail,
      username: newUsername,
      passwordHash: hashedNewPassword,
      updatedAt: new Date().toISOString()
    };

    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storage.setUsers(users);
      this.currentUser = updatedUser;

      this.logActivity({
        id: generateToken(),
        type: 'LOGIN',
        description: 'Owner credentials updated',
        timestamp: new Date().toISOString()
      });

      return true;
    }

    return false;
  }
}

export const authService = new AuthService();
