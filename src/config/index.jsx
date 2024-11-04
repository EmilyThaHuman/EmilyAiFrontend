import { PROMPTS_CONFIG } from './ai';
import { DEFAULT_APP_DATA } from './app-data-configs';
import constants from './constants';
import { DASHBOARD_CONFIGS } from './data-configs/dashboard';
import DEFAULT_MENU_ITEMS from './data-configs/menu';
import { authConfigs } from './form-configs';

// src/variables/index.js
const constant = {
  ...constants,
  DEFAULT_APP_DATA: DEFAULT_APP_DATA,
};
const forms = {
  authConfigs: authConfigs,
};
export const configs = {
  constant,
  ai: {
    prompts: PROMPTS_CONFIG,
  },
  forms,
  ui: {
    menu: DEFAULT_MENU_ITEMS,
  },
  page: {
    dashboard: DASHBOARD_CONFIGS,
  },
};

export default configs;
