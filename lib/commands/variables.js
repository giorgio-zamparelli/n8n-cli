import { Command } from 'commander'
import { get, post, del } from '../client.js'
import { output } from '../output.js'

export function variablesCommand() {
  const cmd = new Command('variables').description('Manage variables')

  cmd
    .command('list')
    .description('List variables')
    .option('--limit <n>', 'Max results to return')
    .option('--cursor <cursor>', 'Pagination cursor')
    .action(async (options) => {
      const query = {}

      if (options.limit) {
        query.limit = options.limit
      }

      if (options.cursor) {
        query.cursor = options.cursor
      }

      const result = await get('/variables', query)
      output(result)
    })

  cmd
    .command('create')
    .description('Create a variable')
    .requiredOption('--key <key>', 'Variable key')
    .requiredOption('--value <value>', 'Variable value')
    .action(async (options) => {
      const result = await post('/variables', {
        key: options.key,
        value: options.value,
      })
      output(result)
    })

  cmd
    .command('delete <id>')
    .description('Delete a variable')
    .action(async (id) => {
      await del(`/variables/${id}`)
      output({ success: true, id })
    })

  return cmd
}
