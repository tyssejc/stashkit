module.exports = {
  "extensions": {
    "analytics-storage-extension": {
      "displayName": "Analytics Storage",
      "settings": {
        "storageKey": "_analytics",
        "storageType": "localStorage",
        "autoInit": true,
        "debugMode": true
      }
    }
  },
  "dataElements": {
    "test": {
      "settings": {
        "key": "searchType"
      },
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "analytics-storage-extension/src/lib/dataElements/storageValue.js",
      "storageDuration": "pageview"
    }
  },
  "rules": [{
    "id": "RL1730218461909",
    "name": "test",
    "events": [{
      "modulePath": "sandbox/click.js",
      "settings": {}
    }],
    "actions": [{
      "modulePath": "analytics-storage-extension/src/lib/actions/setStorageValue.js",
      "settings": {
        "key": "searchType",
        "value": "formSubmit",
        "clearOnRead": true,
        "clearWith": []
      }
    }]
  }],
  "property": {
    "name": "Sandbox property",
    "settings": {
      "id": "PR12345",
      "domains": ["adobe.com", "example.com"],
      "undefinedVarsReturnEmpty": false
    }
  },
  "company": {
    "orgId": "ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg"
  },
  "environment": {
    "id": "EN00000000000000000000000000000000",
    "stage": "development"
  },
  "buildInfo": {
    "turbineVersion": "27.5.0",
    "turbineBuildDate": "2024-10-29T16:15:43.524Z",
    "buildDate": "2024-10-29T16:15:43.524Z",
    "environment": "development"
  }
}