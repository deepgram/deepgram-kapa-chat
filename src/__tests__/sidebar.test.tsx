import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock react-dom/client
const mockRender = vi.fn();
const mockUnmount = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

// Mock the KapaProvider and ChatApp
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

// The sidebar module uses module-level singletons (panel, root, isOpen).
// We need to reset modules between tests that depend on fresh state.
// For tests that build on each other (open then close), we chain them.

describe('sidebar', () => {
  // Get fresh module for each test to avoid stale singleton references
  let prepareSidebar: typeof import('../sidebar').prepareSidebar;
  let openSidebar: typeof import('../sidebar').openSidebar;
  let closeSidebar: typeof import('../sidebar').closeSidebar;
  let toggleSidebar: typeof import('../sidebar').toggleSidebar;
  let isSidebarOpen: typeof import('../sidebar').isSidebarOpen;

  beforeEach(async () => {
    vi.clearAllMocks();
    document.body.innerHTML = '';

    // Reset modules to get fresh singleton state
    vi.resetModules();
    const mod = await import('../sidebar');
    prepareSidebar = mod.prepareSidebar;
    openSidebar = mod.openSidebar;
    closeSidebar = mod.closeSidebar;
    toggleSidebar = mod.toggleSidebar;
    isSidebarOpen = mod.isSidebarOpen;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('starts closed', () => {
    expect(isSidebarOpen()).toBe(false);
  });

  it('prepareSidebar stores config for later use', () => {
    prepareSidebar(CONFIG);
    // No panel should exist yet — lazy mount
    expect(document.getElementById('dg-chat-sidebar')).toBeNull();
  });

  it('openSidebar creates panel and mounts React root', () => {
    prepareSidebar(CONFIG);
    openSidebar();

    const panel = document.getElementById('dg-chat-sidebar');
    expect(panel).not.toBeNull();
    expect(panel!.classList.contains('open')).toBe(true);
    expect(isSidebarOpen()).toBe(true);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('openSidebar sets body overflow to hidden', () => {
    prepareSidebar(CONFIG);
    openSidebar();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closeSidebar removes open class and restores overflow', () => {
    prepareSidebar(CONFIG);
    openSidebar();
    closeSidebar();

    const panel = document.getElementById('dg-chat-sidebar');
    expect(panel).not.toBeNull();
    expect(panel!.classList.contains('open')).toBe(false);
    expect(isSidebarOpen()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('toggleSidebar opens when closed', () => {
    prepareSidebar(CONFIG);
    toggleSidebar();

    expect(isSidebarOpen()).toBe(true);
  });

  it('toggleSidebar closes when open', () => {
    prepareSidebar(CONFIG);
    openSidebar();
    toggleSidebar();

    expect(isSidebarOpen()).toBe(false);
  });

  it('panel has backdrop and content elements', () => {
    prepareSidebar(CONFIG);
    openSidebar();

    const panel = document.getElementById('dg-chat-sidebar')!;
    expect(panel.querySelector('.dg-chat-sidebar-backdrop')).not.toBeNull();
    expect(panel.querySelector('.dg-chat-sidebar-content')).not.toBeNull();
  });

  it('clicking backdrop closes the sidebar', () => {
    prepareSidebar(CONFIG);
    openSidebar();

    const backdrop = document.querySelector('.dg-chat-sidebar-backdrop') as HTMLElement;
    expect(backdrop).not.toBeNull();
    backdrop.click();

    expect(isSidebarOpen()).toBe(false);
  });

  it('only mounts React root once across multiple opens', () => {
    prepareSidebar(CONFIG);
    openSidebar();
    closeSidebar();
    openSidebar();

    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
