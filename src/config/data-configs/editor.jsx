export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  php: '8.2.3',
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};

export const editorConfig = {
  theme: 'vs-dark',
  fontSize: 16,
  fontFamily: 'Courier New',
};

const STRICT_PLUGIN_MODE_DEFAULT = true;

// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
export const VALID_ENGINE_OPTIONS = {
  enableCondition: {
    type: 'boolean',
    description:
      'Whether to enable the condition capability. By default, the designer will display normally regardless of the condition.',
  },
  designMode: {
    type: 'string',
    enum: ['design', 'live'],
    default: 'design',
    description:
      'Design mode. In live mode, variable values will be displayed in real-time.',
  },
  device: {
    type: 'string',
    enum: ['default', 'mobile', 'any string value'],
    default: 'default',
    description: 'Device type',
  },
  deviceClassName: {
    type: 'string',
    default: undefined,
    description:
      'Specifies the initial deviceClassName, mounted to the top-level node of the canvas.',
  },
  locale: {
    type: 'string',
    default: 'zh_CN',
    description: 'Language',
  },
  renderEnv: {
    type: 'string',
    enum: ['react', 'rax', 'any string value'],
    default: 'react',
    description: 'Renderer type',
  },
  deviceMapper: {
    type: 'object',
    description:
      'Device type mapper, handling the mapping of devices between the designer and renderer.',
  },
  enableStrictPluginMode: {
    type: 'boolean',
    default: STRICT_PLUGIN_MODE_DEFAULT,
    description:
      'Enable strict plugin mode. Default value: STRICT_PLUGIN_MODE_DEFAULT. In strict mode, plugins cannot pass custom configuration items through engineOptions.',
  },
  enableReactiveContainer: {
    type: 'boolean',
    default: false,
    description:
      'Whether there is visual feedback in the container that is about to receive a dragged component.',
  },
  disableAutoRender: {
    type: 'boolean',
    default: false,
    description:
      'Disable automatic rendering of the canvas, effective in scenarios with multiple asynchronous asset package loads.',
  },
  disableDetecting: {
    type: 'boolean',
    default: false,
    description:
      'Disable the dashed line response when dragging components for performance considerations.',
  },
  customizeIgnoreSelectors: {
    type: 'function',
    default: undefined,
    description:
      'Customize the selectors to be ignored when clicked in the canvas, e.g., (defaultIgnoreSelectors: string[], e: MouseEvent) => string[]',
  },
  disableDefaultSettingPanel: {
    type: 'boolean',
    default: false,
    description: 'Disable the default settings panel.',
  },
  disableDefaultSetters: {
    type: 'boolean',
    default: false,
    description: 'Disable the default setters.',
  },
  enableCanvasLock: {
    type: 'boolean',
    default: false,
    description: 'Enable the locking operation of the canvas.',
  },
  enableLockedNodeSetting: {
    type: 'boolean',
    default: false,
    description:
      'Whether the container can set properties after being locked, effective only when the canvas locking feature is enabled.',
  },
  stayOnTheSameSettingTab: {
    type: 'boolean',
    default: false,
    description:
      'Whether to stay on the same settings tab when switching selected nodes.',
  },
  hideSettingsTabsWhenOnlyOneItem: {
    type: 'boolean',
    description:
      'Whether to hide the settings tabs when there is only one item.',
  },
  loadingComponent: {
    type: 'ComponentType',
    default: undefined,
    description: 'Custom loading component',
  },
  supportVariableGlobally: {
    type: 'boolean',
    default: false,
    description: 'Allow all properties to support variable configuration.',
  },
  visionSettings: {
    type: 'object',
    description: 'Vision-polyfill settings',
  },
  simulatorUrl: {
    type: 'array',
    description: 'Custom simulatorUrl address',
  },
  /**
   * Same as the appHelper in react-renderer, https://lowcode-engine.cn/docV2/nhilce#appHelper
   */
  appHelper: {
    type: 'object',
    description: 'Defines objects such as utils and constants.',
  },
  requestHandlersMap: {
    type: 'object',
    description: 'Request handler mapping for the data source engine.',
  },
  thisRequiredInJSE: {
    type: 'boolean',
    description:
      'Whether JSExpression only supports using "this" to access context variables.',
  },
};

export default editorConfig;
