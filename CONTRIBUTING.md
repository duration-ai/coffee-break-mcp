# Contributing

Thanks for taking a look. This is a small, joke project, so keep changes simple.

## Development

1. Install dependencies with `bun install`.
2. Copy `.env.example` to `.env` and fill in values.
3. Run `bun run db:migrate` once to set up tables.
4. Start the server with `bun run dev`.

## Pull Requests

- Keep scope tight and focused.
- Include a short description of what changed and why.
- Run `bun run check` and `bun run lint` if relevant.

## Code Style

- TypeScript only in `src/`.
- Format with `bun run format` when making broad changes.
