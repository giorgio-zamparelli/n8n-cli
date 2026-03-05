# n8n-cli

CLI wrapper for the [n8n REST API](https://docs.n8n.io/api/). Designed for agent-friendly automation with JSON output to stdout.

## Installation

```bash
git clone https://github.com/waiter-io/n8n-cli.git
cd n8n-cli
npm install
npm link
```

## Configuration

### Getting an API Key

1. Open your n8n instance and go to **Settings** → **n8n API** (or navigate to `/settings/api`)
2. Click **Create an API key**
3. Give it a label and click **Save**
4. Copy the generated key

### Setting the API Key

Store your API key via one of (in priority order):

1. Environment variable: `export N8N_API_KEY=your-key`
2. `.env` file in current directory
3. `~/.n8n-cli/.env`

Optionally set a custom base URL (defaults to `https://n8n.waiterio.com`):

```
N8N_BASE_URL=https://your-n8n-instance.com
```

## Usage

```bash
n8n-cli [--pretty] [--version] [--help] <command> <subcommand> [options]
```

All commands output JSON to stdout. Use `--pretty` for human-readable formatting.
Errors are written to stderr as JSON with a non-zero exit code.

### Workflows

```bash
n8n-cli workflows list [--active true|false] [--tags t1,t2] [--name search] [--limit N] [--cursor C]
n8n-cli workflows get <id>
n8n-cli workflows create --file <path> | --json <json> | stdin
n8n-cli workflows update <id> --file <path> | --json <json> | stdin
n8n-cli workflows delete <id>
n8n-cli workflows activate <id>
n8n-cli workflows deactivate <id>
n8n-cli workflows tags <id>
n8n-cli workflows update-tags <id> --tags <tagId1,tagId2>
```

### Executions

```bash
n8n-cli executions list [--status running|success|error|waiting] [--workflow-id id] [--limit N] [--cursor C]
n8n-cli executions get <id> [--include-data]
n8n-cli executions delete <id>
```

### Credentials

```bash
n8n-cli credentials list [--limit N] [--cursor C]
n8n-cli credentials create --type <type> --name <name> --data <json>
n8n-cli credentials update <id> [--name name] [--data json]
n8n-cli credentials delete <id>
n8n-cli credentials schema <typeName>
```

### Tags

```bash
n8n-cli tags list [--limit N] [--cursor C]
n8n-cli tags get <id>
n8n-cli tags create --name <name>
n8n-cli tags update <id> --name <name>
n8n-cli tags delete <id>
```

### Variables

```bash
n8n-cli variables list [--limit N] [--cursor C]
n8n-cli variables create --key <key> --value <value>
n8n-cli variables delete <id>
```

### Users

```bash
n8n-cli users list [--limit N] [--cursor C]
n8n-cli users get <id>
```

### Audit

```bash
n8n-cli audit generate [--categories credentials,database,filesystem,instance,nodes]
```

### Source Control

```bash
n8n-cli source-control pull
```

## Input Methods

For `create` and `update` commands that accept JSON bodies:

```bash
# From file
n8n-cli workflows create --file workflow.json

# From inline JSON
n8n-cli workflows create --json '{"name":"My Workflow","nodes":[],"connections":{}}'

# From stdin
cat workflow.json | n8n-cli workflows create
```

## Examples

```bash
# List all active workflows
n8n-cli workflows list --active true --pretty

# Get a specific workflow
n8n-cli workflows get 5 --pretty

# List failed executions for a workflow
n8n-cli executions list --workflow-id 5 --status error

# Create a tag
n8n-cli tags create --name "production"

# Activate a workflow
n8n-cli workflows activate 5
```
