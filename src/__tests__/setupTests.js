// Import necessary testing libraries
import '@testing-library/jest-dom';

// Mock global objects or functions if needed
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Configure any additional setup needed for tests
// For example, setting up a global mock for console.error to suppress warnings
global.console.error = jest.fn();
