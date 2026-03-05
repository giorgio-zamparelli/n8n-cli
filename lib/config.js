import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

function parseEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const vars = {}

    for (const line of content.split('\n')) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const eqIndex = trimmed.indexOf('=')

      if (eqIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      vars[key] = value
    }

    return vars
  } catch {
    return {}
  }
}

export function loadConfig() {
  const homeEnv = parseEnvFile(join(homedir(), '.n8n-cli', '.env'))
  const cwdEnv = parseEnvFile(join(process.cwd(), '.env'))

  const apiKey =
    process.env.N8N_API_KEY || cwdEnv.N8N_API_KEY || homeEnv.N8N_API_KEY
  const baseUrl =
    process.env.N8N_BASE_URL ||
    cwdEnv.N8N_BASE_URL ||
    homeEnv.N8N_BASE_URL ||
    'https://n8n.waiterio.com'

  if (!apiKey) {
    throw new Error(
      'N8N_API_KEY is required. Set it via environment variable, .env in cwd, or ~/.n8n-cli/.env',
    )
  }

  return { apiKey, baseUrl: baseUrl.replace(/\/+$/, '') }
}
