import cookieParser from 'cookie-parser';
import express, { type Request, type Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp/server.js';
import { getUserByToken } from './services/user.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';
import { getTokenFromRequest } from './lib/cookies.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Homepage
app.get('/', (req: Request, res: Response) => {
  const token = getTokenFromRequest(req);
  res.render('index', { hasToken: Boolean(token) });
});

// Auth and stats routes
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);

// MCP endpoint - Streamable HTTP
app.all('/mcp', async (req: Request, res: Response) => {
  // Extract bearer token from Authorization header
  let userId: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const user = await getUserByToken(token);
    if (user) {
      userId = user.id;
    }
  }

  // Create MCP server with user context
  const server = createMcpServer(() => userId);

  // Create transport for this request
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless mode
  });

  // Connect server to transport
  await server.connect(transport);

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

app.listen(PORT, () => {
  console.log(`Coffee Break MCP Server running on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
