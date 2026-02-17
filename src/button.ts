/**
 * Button binding — finds the Ask AI button by ID and wires click behaviour.
 * If the inline container has a chat input, focus it; otherwise toggle the sidebar.
 *
 * Strips any href from the element to prevent navigation, and tracks the actual
 * DOM element reference so SPA re-renders trigger a proper re-bind.
 */
import type { ChatConfig } from './types';
import { toggleSidebar } from './sidebar';

let boundElement: HTMLElement | null = null;

export function bindButton(config: ChatConfig): void {
  const button = document.getElementById(config.buttonId);
  if (!button || button === boundElement) return;

  // Strip href so the browser never tries to navigate
  button.removeAttribute('href');
  button.style.cursor = 'pointer';

  boundElement = button;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If inline chat is visible, focus its input (scoped to the container, not the sidebar)
    const container = document.getElementById(config.containerId);
    if (container) {
      const chatInput = container.querySelector<HTMLInputElement>('.dg-chat-input');
      if (chatInput) {
        chatInput.focus();
        return;
      }
    }

    // Otherwise toggle the sidebar
    toggleSidebar();
  });
}

export function isButtonBound(): boolean {
  return boundElement !== null && document.body.contains(boundElement);
}

export function resetButton(): void {
  boundElement = null;
}
