# Contributing to monkeyread

Thanks for helping! monkeyread is a small project, so the process is light.

## Before you start

- **Bug or idea?** Open an issue first, so we can agree on the fix or the feature before you write code.
- **Question?** Use [Discussions](https://github.com/damien-mathieu1/monkeyread/discussions).
- **Security issue?** Do not open a public issue; follow [SECURITY.md](SECURITY.md).

## Setup

Requires Node.js and pnpm (the version is pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

The app works without a backend. Accounts, stats and leaderboards need a local Supabase (requires Docker):

```bash
pnpm db:start
cp .env.example .env.local   # then fill in the URL and key printed by db:start
```

## Making a change

1. Fork the repo and create a branch from `main`.
2. Keep the change focused: one fix or feature per pull request.
3. Follow the existing style:
   - Components stay generic: put styles in the theme tokens, not one-off arbitrary values (enforced by `@shadcn/lint`).
   - Every UI string goes in both `src/lib/i18n/fr.tsx` and `src/lib/i18n/en.tsx`. Typecheck fails if a key is missing.
4. Run the checks (the pre-commit hook runs them too):

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm format
   pnpm build
   ```

5. Commit with [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`). commitlint checks it.
6. Open a pull request and fill in the template. Add screenshots for UI changes.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](../LICENSE).
