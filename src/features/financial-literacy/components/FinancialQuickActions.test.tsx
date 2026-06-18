import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinancialQuickActions } from './FinancialQuickActions';

// Mock the useAuth hook
vi.mock('@/src/lib/AuthContext', async () => {
  return {
    useAuth: () => ({
      user: { uid: 'test-uid' },
      getToken: vi.fn(),
    }),
  };
});

describe('FinancialQuickActions', () => {
  it('renders all action buttons', () => {
    render(<FinancialQuickActions />);
    
    expect(screen.getByText(/50\/30\/20 Budgeting/i)).toBeTruthy();
    expect(screen.getByText(/Debt Payoff Plan/i)).toBeTruthy();
    expect(screen.getByText(/Emergency Fund Setup/i)).toBeTruthy();
    expect(screen.getByText(/Investment Goals/i)).toBeTruthy();
  });

  it('opens a modal when an action is clicked', () => {
    render(<FinancialQuickActions />);
    const budgetBtn = screen.getByText(/50\/30\/20 Budgeting/i);
    fireEvent.click(budgetBtn);
    expect(screen.getByText(/What is your monthly after-tax income\?/i)).toBeTruthy();
    // Modal title should also be present
    expect(screen.getAllByText(/50\/30\/20 Budgeting/i).length).toBeGreaterThan(1);
  });
});
