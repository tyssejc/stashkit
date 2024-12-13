const initializeStashKit = require('./helpers/initializeStashKit');

module.exports = function(settings) {
  if (settings.autoInit) {
    turbine.logger.info('Initializing StashKit');
    initializeStashKit(settings);
  }
};