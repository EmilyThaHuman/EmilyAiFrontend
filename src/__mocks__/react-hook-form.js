const reactHookForm = {
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    watch: jest.fn(),
    setValue: jest.fn(),
    reset: jest.fn(),
  })),
  Controller: jest.fn(({ render }) => render()),
};

export const { useForm, Controller } = reactHookForm;
