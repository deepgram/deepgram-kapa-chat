# @deepgram/docs-chat

Standalone AI chat widget for Deepgram documentation sites. Drop it into any page to give users an instant "Ask AI" experience powered by [Kapa](https://kapa.ai).

Two display modes, one `init` call:

- **Inline chat** — renders inside a container element on the page
- **Sidebar chat** — slides in from the right when an "Ask AI" button is clicked

Both modes are SPA-aware and automatically re-bind when the DOM changes.

## Install

```bash
# pnpm
pnpm add @deepgram/docs-chat

# npm
npm install @deepgram/docs-chat

# yarn
yarn add @deepgram/docs-chat
```

## Quick start

### ES module (bundler)

```ts
import { init } from '@deepgram/docs-chat';

init({
  integrationId: '<your-kapa-integration-id>',
  buttonId: 'ask-ai-btn',
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

## How it works

1. If an element with `containerId` exists on the page, the chat UI mounts inside it (inline mode).
2. A sidebar panel is prepared (lazy-mounted on first open).
3. Clicking the element with `buttonId`:
   - **If inline chat is visible** — focuses the chat input
   - **Otherwise** — toggles the sidebar open/closed
4. A `MutationObserver` watches for SPA navigation, re-binding the button and re-mounting inline chat when the DOM changes.

## Configuration

`init(config)` accepts a `ChatConfig` object:

| Property | Type | Description |
|---|---|---|
| `integrationId` | `string` | Your Kapa AI integration ID |
| `buttonId` | `string` | DOM element ID for the "Ask AI" button |
| `containerId` | `string` | DOM element ID for the inline chat container |

## Theming

[`@deepgram/styles`](https://www.npmjs.com/package/@deepgram/styles) is bundled into the widget — no extra stylesheet needed. Colors and typography are applied automatically via CSS custom properties.

The widget respects `color-scheme` on the `<html>` element, so toggling between `light` and `dark` works out of the box. To override colors, set `--color-dg-*` custom properties on your page.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server with example pages
pnpm dev

# Build the library
pnpm build

# Preview the production build
pnpm preview
```

The `examples/` directory contains two demo pages:

- `index.html` — docs page with sidebar-only chat (no inline container)
- `ask-ai.html` — dedicated Ask AI page with inline chat

### Project structure

```
src/
  index.ts          Entry point — exports init()
  types.ts          ChatConfig interface
  orchestrator.ts   Init flow that wires all modules
  chat-app.tsx      React chat UI component
  inline.tsx        Inline chat mount/unmount
  sidebar.tsx       Slide-in sidebar panel
  button.ts         Ask AI button binding
  dom-observer.ts   MutationObserver for SPA navigation
  styles.css        Widget styles
examples/
  index.html        Docs page demo
  ask-ai.html       Inline chat demo
  shared.css        Example page styles
```

## License

[MIT](LICENSE)
