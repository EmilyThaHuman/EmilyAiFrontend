import PropTypes from 'prop-types';
import { z } from "zod";

export const settingsLocalStorageKey = "openArtifacts:settings";

export const settingsSchema = z.object({
  anthropicApiKey: z.string(),
  openaiApiKey: z.string(),
  model: z.nativeEnum(Models),
});

const defaultSettings = {
  anthropicApiKey: "",
  openaiApiKey: "",
  model: Models.claude,
};

export const getSettings = () => {
  const storedSettings = window.localStorage.getItem(settingsLocalStorageKey);

  if (!storedSettings) {
    return defaultSettings;
  }

  try {
    const parsedSettings = JSON.parse(storedSettings);

    // Merge stored settings with default settings to ensure all fields are present
    const mergedSettings = {
      ...defaultSettings,
      ...parsedSettings,
    };

    // Ensure the model field is a valid enum value if it exists
    if (
      mergedSettings.model !== null &&
      !Object.values(Models).includes(mergedSettings.model)
    ) {
      console.warn(
        `Invalid model value: ${mergedSettings.model}. Resetting to null.`
      );
      mergedSettings.model = Models.claude;
    }

    // Validate and parse the merged settings
    return settingsSchema.parse(mergedSettings);
  } catch (error) {
    console.error("Error parsing stored settings:", error);
    return defaultSettings;
  }
};

export const updateSettings = (newSettings) =>
  window.localStorage.setItem(
    settingsLocalStorageKey,
    JSON.stringify(newSettings)
  );

getSettings.propTypes = {
  anthropicApiKey: PropTypes.string.isRequired,
  openaiApiKey: PropTypes.string.isRequired,
  model: PropTypes.oneOf(Object.values(Models)).isRequired,
};

updateSettings.propTypes = {
  newSettings: PropTypes.shape({
    anthropicApiKey: PropTypes.string.isRequired,
    openaiApiKey: PropTypes.string.isRequired,
    model: PropTypes.oneOf(Object.values(Models)).isRequired,
  }).isRequired,
};
