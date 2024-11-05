var initializeAnalytics = require('../helpers/initializeAnalytics');

module.exports = function(settings, event) {
  // Get extension settings
  var extensionSettings = turbine.getExtensionSettings();
  
  // Merge action settings with extension settings (action settings take precedence)
  var finalSettings = {
    storageKey: settings.storageKey || extensionSettings.storageKey,
    storageType: settings.storageType || extensionSettings.storageType,
    debugMode: typeof settings.debugMode !== 'undefined' ? 
      settings.debugMode : extensionSettings.debugMode
  };

  return initializeAnalytics(finalSettings);
};