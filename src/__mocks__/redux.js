const redux = {
  createStore: jest.fn(() => ({
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  })),
  applyMiddleware: jest.fn(() => jest.fn()),
};

export const { createStore, applyMiddleware } = redux;
