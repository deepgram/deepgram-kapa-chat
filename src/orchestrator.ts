/**
 * Orchestrator — the init flow that wires all modules together.
 * 1. Mount inline chat if container exists
 * 2. Mount sidebar (rendered, hidden until toggled)
 * 3. Bind the Ask AI button
 * 4. Watch for SPA navigation (re-bind button, re-mount inline chat)
 */
import type { ChatConfig } from './types';
import { mountInlineChat } from './inline';
import { prepareSidebar } from './sidebar';
import { bindButton, isButtonBound, resetButton } from './button';
import { observeDom } from './dom-observer';

import './styles.css';

export function orchestrate(config: ChatConfig): void {
  // Mount inline chat if container ID is configured
  if (config.containerId) {
    mountInlineChat(config);
  }

  // Store config for sidebar — mounts lazily on first open (needs button to toggle)
  if (config.buttonId) {
    prepareSidebar(config);
    bindButton(config);
  }

  // SPA navigation — re-bind button and re-mount inline chat when DOM changes
  observeDom(() => {
    if (config.buttonId) {
      if (!isButtonBound() || !document.getElementById(config.buttonId)) {
        resetButton();
        bindButton(config);
      }
    }

    if (config.containerId) {
      const container = document.getElementById(config.containerId);
      if (container && !container.dataset.dgChatInit) {
        mountInlineChat(config);
      }
    }
  });
}
