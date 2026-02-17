/**
 * Inline chat — detects the container element and mounts/unmounts the React chat app.
 */
import { createRoot, type Root } from 'react-dom/client';
import { KapaProvider } from '@kapaai/react-sdk';
import type { ChatConfig } from './types';
import { ChatApp } from './chat-app';

let root: Root | null = null;

export function mountInlineChat(config: ChatConfig): void {
  if (!config.containerId) return;
  const container = document.getElementById(config.containerId);
  if (!container || container.dataset.dgChatInit) return;
  container.dataset.dgChatInit = '1';

  container.textContent = '';
  root = createRoot(container);
  root.render(
    <KapaProvider integrationId={config.integrationId}>
      <ChatApp />
    </KapaProvider>,
  );
}

export function unmountInlineChat(): void {
  if (root) {
    root.unmount();
    root = null;
  }
}

export function isInlineMounted(): boolean {
  return root !== null;
}
