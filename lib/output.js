let prettyMode = false

export function setPretty(value) {
  prettyMode = value
}

export function output(data) {
  const text = prettyMode ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  process.stdout.write(text + '\n')
}

export function outputError(message, details) {
  const error = { error: message, ...details }
  process.stderr.write(JSON.stringify(error, null, 2) + '\n')
}
