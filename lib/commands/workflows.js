import { Command } from 'commander'
import { get, post, put, patch, del } from '../client.js'
import { output } from '../output.js'
import { readInput } from '../input.js'

export function workflowsCommand() {
  const cmd = new Command('workflows').description('Manage workflows')

  cmd
    .command('list')
    .description('List workflows')
    .option('--active <bool>', 'Filter by active status (true/false)')
    .option('--tags <tags>', 'Filter by tag names (comma-separated)')
    .option('--name <search>', 'Filter by workflow name')
    .option('--limit <n>', 'Max results to return')
    .option('--cursor <cursor>', 'Pagination cursor')
    .action(async (options) => {
      const query = {}

      if (options.active !== undefined) {
        query.active = options.active
      }

      if (options.tags) {
        query.tags = options.tags
      }

      if (options.name) {
        query.name = options.name
      }

      if (options.limit) {
        query.limit = options.limit
      }

      if (options.cursor) {
        query.cursor = options.cursor
      }

      const result = await get('/workflows', query)
      output(result)
    })

  cmd
    .command('get <id>')
    .description('Get a workflow by ID')
    .action(async (id) => {
      const result = await get(`/workflows/${id}`)
      output(result)
    })

  cmd
    .command('create')
    .description('Create a workflow from JSON input')
    .option('--file <path>', 'Read workflow JSON from file')
    .option('--json <json>', 'Workflow JSON string')
    .action(async (options) => {
      const body = readInput(options)
      const result = await post('/workflows', body)
      output(result)
    })

  cmd
    .command('update <id>')
    .description('Update a workflow')
    .option('--file <path>', 'Read workflow JSON from file')
    .option('--json <json>', 'Workflow JSON string')
    .action(async (id, options) => {
      const body = readInput(options)
      const result = await put(`/workflows/${id}`, body)
      output(result)
    })

  cmd
    .command('delete <id>')
    .description('Delete a workflow')
    .action(async (id) => {
      await del(`/workflows/${id}`)
      output({ success: true, id })
    })

  cmd
    .command('activate <id>')
    .description('Activate a workflow')
    .action(async (id) => {
      const result = await patch(`/workflows/${id}`, { active: true })
      output(result)
    })

  cmd
    .command('deactivate <id>')
    .description('Deactivate a workflow')
    .action(async (id) => {
      const result = await patch(`/workflows/${id}`, { active: false })
      output(result)
    })

  cmd
    .command('tags <id>')
    .description('Get tags for a workflow')
    .action(async (id) => {
      const result = await get(`/workflows/${id}/tags`)
      output(result)
    })

  cmd
    .command('update-tags <id>')
    .description('Update tags for a workflow')
    .option('--tags <tagIds>', 'Comma-separated tag IDs')
    .action(async (id, options) => {
      if (!options.tags) {
        throw new Error('--tags is required')
      }

      const tagIds = options.tags.split(',').map((t) => ({ id: t.trim() }))
      const result = await put(`/workflows/${id}/tags`, tagIds)
      output(result)
    })

  return cmd
}
