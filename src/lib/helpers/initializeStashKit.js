'use strict';

const window = require('@adobe/reactor-window');
const StashKit = require('./StashKit');
const DebugPanel = require('./DebugPanel');
const settings = turbine.getExtensionSettings();

// Check if already initialized
window._stashkit = window._stashkit || new StashKit(
  settings.storageKey,
  settings.storageType === 'localStorage'
);

// Initialize debug panel if enabled
if (settings.debugMode) {
  window._stashkitDebug = new DebugPanel(window._stashkit);
}