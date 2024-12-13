module.exports = function(settings) {
  const stashkit = window._stashkit;
  if (!stashkit) {
    turbine.logger.error('StashKit not initialized');
    return;
  }
  
  stashkit.set(settings.key, settings.value, {
    clearOnRead: settings.clearOnRead,
    clearWith: settings.clearWith || []
  });
};