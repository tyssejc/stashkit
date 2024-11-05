'use strict';

const window = require('@adobe/reactor-window');
const AnalyticsStorage = require('./AnalyticsStorage');
const DebugPanel = require('./DebugPanel');
const settings = turbine.getExtensionSettings();

// Check if already initialized
window._analytics = window._analytics || new AnalyticsStorage(
  settings.storageKey,
  settings.storageType === 'localStorage'
);

// Initialize debug panel if enabled
if (settings.debugMode) {
  window._analyticsDebug = new DebugPanel(window._analytics);
}