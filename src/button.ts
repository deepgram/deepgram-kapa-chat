/**
 * Button binding — finds the Ask AI button by ID and wires click behaviour.
 * If the inline container has a chat input, focus it; otherwise toggle the sidebar.
 */
import type { ChatConfig } from './types';
import { toggleSidebar } from './sidebar';

let bound = false;

export function bindButton(config: ChatConfig): void {
  const button = document.getElementById(config.buttonId);
  if (!button || bound) return;
  bound = true;

  button.style.cursor = 'pointer';
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
  return bound;
}

export function resetButton(): void {
  bound = false;
}
