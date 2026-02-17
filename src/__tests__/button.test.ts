import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bindButton, isButtonBound, resetButton } from '../button';

// Mock the sidebar module
vi.mock('../sidebar', () => ({
  toggleSidebar: vi.fn(),
}));

import { toggleSidebar } from '../sidebar';

const CONFIG = {
  integrationId: 'test-id',
  buttonId: 'test-btn',
  containerId: 'test-container',
};

describe('bindButton', () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    resetButton();
    vi.clearAllMocks();

    button = document.createElement('button');
    button.id = CONFIG.buttonId;
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('binds click handler to the button element', () => {
    bindButton(CONFIG);
    expect(isButtonBound()).toBe(true);
  });

  it('does nothing if button element is missing', () => {
    document.body.innerHTML = '';
    bindButton(CONFIG);
    expect(isButtonBound()).toBe(false);
  });

  it('toggles sidebar when clicked and no inline container exists', () => {
    bindButton(CONFIG);
    button.click();

    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('focuses inline chat input when container exists with input', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    const input = document.createElement('input');
    input.className = 'dg-chat-input';
    container.appendChild(input);
    document.body.appendChild(container);

    const focusSpy = vi.spyOn(input, 'focus');

    bindButton(CONFIG);
    button.click();

    expect(focusSpy).toHaveBeenCalled();
    expect(toggleSidebar).not.toHaveBeenCalled();
  });

  it('toggles sidebar when container exists but has no input', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    document.body.appendChild(container);

    bindButton(CONFIG);
    button.click();

    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('does not bind twice to the same element', () => {
    bindButton(CONFIG);
    bindButton(CONFIG);

    button.click();
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('preserves href on the element', () => {
    const link = document.createElement('a');
    link.id = CONFIG.buttonId;
    link.setAttribute('href', '/some-page');
    // Replace the button with the link
    button.remove();
    document.body.appendChild(link);
    resetButton();

    bindButton(CONFIG);
    expect(link.getAttribute('href')).toBe('/some-page');
  });

  it('re-binds when element is replaced in the DOM', () => {
    bindButton(CONFIG);

    // Simulate SPA replacing the element
    button.remove();
    resetButton();
    const newButton = document.createElement('button');
    newButton.id = CONFIG.buttonId;
    document.body.appendChild(newButton);

    bindButton(CONFIG);
    newButton.click();

    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('reports unbound when element is removed from DOM', () => {
    bindButton(CONFIG);
    expect(isButtonBound()).toBe(true);

    button.remove();
    expect(isButtonBound()).toBe(false);
  });
});

describe('resetButton', () => {
  beforeEach(() => {
    resetButton();
  });

  it('resets bound state so button can be re-bound', () => {
    const button = document.createElement('button');
    button.id = CONFIG.buttonId;
    document.body.appendChild(button);

    bindButton(CONFIG);
    expect(isButtonBound()).toBe(true);

    resetButton();
    expect(isButtonBound()).toBe(false);

    document.body.innerHTML = '';
  });
});
