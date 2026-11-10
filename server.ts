import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // MCP Route
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Reply Raiders MCP Endpoint",
      status: "active",
      network: "Base Mainnet (Denim 200ms)",
      chainId: 8453,
      description: "Active MCP server for Reply Raiders Orchestrator Agent",
      capabilities: ["reply-management", "engagement-automation", "smart-response-generation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Reply Raiders Orchestrator",
        network: "Base Mainnet (Denim)",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent API Route
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Reply Raiders Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Reply Raiders",
      network: "Base Mainnet",
      chainId: 8453,
      upgrade: "Denim",
      blockTimeMs: 200,
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
