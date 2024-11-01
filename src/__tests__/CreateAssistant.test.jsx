import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateAssistant from '../components/CreateAssistant';

test('renders CreateAssistant component', () => {
  render(<CreateAssistant />);
  const element = screen.getByText(/Create Assistant/i);
  expect(element).toBeInTheDocument();
});
