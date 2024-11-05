const initializeAnalytics = require('./helpers/initializeAnalytics');

module.exports = function(settings) {
  if (settings.autoInit) {
    turbine.logger.info('Initializing analytics storage');
    initializeAnalytics(settings);
  }
};