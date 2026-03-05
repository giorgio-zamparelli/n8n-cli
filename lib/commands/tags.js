import { Command } from 'commander'
import { get, post, patch, del } from '../client.js'
import { output } from '../output.js'

export function tagsCommand() {
  const cmd = new Command('tags').description('Manage tags')

  cmd
    .command('list')
    .description('List tags')
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

      const result = await get('/tags', query)
      output(result)
    })

  cmd
    .command('get <id>')
    .description('Get a tag by ID')
    .action(async (id) => {
      const result = await get(`/tags/${id}`)
      output(result)
    })

  cmd
    .command('create')
    .description('Create a tag')
    .requiredOption('--name <name>', 'Tag name')
    .action(async (options) => {
      const result = await post('/tags', { name: options.name })
      output(result)
    })

  cmd
    .command('update <id>')
    .description('Update a tag')
    .requiredOption('--name <name>', 'New tag name')
    .action(async (id, options) => {
      const result = await patch(`/tags/${id}`, { name: options.name })
      output(result)
    })

  cmd
    .command('delete <id>')
    .description('Delete a tag')
    .action(async (id) => {
      await del(`/tags/${id}`)
      output({ success: true, id })
    })

  return cmd
}
