import { readFileSync } from 'node:fs'

export function readInput(options) {
  if (options.json) {
    try {
      return JSON.parse(options.json)
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`)
    }
  }

  if (options.file) {
    try {
      const content = readFileSync(options.file, 'utf-8')

      return JSON.parse(content)
    } catch (error) {
      throw new Error(`Failed to read file ${options.file}: ${error.message}`)
    }
  }

  if (!process.stdin.isTTY) {
    const chunks = []
    const fd = 0
    const buf = Buffer.alloc(1024)
    let bytesRead

    try {
      while ((bytesRead = readFileSync(fd, buf)) > 0) {
        chunks.push(buf.slice(0, bytesRead))
      }
    } catch {
      // end of input
    }

    if (chunks.length > 0) {
      const content = Buffer.concat(chunks).toString('utf-8')

      try {
        return JSON.parse(content)
      } catch (error) {
        throw new Error(`Invalid JSON from stdin: ${error.message}`)
      }
    }
  }

  throw new Error(
    'No input provided. Use --file <path>, --json <string>, or pipe JSON via stdin.',
  )
}
