import { DEFAULT_APP_DATA } from './app-data-configs';
import constants from './constants';
import {
  chartConfigs,
  componentConfig,
  programmingLanguages,
  statsConfig,
  systemConfig,
  promptsConfig,
} from './data-configs';
import { authConfigs } from './form-configs';
import {
  formTemplatesMenuItems,
  routerMenuData,
  snippetsMenuItems,
  templatesMenuData,
  genericMenuItems,
} from './menu-configs';

// src/variables/index.js
const constant = {
  ...constants,
  DEFAULT_APP_DATA: DEFAULT_APP_DATA,
};
const data = {
  stats: statsConfig,
  charts: chartConfigs,
  components: componentConfig,
  system: systemConfig,
  programmingLanguages: programmingLanguages,
  prompts: promptsConfig,
};
const forms = {
  authConfigs: authConfigs,
};
const menus = {
  formTemplates: formTemplatesMenuItems,
  routerMenu: routerMenuData,
  snippets: snippetsMenuItems,
  templatesData: templatesMenuData,
  genericMenuItems: genericMenuItems,
};
export const configs = {
  constant,
  data,
  forms,
  menus,
};

export default configs;
