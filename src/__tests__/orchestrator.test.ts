import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock all dependencies
vi.mock('../inline', () => ({
  mountInlineChat: vi.fn(),
}));

vi.mock('../sidebar', () => ({
  prepareSidebar: vi.fn(),
}));

vi.mock('../button', () => ({
  bindButton: vi.fn(),
  isButtonBound: vi.fn(() => true),
  resetButton: vi.fn(),
}));

const domObserverCallbacks: Array<() => void> = [];
vi.mock('../dom-observer', () => ({
  observeDom: vi.fn((cb: () => void) => {
    domObserverCallbacks.push(cb);
    return vi.fn();
  }),
}));

// Mock the CSS import
vi.mock('../styles.css', () => ({}));

import { orchestrate } from '../orchestrator';
import { mountInlineChat } from '../inline';
import { prepareSidebar } from '../sidebar';
import { bindButton, isButtonBound, resetButton } from '../button';
import { observeDom } from '../dom-observer';

const CONFIG = {
  integrationId: 'test-id',
  buttonId: 'test-btn',
  containerId: 'chat-container',
};

describe('orchestrate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    domObserverCallbacks.length = 0;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts inline chat', () => {
    orchestrate(CONFIG);
    expect(mountInlineChat).toHaveBeenCalledWith(CONFIG);
  });

  it('prepares sidebar with config', () => {
    orchestrate(CONFIG);
    expect(prepareSidebar).toHaveBeenCalledWith(CONFIG);
  });

  it('binds the button', () => {
    orchestrate(CONFIG);
    expect(bindButton).toHaveBeenCalledWith(CONFIG);
  });

  it('sets up DOM observer', () => {
    orchestrate(CONFIG);
    expect(observeDom).toHaveBeenCalledWith(expect.any(Function));
  });

  it('re-binds button when DOM changes and button is missing', () => {
    vi.mocked(isButtonBound).mockReturnValue(false);

    orchestrate(CONFIG);
    const callback = domObserverCallbacks[domObserverCallbacks.length - 1];
    callback();

    expect(resetButton).toHaveBeenCalled();
    // bindButton called once in orchestrate + once in callback
    expect(bindButton).toHaveBeenCalledTimes(2);
  });

  it('re-mounts inline chat when container reappears', () => {
    orchestrate(CONFIG);

    // Simulate container appearing in DOM
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    document.body.appendChild(container);

    const callback = domObserverCallbacks[domObserverCallbacks.length - 1];
    callback();

    // mountInlineChat called once in orchestrate + once in callback
    expect(mountInlineChat).toHaveBeenCalledTimes(2);
  });

  it('does not re-mount inline chat when container already initialized', () => {
    orchestrate(CONFIG);

    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    container.dataset.dgChatInit = '1';
    document.body.appendChild(container);

    const callback = domObserverCallbacks[domObserverCallbacks.length - 1];
    callback();

    // Only the initial call
    expect(mountInlineChat).toHaveBeenCalledTimes(1);
  });
});
