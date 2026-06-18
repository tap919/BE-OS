import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { AuthProvider } from '../lib/AuthContext';

// Mock the useAuth hook
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

describe('Home Page', () => {
  it('renders the hero section properly', () => {
    render(
      <MemoryRouter>
          <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/fully operational/i)).toBeTruthy();
    expect(screen.getAllByText(/Start Here Wizard/i).length).toBeGreaterThan(0);
  });

  it('opens wizard when "Start Here Wizard" is clicked', () => {
    render(
      <MemoryRouter>
          <Home />
      </MemoryRouter>
    );
    
    const startButton = screen.getAllByText(/Start Here Wizard/i)[0];
    fireEvent.click(startButton);
    expect(screen.getByText(/What is your primary goal today\?/i)).toBeTruthy();
  });
});
