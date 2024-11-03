import { DEFAULT_APP_DATA } from './app-data-configs';
import constants from './constants';
import {
  componentConfig,
  programmingLanguages,
  statsConfig,
  systemConfig,
  promptsConfig,
  genericMenuItems,
} from './data-configs';
import { DASHBOARD_CONFIGS } from './data-configs/dashboard';
import DEFAULT_MENU_ITEMS from './data-configs/menu';
import { authConfigs } from './form-configs';

// src/variables/index.js
const constant = {
  ...constants,
  DEFAULT_APP_DATA: DEFAULT_APP_DATA,
};
const data = {
  stats: statsConfig,
  components: componentConfig,
  system: systemConfig,
  programmingLanguages: programmingLanguages,
  prompts: promptsConfig,
};
const forms = {
  authConfigs: authConfigs,
};
export const configs = {
  constant,
  data,
  forms,
  ui: {
    menu: DEFAULT_MENU_ITEMS,
  },
  page: {
    dashboard: DASHBOARD_CONFIGS,
  },
};

export default configs;
