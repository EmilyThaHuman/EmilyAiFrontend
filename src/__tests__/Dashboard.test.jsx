import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

test('renders Dashboard component', () => {
  render(<Dashboard />);
  const element = screen.getByText(/Dashboard/i);
  expect(element).toBeInTheDocument();
});

test('opens and closes template', () => {
  render(<Dashboard />);
  const openButton = screen.getByRole('button', { name: /Open Template/i });
  fireEvent.click(openButton);
  const closeButton = screen.getByRole('button', { name: /Close Template/i });
  fireEvent.click(closeButton);
  const resultElement = screen.queryByText(/Template Opened/i);
  expect(resultElement).not.toBeInTheDocument();
});
