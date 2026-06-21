import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserAccount from './UserAccount';
import * as AuthContext from '../lib/AuthContext';

vi.mock('../lib/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('UserAccount Dashboard', () => {
  it('renders login prompt when unauthenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      getOAuthToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <UserAccount />
      </MemoryRouter>
    );
    expect(screen.getByText('Account & Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to view your dashboard.')).toBeInTheDocument();
  });

  it('fetches and displays unified dashboard summary when authenticated', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { uid: 'test-user', displayName: 'Test User', email: 'test@example.com' },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
      getToken: () => Promise.resolve('mock-token'),
      getOAuthToken: vi.fn()
    });

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/user/dashboard-summary')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            vault: [{ id: '1', title: 'Test Resource', section: 'financial' }],
            stats: [{ section: 'financial', interactions: 5 }],
            progress: [{ module: 'financial_literacy', actionId: 'budgeting', status: 'completed' }],
            blockchain: {
              credentials: [{ id: 'cred1', type: 'budget_completion', hash: '0xabc123' }],
              circles: []
            }
          })
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <MemoryRouter>
        <UserAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Resource')).toBeInTheDocument();
      // Progress
      expect(screen.getByText('50/30/20 Budgeting')).toBeInTheDocument();
      // Blockchain credentials
      expect(screen.getByText('budget_completion')).toBeInTheDocument();
      expect(screen.getByText('0xabc123...')).toBeInTheDocument();
    });
  });
});
