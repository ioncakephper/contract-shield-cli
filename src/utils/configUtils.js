const fs = require("fs");
const path = require("path");
const os = require("os");
const { validateConfigSchema } = require("../utils/validateConfigSchema");

/**
 * Loads and parses a configuration file from a specified path or default locations.
 * 
 * If a `configPath` is provided, it attempts to load the configuration from that path.
 * If not, it checks for a project-specific configuration file in the current working directory,
 * and if not found, it checks for a global configuration file in the user's home directory.
 * 
 * @param {string} [configPath] - Optional path to a specific configuration file.
 * @returns {Object} The parsed configuration object, or an empty object if no valid configuration file is found.
 */
const loadConfig = (configPath) => {
  const CONFIG_FILES = {
    PROJECT: "contract-shield.config.json",
    GLOBAL: "contract-shield.json",
  };

  const defaultProjectConfig = path.resolve(process.cwd(), CONFIG_FILES.PROJECT);
  // const defaultGlobalConfig = path.resolve(os.homedir(), CONFIG_FILES.GLOBAL);
  const defaultGlobalConfig = path.resolve(__dirname__, CONFIG_FILES.GLOBAL);

  const finalConfigPath = configPath || 
    [defaultProjectConfig, defaultGlobalConfig].find(fs.existsSync) || null;

  if (finalConfigPath) {
    try {
      const fileContent = fs.readFileSync(finalConfigPath, "utf-8");
      try {
        const config = JSON.parse(fileContent);

        const isValidConfig = validateConfigSchema(config);
        if (!isValidConfig) {
          console.error("Invalid configuration structure.");
          return {};
        }

        return config;
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return {};
      }
    } catch (error) {
      console.error(`Error loading configuration from ${finalConfigPath}:`, error);
      return {};
    }
  }
  return {};
};

module.exports = { loadConfig };