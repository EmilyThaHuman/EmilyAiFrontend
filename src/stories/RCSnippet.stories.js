import React from 'react';

import { RCSnippet } from '@/components';

export default {
  title: 'Components/RCSnippet',
  component: RCSnippet,
};

const Template = args => <RCSnippet {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a default snippet.',
  variant: 'default',
};

export const Dark = Template.bind({});
Dark.args = {
  children: 'This is a dark snippet.',
  variant: 'dark',
};

export const Light = Template.bind({});
Light.args = {
  children: 'This is a light snippet.',
  variant: 'light',
};

export const WithCopyButton = Template.bind({});
WithCopyButton.args = {
  children: 'This snippet has a copy button.',
  variant: 'default',
  hideCopyButton: false,
};
