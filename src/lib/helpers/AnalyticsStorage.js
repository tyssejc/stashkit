// src/lib/helpers/AnalyticsStorage.js
/**
 * Creates an instance of AnalyticsStorage to persist analytics data across page loads.
 * Values are cleared from storage after first read by default.
 * 
 * @constructor
 * @param {string} [storageKey='_analytics'] - Key used to store data in web storage
 * @param {boolean} [useLocalStorage=true] - If true, uses localStorage; if false, uses sessionStorage
 */
class AnalyticsStorage {
  constructor(storageKey = '_analytics', useLocalStorage = true) {
    this.storageKey = storageKey;
    this.storage = useLocalStorage ? localStorage : sessionStorage;
    this.data = this.load();
    
    // Save data before page unloads
    window.addEventListener('beforeunload', () => this.save());
    
    // Log initialization in debug mode
    if (turbine.getExtensionSettings().debugMode) {
      turbine.logger.log(`Analytics Storage initialized:
        Storage Key: ${this.storageKey}
        Storage Type: ${useLocalStorage ? 'localStorage' : 'sessionStorage'}
        Current Size: ${this.getSize()} bytes`);
    }
  }

  /**
   * Loads data from storage
   * @private
   */
  load() {
    try {
      const stored = this.storage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      turbine.logger.error('Error loading analytics data:', e);
      return {};
    }
  }

  /**
   * Saves data to storage
   * @private
   * @returns {boolean} Success status
   */
  save() {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(this.data));
      return true;
    } catch (e) {
      // Handle QuotaExceededError
      if (e.name === 'QuotaExceededError') {
        turbine.logger.error('Storage quota exceeded. Attempting cleanup...');
        this.cleanup();
        // Try saving again after cleanup
        try {
          this.storage.setItem(this.storageKey, JSON.stringify(this.data));
          return true;
        } catch (retryError) {
          turbine.logger.error('Storage still full after cleanup:', retryError);
          return false;
        }
      }
      
      turbine.logger.error('Error saving analytics data:', e);
      return false;
    }
  }

  /**
   * Sets a value in storage
   * @param {string} key - The key to store the value under
   * @param {*} value - The value to store
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.clearOnRead=true] - Clear the value after first read
   * @param {string[]} [options.clearWith=[]] - Array of other keys to clear when this value is cleared
   * @param {number} [options.ttl] - Time to live in milliseconds
   * @returns {boolean} Success status
   */
  set(key, value, options = {}) {
    const { clearOnRead = true, clearWith = [], ttl } = options;
    
    this.data[key] = {
      value,
      options: { clearOnRead, clearWith },
      timestamp: Date.now(),
      ...(ttl && { expires: Date.now() + ttl })
    };

    const success = this.save();
    
    if (turbine.getExtensionSettings().debugMode) {
      turbine.logger.log(`Analytics value set - Key: ${key}, Value:`, value);
    }
    
    return success;
  }

  /**
   * Gets a value and optionally clears it from storage
   * @param {string} key - The key to retrieve
   * @returns {*} The stored value, or undefined if not found
   */
  get(key) {
    const item = this.data[key];
    if (!item) return undefined;

    // Check if expired
    if (item.expires && Date.now() > item.expires) {
      this.clear(key);
      return undefined;
    }

    const value = item.value;
    
    // Clear by default unless explicitly set to false
    if (item.options.clearOnRead !== false) {
      this.clear(key, ...item.options.clearWith);
    }
    
    if (turbine.getExtensionSettings().debugMode) {
      turbine.logger.log(`Analytics value retrieved - Key: ${key}, Value:`, value);
    }
    
    return value;
  }

  /**
   * Sets multiple values at once
   * @param {Object} values - Key-value pairs to store
   * @param {Object} [options] - Same options as set() method
   * @returns {boolean} Success status
   */
  setMultiple(values, options = {}) {
    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value, options);
    });
    return this.save();
  }

  /**
   * Gets all current values without clearing them
   * @returns {Object} Object containing all stored values
   */
  getAll() {
    const result = {};
    Object.entries(this.data).forEach(([key, item]) => {
      if (!item.expires || Date.now() <= item.expires) {
        result[key] = item.value;
      }
    });
    return result;
  }

  /**
   * Manually clear specific keys (or all data if no keys provided)
   * @param {...string} keys - Keys to clear. If none provided, clears all data
   * @returns {boolean} Success status
   */
  clear(...keys) {
    if (keys.length === 0) {
      this.data = {};
    } else {
      keys.forEach(key => delete this.data[key]);
    }
    
    if (turbine.getExtensionSettings().debugMode) {
      turbine.logger.log(`Analytics values cleared - Keys: ${keys.join(', ') || 'ALL'}`);
    }
    
    return this.save();
  }

  /**
   * Cleans up expired items and items older than 24 hours
   * @private
   */
  cleanup() {
    const DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    Object.entries(this.data).forEach(([key, item]) => {
      if (
        (item.expires && now > item.expires) ||
        (now - item.timestamp > DAY_MS)
      ) {
        delete this.data[key];
      }
    });
    
    this.save();
  }

  /**
   * Gets the current size of stored data in bytes
   * @returns {number} Size in bytes
   */
  getSize() {
    return new Blob([JSON.stringify(this.data)]).size;
  }
}

module.exports = AnalyticsStorage;