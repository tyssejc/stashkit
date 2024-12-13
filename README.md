# StashKit

<img src="icon.svg" width="100" height="100" alt="StashKit Logo">

StashKit is a data persistence extension for Adobe Launch, providing a centralized storage solution for temporarily stashing analytics data that needs to be collected later.

## Overview

StashKit helps solve common analytics implementation challenges by providing a reliable way to:
- Store data that needs to persist across page loads
- Queue analytics calls when the analytics library isn't ready
- Share data between different analytics tools
- Manage user preferences and consent choices
- Handle offline data collection

## Installation

1. In Adobe Launch, go to Extensions > Catalog
2. Search for "StashKit"
3. Click Install

## Configuration

StashKit can be configured with the following options:

- **Storage Key** - The key used to store data in web storage (default: `_stashkit`)
- **Storage Type** - Choose between `localStorage` or `sessionStorage` (default: `localStorage`)
- **Debug Mode** - Enable debug logging and console panel
- **Auto Initialize** - Initialize storage automatically when Launch loads

## Actions

### Initialize Storage

Creates or connects to the storage container. While StashKit auto-initializes by default, you can use this action to:
- Override default storage settings
- Clear existing data
- Enable/disable debug mode

Configuration options:
- `storageKey` (optional) - Override default storage key
- `storageType` (optional) - Override default storage type
- `debugMode` (optional) - Override default debug setting

### Set Storage Value

Stores a value in the StashKit container.

Configuration options:
- `key` (required) - Storage key for the value
- `value` (required) - Value to store
- `clearOnRead` - Remove value after it's read (default: true)
- `clearWith` - Array of other keys to clear when this value is read

## Data Elements

### Storage Value

Retrieves a value from the StashKit container.

Configuration options:
- `key` (required) - Storage key to retrieve

## Example Use Cases

While you can store values using the extension's action, you can also use the `_stashkit.set` and `_stashkit.get` methods to store and retrieve values in custom code.

### Cross-Page Data Sharing
```javascript
// Store data on page 1
_stashkit.set('cartValue', 149.99 });

// Access on page 2 via data element
// Create data element with key 'cartValue'
```

### Persisting User Preferences
```javascript
// Store user consent choice
_stashkit.setMultiple({
  analyticsConsent: 'granted',
  adConsent: 'granted',
  personalizationConsent: 'granted',
  clearOnRead: false
});

// Retrieve in data element
// Create data element with key 'userConsent'
```

### Retrieving Values
```javascript
// Retrieve stored value
// By default, the value is deleted after it's read.
// You can use the data element's Storage Duration to keep it available for all references
// on the page load.
const cartValue = _stashkit.get('cartValue');
```

## Debugging

When debug mode is enabled, StashKit logs operations to the console and provides a debug panel accessed via:
```javascript
window._stashkit.debug();
```

## Best Practices

1. **Use Meaningful Keys**: Choose descriptive keys that indicate the data's purpose
2. **Clean Up Data**: Enable `clearOnRead` for temporary data
3. **Size Limits**: Be aware of browser storage limits (~5-10MB)
4. **Security**: Don't store sensitive information like PII
5. **Initialize Early**: Place initialization rule at start of page load

## Support

For issues or feature requests:
- GitHub Issues: [github.com/tyssejc/stashkit/issues](https://github.com/tyssejc/stashkit/issues)
- Email: charlie@ctysse.net

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE.md](LICENSE.md) for details