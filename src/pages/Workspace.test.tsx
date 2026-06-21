import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkspaceHub from './Workspace';
import * as AuthContext from '../lib/AuthContext';
import * as useGoogleIntegration from '../lib/useGoogleIntegration';

// Mock the AuthContext
vi.mock('../lib/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock the Google Integration
vi.mock('../lib/useGoogleIntegration', () => ({
  useGoogleIntegration: vi.fn()
}));

describe('WorkspaceHub', () => {
  it('renders login prompt when unauthenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      getOAuthToken: vi.fn()
    });

    vi.mocked(useGoogleIntegration.useGoogleIntegration).mockReturnValue({
      run: vi.fn(),
      status: 'idle',
      result: null
    });

    render(<WorkspaceHub />);
    
    expect(screen.getByText('Connect Your Workspace')).toBeInTheDocument();
    expect(screen.getByText('Sign In with Google')).toBeInTheDocument();
  });

  it('renders workspace data when authenticated', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { uid: 'test-user' },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      getOAuthToken: () => 'mock-token'
    });

    vi.mocked(useGoogleIntegration.useGoogleIntegration).mockReturnValue({
      run: vi.fn(),
      status: 'idle',
      result: null
    });

    // Mock fetch
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('drive/v3/files')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ files: [{ id: '1', name: 'Test Doc' }] })
        });
      }
      if (url.includes('gmail/v1/users/me/messages') && !url.includes('format=metadata')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ messages: [] }) // No messages to avoid metadata fetching in this test for simplicity
        });
      }
      if (url.includes('calendar/v3/calendars/primary/events')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ items: [{ id: '1', summary: 'Test Event' }] })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      });
    });

    render(<WorkspaceHub />);
    
    // Check if the dashboard rendered since we have a token
    expect(screen.getByText('Workspace Hub')).toBeInTheDocument();
    
    // Await for data to populate
    await waitFor(() => {
      expect(screen.getByText('Test Doc')).toBeInTheDocument();
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });
});
