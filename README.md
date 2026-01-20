# Coffee Break MCP Server

A joke MCP server with one tool (`take_coffee_break`) that sleeps for 1-900 seconds. Includes optional user registration for tracking stats.

## The Tool

**Name:** `take_coffee_break`

**Input:** `{ "durationSeconds"?: number }` (1-900 seconds)

When called, this tool:
1. Records the break start time
2. Sleeps for the requested duration (1-900 seconds)
3. Records the break completion
4. Returns: "Coffee break complete. X seconds elapsed. Returning to work."

The tool accepts an optional `durationSeconds` argument (1-900). If omitted, it uses `COFFEE_BREAK_DEFAULT_SECONDS` or defaults to 300 seconds.

**Note:** Long requests can be cut off by proxies/load balancers. On Railway, the edge proxy advertises a 15-minute max request duration and a 60-second keep-alive; very long breaks may still fail in practice. Shorter breaks are more reliable.

## Privacy & Data

- No email or account required.
- Tokens are stored in a browser cookie for convenience.
- Stats are tied only to the token.

## Abuse & Limits

- Token generation is rate-limited per IP.
- Break duration is capped at 900 seconds.

## Disclaimer

This is a toy/joke project. It is not production-grade.

## Usage

### Anonymous Usage

Just connect to the MCP endpoint - no registration required:

```json
{
  "mcpServers": {
    "coffee-break": {
      "type": "streamable-http",
      "url": "https://your-app.railway.app/mcp"
    }
  }
}
```

### With Stats Tracking

1. Visit `/auth/register` to generate an anonymous token
2. Save your token (shown only once)
3. Add it to your MCP config:

```json
{
  "mcpServers": {
    "coffee-break": {
      "type": "streamable-http",
      "url": "https://your-app.railway.app/mcp",
      "headers": {
        "Authorization": "Bearer your-api-token"
      }
    }
  }
}
```

4. View your stats at `/stats`

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Turso](https://turso.tech) account (free tier available)

### Setup

```bash
# Install dependencies
bun install

# Install Turso CLI (macOS)
brew install tursodatabase/tap/turso

# Login to Turso
turso auth login

# Create a database
turso db create coffee-break

# Get your database URL and token
turso db show coffee-break          # Copy the URL
turso db tokens create coffee-break  # Copy the token

# Set up environment
cp .env.example .env
# Edit .env with your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN

# Generate and run migrations
bun run db:generate
bun run db:migrate

# Start dev server
bun run dev
```

## Deployment

### Railway

1. Create a new Railway project
2. Connect your GitHub repo
3. Add environment variables:
   - `TURSO_DATABASE_URL` - Your Turso database URL
   - `TURSO_AUTH_TOKEN` - Your Turso auth token
4. Railway will automatically build and start the server

### Other Platforms

This server works on any platform that supports Bun or Node.js. Just set the environment variables and run:

```bash
bun run db:migrate  # Run once to set up tables
bun run start       # Start the server
```

## Tech Stack

- Bun + TypeScript
- Express 5 + @modelcontextprotocol/sdk
- Turso (SQLite) + Drizzle ORM
- EJS templates

## Contributing

See `CONTRIBUTING.md`.

## License

MIT. See `LICENSE`.
