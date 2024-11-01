import React from 'react';
import { render, screen } from '@testing-library/react';
import { HistoryTracker } from '../components/HistoryTracker';

test('renders HistoryTracker component', () => {
  render(<HistoryTracker />);
  const element = screen.getByText(/History Tracker/i);
  expect(element).toBeInTheDocument();
});
