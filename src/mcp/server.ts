import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod/v4';
import {
  MAX_BREAK_MINUTES,
  MIN_BREAK_MINUTES,
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
        'Take a coffee break. This tool will sleep for the requested duration before returning. Duration must be 1-5 minutes; defaults to COFFEE_BREAK_DEFAULT_MINUTES or 5 minutes.',
      inputSchema: {
        durationMinutes: z
          .number()
          .int()
          .min(MIN_BREAK_MINUTES)
          .max(MAX_BREAK_MINUTES)
          .optional()
          .describe('Break duration in minutes (1-5).'),
      },
    },
    async (args) => {
      const userId = getUserIdFromContext();
      const result = await handleCoffeeBreak(userId, args?.durationMinutes);
      return {
        content: [{ type: 'text', text: result }],
      };
    },
  );

  return server;
}
