module.exports = function(settings) {
  const analytics = window._stashkit;
  if (!analytics) {
    turbine.logger.error('Analytics Storage not initialized');
    return;
  }
  
  return analytics.get(settings.key);
};