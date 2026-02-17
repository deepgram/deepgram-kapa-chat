import { describe, it, expect, vi, afterEach } from 'vitest';
import { observeDom } from '../dom-observer';

describe('observeDom', () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
  });

  it('fires callback when children are added to body', async () => {
    const callback = vi.fn();
    cleanup = observeDom(callback);

    const div = document.createElement('div');
    document.body.appendChild(div);

    // Debounced at 100ms
    await new Promise((r) => setTimeout(r, 150));

    expect(callback).toHaveBeenCalled();
    document.body.removeChild(div);
  });

  it('debounces rapid DOM changes', async () => {
    const callback = vi.fn();
    cleanup = observeDom(callback);

    // Trigger multiple mutations rapidly
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.id = `rapid-${i}`;
      document.body.appendChild(div);
    }

    await new Promise((r) => setTimeout(r, 150));

    // Should have debounced to a single call
    expect(callback).toHaveBeenCalledTimes(1);

    // Cleanup test elements
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`rapid-${i}`);
      if (el) document.body.removeChild(el);
    }
  });

  it('stops observing after cleanup is called', async () => {
    const callback = vi.fn();
    cleanup = observeDom(callback);
    cleanup();
    cleanup = undefined;

    const div = document.createElement('div');
    document.body.appendChild(div);

    await new Promise((r) => setTimeout(r, 150));

    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(div);
  });
});
