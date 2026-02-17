import type { ChatConfig } from './types';
import { orchestrate } from './orchestrator';

export type { ChatConfig } from './types';

export function init(config: ChatConfig): void {
  if (!config.buttonId && !config.containerId) {
    console.error('[deepgram-docs-chat] At least one of buttonId or containerId is required.');
    return;
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    orchestrate(config);
  } else {
    document.addEventListener('DOMContentLoaded', () => orchestrate(config));
  }
}
