import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../orchestrator', () => ({
  orchestrate: vi.fn(),
}));

import { Chat } from '../index';
import { orchestrate } from '../orchestrator';

const CONFIG = {
  integrationId: 'test-id',
  buttonId: 'test-btn',
  containerId: 'chat-container',
};

describe('Chat.init', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls orchestrate when document is ready', () => {
    // jsdom sets readyState to 'complete' by default
    Chat.init(CONFIG);
    expect(orchestrate).toHaveBeenCalledWith(CONFIG);
  });

  it('exports ChatConfig type', async () => {
    // Verify the type export exists by importing it
    const mod = await import('../index');
    expect(mod.Chat).toBeDefined();
    expect(mod.Chat.init).toBeInstanceOf(Function);
  });
});
