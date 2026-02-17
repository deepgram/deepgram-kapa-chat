/**
 * MutationObserver that watches for SPA navigation changes.
 * Fires a debounced callback when DOM children change.
 */

export function observeDom(callback: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, 100);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };
}
