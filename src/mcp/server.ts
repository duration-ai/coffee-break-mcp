import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod/v4';
import {
  MAX_BREAK_SECONDS,
  MIN_BREAK_SECONDS,
} from '../services/coffee-break.js';
import { handleCoffeeBreak } from './tools/coffee-break.js';

export function createMcpServer(
  getUserIdFromContext: () => string | undefined,
) {
  const server = new McpServer({
    name: 'coffee-break-mcp',
    version: '1.0.0',
  });

  server.registerTool(
    'take_coffee_break',
    {
      description:
        'Take a coffee break. This tool will sleep for the requested duration before returning. Duration must be 1-900 seconds.',
      inputSchema: {
        durationSeconds: z
          .number()
          .int()
          .min(MIN_BREAK_SECONDS)
          .max(MAX_BREAK_SECONDS)
          .describe('Break duration in seconds (1-900).'),
      },
    },
    async (args) => {
      const userId = getUserIdFromContext();
      const result = await handleCoffeeBreak(userId, args.durationSeconds);
      return {
        content: [{ type: 'text', text: result }],
      };
    },
  );

  return server;
}
