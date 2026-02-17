import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../orchestrator', () => ({
  orchestrate: vi.fn(),
}));

import { init } from '../index';
import { orchestrate } from '../orchestrator';

const CONFIG = {
  integrationId: 'test-id',
  buttonId: 'test-btn',
  containerId: 'chat-container',
};

describe('init', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls orchestrate when document is ready', () => {
    // jsdom sets readyState to 'complete' by default
    init(CONFIG);
    expect(orchestrate).toHaveBeenCalledWith(CONFIG);
  });

  it('exports init function', async () => {
    const mod = await import('../index');
    expect(mod.init).toBeInstanceOf(Function);
  });
});
