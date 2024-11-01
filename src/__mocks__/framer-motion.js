const framerMotion = {
  motion: {
    div: jest.fn(({ children }) => children),
    span: jest.fn(({ children }) => children),
  },
};

export const { motion } = framerMotion;
