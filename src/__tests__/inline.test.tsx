import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mountInlineChat, unmountInlineChat, isInlineMounted } from '../inline';

// Mock react-dom/client
const mockRender = vi.fn();
const mockUnmount = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

// Mock the KapaProvider and ChatApp to avoid real SDK usage
vi.mock('@kapaai/react-sdk', () => ({
  KapaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../chat-app', () => ({
  ChatApp: () => null,
}));

const CONFIG = {
  integrationId: 'test-id',
  buttonId: 'test-btn',
  containerId: 'chat-container',
};

describe('mountInlineChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    unmountInlineChat();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts into container when element exists', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    document.body.appendChild(container);

    mountInlineChat(CONFIG);

    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(container.dataset.dgChatInit).toBe('1');
    expect(isInlineMounted()).toBe(true);
  });

  it('does nothing when container element is missing', () => {
    mountInlineChat(CONFIG);

    expect(mockRender).not.toHaveBeenCalled();
    expect(isInlineMounted()).toBe(false);
  });

  it('does not mount twice on the same container', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    document.body.appendChild(container);

    mountInlineChat(CONFIG);
    mountInlineChat(CONFIG);

    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('clears existing container content before mounting', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    container.textContent = 'Loading...';
    document.body.appendChild(container);

    mountInlineChat(CONFIG);

    // textContent is set to '' before createRoot
    expect(container.dataset.dgChatInit).toBe('1');
  });
});

describe('unmountInlineChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('unmounts the React root', () => {
    const container = document.createElement('div');
    container.id = CONFIG.containerId;
    document.body.appendChild(container);

    mountInlineChat(CONFIG);
    unmountInlineChat();

    expect(mockUnmount).toHaveBeenCalledTimes(1);
    expect(isInlineMounted()).toBe(false);
  });

  it('does nothing when not mounted', () => {
    unmountInlineChat();
    expect(mockUnmount).not.toHaveBeenCalled();
  });
});
