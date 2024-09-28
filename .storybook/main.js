/** @type { import('@storybook/react-webpack5').StorybookConfig } */
import { mergeConfig } from "vite";

import autoStoryGenerator from "@takuma-ru/auto-story-generator";

const config = {
  stories: ['../src/components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [
        autoStoryGenerator.vite({
          preset: 'react',
          imports: ["../src/components/themed/CommonUi/**/*.jsx"],
          isGenerateStoriesFileAtBuild: true,
          prettierConfigPath: resolve(__dirname, '../.prettierrc'),
        }),
      ],
      resolve: {
        alias: {
          '~': resolve(__dirname, '../src'),
        },
      },
    }),

  staticDirs: ['../public'],
};
export default config;
