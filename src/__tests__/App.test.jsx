import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../app/App';

test('renders App component without crashing', () => {
  render(<App />);
});

test('displays the correct title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Your App Title/i);
  expect(titleElement).toBeInTheDocument();
});

test('handles button click', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Click Me/i });
  fireEvent.click(buttonElement);
  const resultElement = screen.getByText(/Result after click/i);
  expect(resultElement).toBeInTheDocument();
});
