const { expect } = require('chai');
const sinon = require('sinon');
const { JSDOM } = require('jsdom');
const proxyquire = require('proxyquire').noCallThru();

// Create a mock window environment with localStorage
const dom = new JSDOM('<!DOCTYPE html>', {
  url: 'http://localhost'
});

// Mock storage
const mockStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  clear() {
    this.store = {};
  }
};

const mockWindow = {
  localStorage: mockStorage,
  sessionStorage: { ...mockStorage },
  addEventListener: sinon.stub(),
  document: dom.window.document
};

// Mock @adobe/reactor-window module
const mockReactorWindow = mockWindow;

// Set up window and storage in global scope first
global.window = mockWindow;
global.localStorage = mockStorage;
global.sessionStorage = { ...mockStorage };

// Create turbine mock with window context
const turbineMock = {
  logger: {
    log: sinon.stub(),
    error: sinon.stub(),
    debug: sinon.stub()
  },
  getExtensionSettings: sinon.stub().returns({
    debugMode: false
  })
};

// Set up turbine in global scope
global.turbine = turbineMock;

// Use proxyquire to mock the module and dependencies
const StashKit = proxyquire('../../src/lib/helpers/StashKit', {
  '@adobe/reactor-window': mockReactorWindow
});

describe('StashKit', () => {
  let stashkit;
  const storageKey = 'test-storage-key';
  
  beforeEach(() => {
    // Reset all stubs
    sinon.resetHistory();
    
    // Clear storage before each test
    mockStorage.clear();
    
    // Create new instance
    stashkit = new StashKit(storageKey, true);
  });

  afterEach(() => {
    mockStorage.clear();
  });

  describe('initialization', () => {
    it('should create a new instance with the correct storage key', () => {
      expect(stashkit).to.be.an.instanceOf(StashKit);
      expect(stashkit.storageKey).to.equal(storageKey);
    });

    it('should initialize with empty storage', () => {
      expect(stashkit.getAll()).to.deep.equal({});
    });

    it('should add beforeunload event listener', () => {
      expect(mockWindow.addEventListener.calledWith('beforeunload')).to.be.true;
    });
  });

  describe('setValue', () => {
    it('should store a value correctly', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      stashkit.setValue(key, value);
      expect(stashkit.getValue(key)).to.equal(value);
    });

    it('should overwrite existing values', () => {
      const key = 'testKey';
      stashkit.setValue(key, 'value1');
      stashkit.setValue(key, 'value2');
      
      expect(stashkit.getValue(key)).to.equal('value2');
    });
  });

  describe('getValue', () => {
    it('should return undefined for non-existent keys', () => {
      expect(stashkit.getValue('nonexistent')).to.be.undefined;
    });

    it('should return the correct value for existing keys', () => {
      const key = 'testKey';
      const value = { test: 'value' };
      
      stashkit.setValue(key, value);
      expect(stashkit.getValue(key)).to.deep.equal(value);
    });
  });

  describe('removeValue', () => {
    it('should remove an existing value', () => {
      const key = 'testKey';
      stashkit.setValue(key, 'value');
      stashkit.removeValue(key);
      
      expect(stashkit.getValue(key)).to.be.undefined;
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => stashkit.removeValue('nonexistent')).to.not.throw();
    });
  });

  describe('clear', () => {
    it('should remove all values', () => {
      stashkit.setValue('key1', 'value1');
      stashkit.setValue('key2', 'value2');
      
      stashkit.clear();
      expect(stashkit.getAll()).to.deep.equal({});
    });
  });
});
