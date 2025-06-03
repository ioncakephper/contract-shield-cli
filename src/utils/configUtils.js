const fs = require("fs");
const path = require("path");
const os = require("os");

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

  const defaultProjectConfig = path.resolve(
    process.cwd(),
    CONFIG_FILES.PROJECT
  );
  
  const defaultGlobalConfig = path.resolve(os.homedir(), CONFIG_FILES.GLOBAL);
  const finalConfigPath =
    configPath ||
    (fs.existsSync(defaultProjectConfig)
      ? defaultProjectConfig
      : fs.existsSync(defaultGlobalConfig)
      ? defaultGlobalConfig
      : null);

  return finalConfigPath && fs.existsSync(finalConfigPath)
    ? JSON.parse(fs.readFileSync(finalConfigPath, "utf-8"))
    : {};
};

module.exports = { loadConfig };
