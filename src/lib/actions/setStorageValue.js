module.exports = function(settings) {
  const analytics = window._analytics;
  if (!analytics) {
    turbine.logger.error('Analytics Storage not initialized');
    return;
  }
  
  analytics.set(settings.key, settings.value, {
    clearOnRead: settings.clearOnRead,
    clearWith: settings.clearWith || []
  });
};