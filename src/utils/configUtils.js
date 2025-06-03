const fs = require("fs");
const path = require("path");
const os = require("os");

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
