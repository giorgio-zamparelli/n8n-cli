import { loadConfig } from './config.js'
import { outputError } from './output.js'

let config

function getConfig() {
  if (!config) {
    config = loadConfig()
  }

  return config
}

export async function request(method, path, { body, query } = {}) {
  const { apiKey, baseUrl } = getConfig()

  const url = new URL(`/api/v1${path}`, baseUrl)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const headers = {
    'X-N8N-API-KEY': apiKey,
    Accept: 'application/json',
  }

  const options = { method, headers }

  if (body) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(url, options)
  } catch (error) {
    outputError(`Request failed: ${error.message}`)
    process.exit(1)
  }

  if (!response.ok) {
    let errorBody

    try {
      errorBody = await response.json()
    } catch {
      errorBody = { message: await response.text() }
    }

    outputError(
      errorBody.message || `HTTP ${response.status} ${response.statusText}`,
      { status: response.status, ...errorBody },
    )
    process.exit(1)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function get(path, query) {
  return request('GET', path, { query })
}

export function post(path, body) {
  return request('POST', path, { body })
}

export function put(path, body) {
  return request('PUT', path, { body })
}

export function patch(path, body) {
  return request('PATCH', path, { body })
}

export function del(path) {
  return request('DELETE', path)
}
