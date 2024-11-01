const reactRouterDom = {
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(() => ({})),
};

export const { useNavigate, useParams } = reactRouterDom;
