import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET Request (Status check)
  if (req.method === 'GET') {
    return res.status(200).json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  }

  // POST Request (JSON-RPC logic)
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { jsonrpc, id, method, params } = body || {};

      let result: any = null;

      if (method === 'initialize') {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            prompts: {},
            resources: {}
          },
          serverInfo: {
            name: "Reply Raiders Orchestrator",
            version: "1.0.0"
          }
        };
      } else if (method === 'tools/list') {
        result = {
          tools: [
            {
              name: "get_race_status",
              description: "Gets the current status of the race",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "start_race",
              description: "Starts a new race",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "get_leaderboard",
              description: "Gets the current leaderboard",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "optimize_speed",
              description: "Optimizes the speed of the racer",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "get_track_info",
              description: "Gets information about the current track",
              inputSchema: { type: "object", properties: {}, required: [] }
            }
          ]
        };
      } else if (method === 'tools/call') {
        const toolName = params?.name;
        result = {
          content: [
            {
              type: "text",
              text: `[PLACEHOLDER] Logic for tool ${toolName} to be implemented by developer.`
            }
          ]
        };
      } else if (method === 'prompts/list') {
        result = { prompts: [] };
      } else if (method === 'resources/list') {
        result = { resources: [] };
      } else {
        // Unknown method
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: "Method not found"
          }
        });
      }

      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
