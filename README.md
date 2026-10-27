# monkeyread

A free speed-reading app with the look and feel of [monkeytype](https://monkeytype.com).

Words appear one at a time in the same spot, with one letter highlighted where your eye should land (RSVP reading). Paste any text or import a book, pick a speed, and read.

## Features

- RSVP reader with a highlighted pivot letter aligned on a fixed guide
- Speed presets or any custom speed, 1 to 3 words at a time, longer pauses on punctuation
- Focus mode: everything but the word fades out while reading
- Keyboard shortcuts: `space` play/pause, `tab` restart, `←` `→` previous/next word (`shift` for 10)
- Library: import PDF, EPUB or TXT books, extracted in the browser (pdf.js, JSZip) and kept in IndexedDB with your reading position; links to free public-domain sources
- Settings page: sounds, 10 fonts, text size, progress style, guides, themes, and more
- 5 themes (serika dark, serika, paper, nord, dracula)
- Texts and books stay in your browser; an optional account only syncs reading stats and settings

## Getting started

Requires Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Command          | What it does                    |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Start the dev server            |
| `pnpm build`     | Production build                |
| `pnpm typecheck` | Type-check with tsc             |
| `pnpm lint`      | Lint with oxlint + @shadcn/lint |
| `pnpm format`    | Format with oxfmt               |

## Stack

Next.js, Tailwind CSS v4, shadcn/ui (Radix), oxlint with [@shadcn/lint](https://github.com/shadcn-ui/lint), oxfmt.

Component styles live in `src/components/ui` and the theme tokens in `src/app/globals.css`. The `shadcn/no-arbitrary-values` rule keeps app code on those tokens.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`, ...), enforced by commitlint.

Git hooks (husky) run on `pnpm install`:

- `pre-commit`: `pnpm audit` when dependencies change, typecheck and build when app code changes, then oxlint and oxfmt on staged files (lint-staged)
- `commit-msg`: commitlint

CI runs the audit, lint, format check, commitlint (on PRs), typecheck and build. Releases are created by running the **Create Release** workflow by hand: it tags a CalVer version (`vYYYY.M.N`) and writes the changelog with git-cliff. Vercel deploys `main` on its own.

## Credits

The whole UX comes from [monkeytype](https://monkeytype.com) by Miodec and its community: layout, config bar, focus mode, modals, animations, settings page and themes. The serika dark, serika, nord and dracula palettes use the colors of the monkeytype themes of the same name.

monkeyread is an independent project with no official link to monkeytype. No monkeytype code or sound files are reused: the UI is written from scratch and sounds are synthesized in the browser. If you like monkeyread, go type on monkeytype and support it on [GitHub](https://github.com/monkeytypegame/monkeytype).

## License

[MIT](LICENSE)
