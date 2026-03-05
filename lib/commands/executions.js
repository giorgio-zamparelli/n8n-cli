import { Command } from 'commander'
import { get, del } from '../client.js'
import { output } from '../output.js'

export function executionsCommand() {
  const cmd = new Command('executions').description('Manage executions')

  cmd
    .command('list')
    .description('List executions')
    .option(
      '--status <status>',
      'Filter by status (running/success/error/waiting)',
    )
    .option('--workflow-id <id>', 'Filter by workflow ID')
    .option('--limit <n>', 'Max results to return')
    .option('--cursor <cursor>', 'Pagination cursor')
    .action(async (options) => {
      const query = {}

      if (options.status) {
        query.status = options.status
      }

      if (options.workflowId) {
        query.workflowId = options.workflowId
      }

      if (options.limit) {
        query.limit = options.limit
      }

      if (options.cursor) {
        query.cursor = options.cursor
      }

      const result = await get('/executions', query)
      output(result)
    })

  cmd
    .command('get <id>')
    .description('Get an execution by ID')
    .option('--include-data', 'Include execution data')
    .action(async (id, options) => {
      const query = {}

      if (options.includeData) {
        query.includeData = 'true'
      }

      const result = await get(`/executions/${id}`, query)
      output(result)
    })

  cmd
    .command('delete <id>')
    .description('Delete an execution')
    .action(async (id) => {
      await del(`/executions/${id}`)
      output({ success: true, id })
    })

  return cmd
}
