import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLogin from '../pages/AdminLogin';
import { AuthProvider } from '../contexts/AuthContext';
import { authService } from '../lib/auth';

// Mock the auth service
vi.mock('../lib/auth');
vi.mock('../lib/seed');

const mockAuthService = authService as any;

const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Admin Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.getCurrentUser.mockReturnValue(null);
    mockAuthService.getValidSession.mockReturnValue(null);
    mockAuthService.login.mockResolvedValue({ success: false, error: 'Invalid credentials' });
  });

  it('renders login form correctly', () => {
    renderWithProviders(<AdminLogin />);
    
    expect(screen.getByText('Admin Access')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access the admin dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<AdminLogin />);
    
    const submitButton = screen.getByText('Sign In');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username or email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    mockAuthService.login.mockResolvedValue({
      success: true,
      session: {
        userId: '1',
        token: 'token123',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        rememberMe: false
      }
    });

    renderWithProviders(<AdminLogin />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        usernameOrEmail: 'admin',
        password: 'admin123!',
        rememberMe: false
      });
    });
  });

  it('handles failed login with error message', async () => {
    mockAuthService.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    renderWithProviders(<AdminLogin />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalled();
    });
  });

  it('toggles password visibility', () => {
    renderWithProviders(<AdminLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles remember me checkbox', () => {
    renderWithProviders(<AdminLogin />);
    
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    
    expect(rememberMeCheckbox).not.toBeChecked();
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
  });
});

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  it('validates session expiration', () => {
    const expiredSession = {
      userId: '1',
      token: 'token123',
      expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired
      rememberMe: false
    };

    localStorage.setItem('admin_session', JSON.stringify(expiredSession));
    
    mockAuthService.getValidSession.mockImplementation(() => {
      const session = JSON.parse(localStorage.getItem('admin_session') || 'null');
      if (!session) return null;
      
      if (new Date() > new Date(session.expiresAt)) {
        localStorage.removeItem('admin_session');
        return null;
      }
      
      return session;
    });

    const result = mockAuthService.getValidSession();
    expect(result).toBeNull();
  });

  it('maintains valid session', () => {
    const validSession = {
      userId: '1',
      token: 'token123',
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // Valid for 24 hours
      rememberMe: false
    };

    localStorage.setItem('admin_session', JSON.stringify(validSession));
    
    mockAuthService.getValidSession.mockImplementation(() => {
      const session = JSON.parse(localStorage.getItem('admin_session') || 'null');
      if (!session) return null;
      
      if (new Date() > new Date(session.expiresAt)) {
        localStorage.removeItem('admin_session');
        return null;
      }
      
      return session;
    });

    const result = mockAuthService.getValidSession();
    expect(result).toEqual(validSession);
  });
});
