import type { ChatConfig } from './types';
import { orchestrate } from './orchestrator';

export type { ChatConfig } from './types';

export const Chat = {
  init(config: ChatConfig): void {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      orchestrate(config);
    } else {
      document.addEventListener('DOMContentLoaded', () => orchestrate(config));
    }
  },
};
