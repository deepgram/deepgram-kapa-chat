/**
 * Button binding — finds the Ask AI button by ID and wires click behaviour.
 * If the inline container has a chat input, focus it; otherwise toggle the sidebar.
 *
 * Attaches a single document-level capture listener so it fires before React 18+'s
 * root-level event delegation (which also uses capture phase). This ensures
 * preventDefault + stopPropagation intercept the click before Next.js router
 * can process it.
 */
import type { ChatConfig } from './types';
import { toggleSidebar } from './sidebar';

let boundConfig: ChatConfig | null = null;
let listenerAttached = false;

function handleCapture(e: Event): void {
  if (!boundConfig?.buttonId) return;

  const button = document.getElementById(boundConfig.buttonId);
  if (!button) return;

  // Check if the click target is inside the ask-ai button
  const target = e.target as Node;
  if (!button.contains(target)) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  // If inline chat is visible, focus its input (scoped to the container, not the sidebar)
  if (boundConfig.containerId) {
    const container = document.getElementById(boundConfig.containerId);
    if (container) {
      const chatInput = container.querySelector<HTMLInputElement>('.dg-chat-input');
      if (chatInput) {
        chatInput.focus();
        return;
      }
    }
  }

  // Otherwise toggle the sidebar
  toggleSidebar();
}

export function bindButton(config: ChatConfig): void {
  if (!config.buttonId) return;

  const button = document.getElementById(config.buttonId);
  if (!button) return;

  boundConfig = config;

  if (!listenerAttached) {
    document.addEventListener('click', handleCapture, { capture: true });
    listenerAttached = true;
  }
}

export function isButtonBound(): boolean {
  if (!boundConfig?.buttonId) return false;
  const el = document.getElementById(boundConfig.buttonId);
  return el !== null && document.body.contains(el);
}

export function resetButton(): void {
  boundConfig = null;
}
