const { expect } = require('chai');
const sinon = require('sinon');
const { JSDOM } = require('jsdom');
const path = require('path');
const proxyquire = require('proxyquire').noCallThru();

// Create a mock window environment with localStorage
const dom = new JSDOM('<!DOCTYPE html>', {
  url: 'http://localhost'
});

// Mock localStorage
const localStorage = {
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

const mockWindow = Object.assign({}, dom.window, {
  localStorage,
  addEventListener: sinon.stub(),
  console: {
    log: sinon.stub()
  }
});

global.window = mockWindow;
global.document = dom.window.document;

// Mock turbine
global.turbine = {
  getExtensionSettings: () => ({
    storageKey: 'test-storage-key',
    storageType: 'localStorage',
    debugMode: true
  })
};

describe('initializeStashKit', () => {
  let initializeStashKit;
  let StashKitStub;
  let DebugPanelStub;

  beforeEach(() => {
    // Clear any previous instances
    delete mockWindow._stashkit;
    delete mockWindow._stashkitDebug;
    
    // Create stubs
    StashKitStub = sinon.stub();
    DebugPanelStub = sinon.stub();

    // Use proxyquire to mock dependencies
    initializeStashKit = proxyquire('../../src/lib/helpers/initializeStashKit', {
      '@adobe/reactor-window': mockWindow,
      './StashKit': StashKitStub,
      './DebugPanel': DebugPanelStub
    });
  });

  afterEach(() => {
    // Cleanup
    delete mockWindow._stashkit;
    delete mockWindow._stashkitDebug;
    sinon.restore();
  });

  it('should initialize StashKit instance with correct parameters', () => {
    expect(StashKitStub.calledOnce).to.be.true;
    expect(StashKitStub.firstCall.args[0]).to.equal('test-storage-key');
    expect(StashKitStub.firstCall.args[1]).to.be.true;
  });

  it('should initialize debug panel when debug mode is enabled', () => {
    expect(DebugPanelStub.calledOnce).to.be.true;
  });

  it('should not create multiple instances on repeated initialization', () => {
    const firstInstance = mockWindow._stashkit;
    
    // Re-initialize
    initializeStashKit = proxyquire('../../src/lib/helpers/initializeStashKit', {
      '@adobe/reactor-window': mockWindow,
      './StashKit': StashKitStub,
      './DebugPanel': DebugPanelStub
    });
    
    expect(mockWindow._stashkit).to.equal(firstInstance);
  });
});
