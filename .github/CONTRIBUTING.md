# Contributing to @deepgram/chat

Thank you for considering contributing! Every contribution helps make the Deepgram developer experience better.

## Getting started

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```
4. Open the example pages in your browser (Vite will print the URL).

## Development workflow

```bash
pnpm dev       # Start dev server with hot reload
pnpm build     # Type-check and build the library
pnpm test      # Run the test suite
pnpm preview   # Preview the production build
```

## Making changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Make your changes.
3. Add or update tests for any changed behavior.
4. Run the full test suite to make sure nothing is broken:
   ```bash
   pnpm test
   ```
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(sidebar): add keyboard shortcut to close
   fix(button): handle missing container gracefully
   docs: update configuration table in README
   ```
6. Open a pull request against `main`.

## Commit message format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) and [release-please](https://github.com/googleapis/release-please) for automated releases. Your commit messages directly affect changelogs and version bumps.

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

A `feat` commit triggers a **minor** version bump. A `fix` commit triggers a **patch** bump. Adding `BREAKING CHANGE:` in the commit body triggers a **major** bump.

## Pull requests

- Keep PRs focused — one feature or fix per PR.
- Include a clear description of what changed and why.
- Add screenshots for visual changes.
- Make sure CI passes before requesting review.

## Reporting bugs

Use the [bug report template](https://github.com/deepgram/deepgram-kapa-chat/issues/new?template=bug_report.md) and include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Console errors if applicable

## Code style

- TypeScript strict mode is enabled.
- Use the existing patterns in the codebase as a guide.
- CSS class names use the `dg-chat-` prefix.
- Component files are `.tsx`, plain modules are `.ts`.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
