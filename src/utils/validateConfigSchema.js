
module.exports = {
  validateConfigSchema: (config) => {
    if (typeof config !== "object" || config === null) {
      return false;
    }

    const requiredFields = ["output"];
    for (const field of requiredFields) {
      if (!Object.prototype.hasOwnProperty.call(config, field)) {
        return false;
      }
    }

    if (
      typeof config.output !== "string"
    ) {
      return false;
    }

    return true;
  },
};