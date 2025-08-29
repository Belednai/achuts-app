import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Subscribe from '../pages/Subscribe';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock useToast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('Subscribe Page', () => {
  beforeEach(() => {
    mockToast.mockClear();
    localStorage.clear();
  });

  it('renders subscription form correctly', () => {
    renderWithRouter(<Subscribe />);

    expect(screen.getByText('Subscribe to Our Newsletter')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe to newsletter/i })).toBeInTheDocument();
  });

  it('validates email input', async () => {
    renderWithRouter(<Subscribe />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows success message after successful submission', async () => {
    renderWithRouter(<Subscribe />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
    });

    // Should show success message after completion
    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('implements rate limiting', async () => {
    renderWithRouter(<Subscribe />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });

    // Simulate multiple rapid submissions
    for (let i = 0; i < 4; i++) {
      fireEvent.change(emailInput, { target: { value: `test${i}@example.com` } });
      fireEvent.click(submitButton);
      
      if (i < 3) {
        await waitFor(() => {
          expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
        });
        await waitFor(() => {
          expect(screen.queryByText(/subscribing/i)).not.toBeInTheDocument();
        }, { timeout: 3000 });
      }
    }

    // Should show rate limit error on 4th attempt
    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Subscribe />);

    const emailInput = screen.getByLabelText(/email address/i);
    const firstNameInput = screen.getByLabelText(/first name/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(firstNameInput).toHaveAttribute('aria-describedby');
  });
});
