import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ToolsAgents from './ToolsAgents';
import { AuthProvider } from '../lib/AuthContext';

// Mock the useAuth hook to avoid Firebase initialization issues in tests
vi.mock('../lib/AuthContext', async () => {
  const actual = await vi.importActual('../lib/AuthContext');
  return {
    ...actual as any,
    useAuth: () => ({
      user: { uid: 'test-uid', displayName: 'Test User' },
      getToken: vi.fn(),
    }),
  };
});

describe('ToolsAgents Page', () => {
  it('renders the header correctly', () => {
    render(
      <MemoryRouter>
          <ToolsAgents />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Tools & AI Agents/i)).toBeTruthy();
    expect(screen.getByText(/Intelligent Assistants/i)).toBeTruthy();
  });
});
