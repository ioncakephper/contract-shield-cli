const fs = require('fs');
const path = require('path');
const os = require('os');

const loadConfig = (configPath) => {
  const defaultProjectConfig = path.resolve(process.cwd(), 'contract-shield.config.json');
  const defaultGlobalConfig = path.resolve(os.homedir(), 'contract-shield.json');
  const finalConfigPath = configPath || (fs.existsSync(defaultProjectConfig) ? defaultProjectConfig : fs.existsSync(defaultGlobalConfig) ? defaultGlobalConfig : null);

  return finalConfigPath && fs.existsSync(finalConfigPath) ? JSON.parse(fs.readFileSync(finalConfigPath, 'utf-8')) : {};
};

module.exports = { loadConfig };