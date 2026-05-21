# Reply Raiders Orchestrator

**Reply Raiders** is a fast-paced, hilarious, and addictive reply battle game. You are a **Reply Raider** — a digital warrior who raids chaotic inboxes, group chats, and comment sections. Your mission is to craft the funniest, savage, or most epic replies to defeat toxic users, trolls, and spam.

## Project Overview

- **App Name:** Reply Raiders Orchestrator
- **Version:** 1.0.0
- **App URL:** https://reply-raiders-s.vercel.app/

## Capabilities & Skills
- Core capabilities: `reply-management`, `engagement-automation`, `multi-platform-raiding`, `smart-response-generation`, `comment-orchestration`, `mcp-command-execution`

## Tech Stack
- Framework: Next.js 14 App Router (configured for API endpoints), React, Wagmi, viem, Tailwind CSS
- Network: Base (`eip155:8453`)

## MCP Connection Guide

This application provides a Model Context Protocol (MCP) endpoint to execute active commands and interact with AI tools.

- **MCP Endpoint URL:** `https://reply-raiders-s.vercel.app/api/mcp`
- Connect your MCP client via a POST request to send commands.
- **[PLACEHOLDER]** You will need to implement specific tools (`get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`) in the MCP server if required.

## Agent Registration Info

- **Agent Name:** Reply Raiders Orchestrator
- **Registration Standard:** ERC-8004
- **Agent Card URL:** `https://reply-raiders-s.vercel.app/.well-known/agent-card.json`
- **Agent API Endpoint:** `https://reply-raiders-s.vercel.app/api/agent`

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
