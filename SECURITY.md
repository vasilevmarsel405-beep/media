# Security

- **Secrets** live in `.env.local` (gitignored) and hosting env (e.g. Vercel). Never commit tokens or passwords.
- See [`docs/SECRETS.ru.md`](docs/SECRETS.ru.md) (Russian) for rotation and disk encryption tips.
- Run `npm run secrets:check` before pushing to catch accidental token-like strings in tracked files.
