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
            version: "1.0.0",
            network: "Base Mainnet (Denim 200ms)",
            chainId: 8453
          }
        };
      } else if (method === 'tools/list') {
        result = {
          tools: [
            {
              name: "get_raid_status",
              description: "Gets the current active raid status, arena, and toxicity level",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "start_raid",
              description: "Starts a new reply raid battle in a specified arena (Twitter/X, Discord, Instagram, Reddit)",
              inputSchema: {
                type: "object",
                properties: {
                  arena: { type: "string", description: "Target arena for the raid" }
                },
                required: []
              }
            },
            {
              name: "get_leaderboard",
              description: "Gets the current global on-chain leaderboard of top Reply Raiders",
              inputSchema: { type: "object", properties: {}, required: [] }
            },
            {
              name: "submit_roast",
              description: "Submits a savage roast or meme reply to counter comments",
              inputSchema: {
                type: "object",
                properties: {
                  replyText: { type: "string" },
                  savageScore: { type: "number" }
                },
                required: ["replyText"]
              }
            },
            {
              name: "get_denim_network_info",
              description: "Gets Base Mainnet Denim upgrade specifications (200ms canonical blocks, retired Flashblocks, canonical RPC)",
              inputSchema: { type: "object", properties: {}, required: [] }
            }
          ]
        };
      } else if (method === 'tools/call') {
        const toolName = params?.name;
        if (toolName === "get_denim_network_info") {
          result = {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  network: "Base Mainnet",
                  chainId: 8453,
                  upgrade: "Denim",
                  blockTimeMs: 200,
                  canonicalRpc: "https://mainnet.base.org",
                  flashblocksRetired: true,
                  status: "Active"
                }, null, 2)
              }
            ]
          };
        } else {
          result = {
            content: [
              {
                type: "text",
                text: `[Reply Raiders] Execution response for ${toolName} on Base Mainnet (Denim).`
              }
            ]
          };
        }
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
