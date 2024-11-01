const reactRedux = {
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
};

export const { useSelector, useDispatch } = reactRedux;
