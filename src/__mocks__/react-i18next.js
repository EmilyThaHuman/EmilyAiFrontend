const reactI18next = {
  useTranslation: () => ({
    t: key => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
};

export const { useTranslation } = reactI18next;
