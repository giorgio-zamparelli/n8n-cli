# n8n-cli

CLI wrapper for the n8n REST API at `https://n8n.waiterio.com`.

## Project Overview

- **Repo**: [waiter-io/n8n-cli](https://github.com/waiter-io/n8n-cli)
- **Runtime**: Node.js 18+ (ESM), native `fetch` (no HTTP dependencies)
- **Single dependency**: `commander` for CLI parsing
- **Binary name**: `n8n-cli` (avoids conflict with official `n8n` binary)
- **Output**: JSON to stdout (agent-friendly), `--pretty` flag for humans
- **Errors**: JSON to stderr, non-zero exit code

## Directory Structure

```
n8n-cli/
  bin/
    n8n-cli.js              # Entry point (#!/usr/bin/env node), wires all commands
  lib/
    config.js               # Loads N8N_API_KEY + N8N_BASE_URL from env/.env files
    client.js               # HTTP client (native fetch + X-N8N-API-KEY header + error handling)
    output.js               # JSON/pretty output + error output helpers
    input.js                # Reads input from --file, --json, or stdin
    commands/
      workflows.js          # Workflows CRUD + activate/deactivate/tags
      executions.js         # Executions list/get/delete
      credentials.js        # Credentials CRUD + schema
      tags.js               # Tags CRUD
      variables.js          # Variables list/create/delete
      users.js              # Users list/get (read-only)
      audit.js              # Security audit generation
      source-control.js     # Source control pull
```

## Configuration

Config priority (first found wins):

1. Environment variables: `N8N_API_KEY`, `N8N_BASE_URL`
2. `.env` file in current working directory
3. `~/.n8n-cli/.env`

Base URL defaults to `https://n8n.waiterio.com` if not set.

The `.env` parser is a simple 10-line manual parser (split on first `=`), no dependencies needed.

## Authentication

Uses `X-N8N-API-KEY` header. The API key is a JWT created in the n8n web UI (Settings > API Keys). The current key is stored in `~/.n8n-cli/.env` and is labeled "Claude Code" in n8n.

## Commands

```
n8n-cli [--pretty] <resource> <action> [options]

Resources: workflows, executions, credentials, tags, variables, users, audit, source-control
```

All list commands support `--limit <N>` and `--cursor <C>` for pagination.
Create/update commands accept `--file <path>`, `--json <string>`, or stdin pipe.

## Development

```bash
npm install
npm link        # Makes n8n-cli available globally
n8n-cli --help  # Verify it works
```

No build step needed — pure ESM JavaScript.

## Related

- **n8n instance**: `https://n8n.waiterio.com` (self-hosted on AWS EC2)
- **n8n infrastructure**: `waiterio/n8n/` in the waiterio monorepo (CDK + Docker Compose)
- **n8n SSM CLI**: `waiterio/n8n/cli.js` in the waiterio monorepo (runs n8n CLI commands on EC2 via SSM)
- **Skill file**: `.claude/skills/n8n-cli/SKILL.md` in the waiterio monorepo
