# @deepgram/docs-chat

Standalone AI chat widget for Deepgram documentation sites. Drop it into any page to give users an instant "Ask AI" experience powered by [Kapa](https://kapa.ai).

Three modes from one `init` call — use whichever combination fits your page:

| Mode | What you get |
|---|---|
| **Button + container** | Inline chat on the page, button focuses it or opens sidebar fallback |
| **Button only** | Button toggles a slide-in sidebar panel |
| **Container only** | Chat mounts directly into the page, no button binding |

Both modes are SPA-aware and automatically re-bind when the DOM changes.

## Install

```bash
pnpm add @deepgram/docs-chat
```

## Quick start

### Button + container (full experience)

Both a trigger button and an inline chat container. Clicking the button focuses the inline chat input if visible, otherwise opens the sidebar.

```ts
import { init } from '@deepgram/docs-chat';

init({
  integrationId: '<your-kapa-integration-id>',
  buttonId: 'ask-ai-btn',
  containerId: 'chat-container',
});
```

### Button only (sidebar)

No inline chat. The button toggles a slide-in sidebar panel.

```ts
init({
  integrationId: '<your-kapa-integration-id>',
  buttonId: 'ask-ai-btn',
});
```

### Container only (inline)

No button binding. The chat mounts directly into the container element.

```ts
init({
  integrationId: '<your-kapa-integration-id>',
  containerId: 'chat-container',
});
```

### UMD (script tag)

```html
<script src="https://unpkg.com/@deepgram/docs-chat"></script>
<script>
  DeepgramDocsChat.init({
    integrationId: '<your-kapa-integration-id>',
    buttonId: 'ask-ai-btn',
    containerId: 'chat-container',
  });
</script>
```

## Configuration

`init(config)` accepts a `ChatConfig` object:

| Property | Type | Required | Description |
|---|---|---|---|
| `integrationId` | `string` | yes | Your Kapa AI integration ID |
| `buttonId` | `string` | no* | DOM element ID for the "Ask AI" button |
| `containerId` | `string` | no* | DOM element ID for the inline chat container |

\* At least one of `buttonId` or `containerId` must be provided.

## How it works

1. If `containerId` is set and the element exists, the chat UI mounts inside it (inline mode).
2. If `buttonId` is set, a sidebar panel is prepared (lazy-mounted on first open) and the button is bound:
   - **If inline chat is visible** — clicking the button focuses the chat input
   - **Otherwise** — clicking toggles the sidebar open/closed
3. A `MutationObserver` watches for SPA navigation, re-binding the button and re-mounting inline chat when the DOM changes.

The button uses a document-level capture listener to intercept clicks before React 18+'s root-level event delegation, preventing framework routers (e.g. Next.js) from navigating away.

## Theming

Widget styles are a self-contained subset of [`@deepgram/styles`](https://www.npmjs.com/package/@deepgram/styles) — no extra stylesheet needed. CSS is injected at runtime by the bundle.

The widget respects `color-scheme` on the `<html>` element, so toggling between `light` and `dark` works out of the box. To override colours, set `--color-dg-*` custom properties on your page.

## Development

```bash
pnpm install       # install dependencies
pnpm dev           # vite dev server
pnpm build         # production build -> dist/
pnpm check         # lint + typecheck + test
```

## Project structure

```
src/
  index.ts          Entry point, exports init() with config validation
  types.ts          ChatConfig interface
  orchestrator.ts   Init flow that wires all modules together
  chat-app.tsx      React chat UI component (messages, input, feedback)
  inline.tsx        Inline chat mount/unmount into a container element
  sidebar.tsx       Slide-in sidebar panel with lazy React mount
  button.ts         Ask AI button binding (document-level capture listener)
  dom-observer.ts   MutationObserver for SPA navigation re-binding
  icons.tsx         Inline SVG icon components (replaces FontAwesome dependency)
  styles.css        Self-contained styles (@deepgram/styles subset + chat layout)
```

## Build output

Two bundles with CSS injected at runtime (via `vite-plugin-css-injected-by-js`):

- `dist/deepgram-docs-chat.es.js` — ESM
- `dist/deepgram-docs-chat.umd.js` — UMD (exposes `DeepgramDocsChat` global)

## License

[MIT](LICENSE)
