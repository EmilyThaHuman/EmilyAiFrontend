import { render, screen } from '@testing-library/react';
import React from 'react';
import { HistoryTracker } from '../routes/components/HistoryTracker';

test('renders HistoryTracker component', () => {
  render(<HistoryTracker />);
  const element = screen.getByText(/History Tracker/i);
  expect(element).toBeInTheDocument();
});
