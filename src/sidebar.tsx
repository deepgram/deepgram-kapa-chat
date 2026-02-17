/**
 * Sidebar panel — a fixed slide-in panel that renders the same React chat app.
 * Mounts lazily on first open to avoid conflicting with inline chat's KapaProvider.
 */
import { createRoot, type Root } from 'react-dom/client';
import { KapaProvider } from '@kapaai/react-sdk';
import type { ChatConfig } from './types';
import { ChatApp } from './chat-app';
import { XMarkIcon } from './icons';

let panel: HTMLElement | null = null;
let root: Root | null = null;
let isOpen = false;
let savedConfig: ChatConfig | null = null;

function ensurePanel(): HTMLElement {
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = 'dg-chat-sidebar';
  panel.className = 'dg-chat-sidebar';

  const backdrop = document.createElement('div');
  backdrop.className = 'dg-chat-sidebar-backdrop';
  backdrop.addEventListener('click', closeSidebar);
  panel.appendChild(backdrop);

  const content = document.createElement('div');
  content.className = 'dg-chat-sidebar-content';
  panel.appendChild(content);

  document.body.appendChild(panel);
  return panel;
}

function SidebarWrapper() {
  return (
    <div className="dg-chat-sidebar-wrapper">
      <div className="dg-chat-sidebar-header">
        <span className="dg-chat-sidebar-title">Ask Deepgram</span>
        <button className="dg-btn dg-btn--ghost dg-btn--icon-only" onClick={closeSidebar} title="Close">
          <XMarkIcon />
        </button>
      </div>
      <ChatApp />
    </div>
  );
}

function mountRoot(config: ChatConfig): void {
  if (root) return;
  const el = ensurePanel();
  const content = el.querySelector('.dg-chat-sidebar-content')!;

  root = createRoot(content);
  root.render(
    <KapaProvider integrationId={config.integrationId}>
      <SidebarWrapper />
    </KapaProvider>,
  );
}

export function prepareSidebar(config: ChatConfig): void {
  savedConfig = config;
}

export function openSidebar(): void {
  if (!root && savedConfig) {
    mountRoot(savedConfig);
  }

  const el = ensurePanel();
  el.classList.add('open');
  isOpen = true;
  document.body.style.overflow = 'hidden';
}

export function closeSidebar(): void {
  if (!panel) return;
  panel.classList.remove('open');
  isOpen = false;
  document.body.style.overflow = '';
}

export function toggleSidebar(): void {
  if (isOpen) closeSidebar();
  else openSidebar();
}

export function isSidebarOpen(): boolean {
  return isOpen;
}
