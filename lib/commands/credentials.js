import { Command } from 'commander'
import { get, post, patch, del } from '../client.js'
import { output } from '../output.js'

export function credentialsCommand() {
  const cmd = new Command('credentials').description('Manage credentials')

  cmd
    .command('list')
    .description('List credentials')
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

      const result = await get('/credentials', query)
      output(result)
    })

  cmd
    .command('create')
    .description('Create a credential')
    .requiredOption('--type <type>', 'Credential type name')
    .requiredOption('--name <name>', 'Credential display name')
    .requiredOption('--data <json>', 'Credential data as JSON string')
    .action(async (options) => {
      let data

      try {
        data = JSON.parse(options.data)
      } catch (error) {
        throw new Error(`Invalid JSON in --data: ${error.message}`)
      }

      const result = await post('/credentials', {
        type: options.type,
        name: options.name,
        data,
      })
      output(result)
    })

  cmd
    .command('update <id>')
    .description('Update a credential')
    .option('--name <name>', 'New credential name')
    .option('--data <json>', 'New credential data as JSON string')
    .action(async (id, options) => {
      const body = {}

      if (options.name) {
        body.name = options.name
      }

      if (options.data) {
        try {
          body.data = JSON.parse(options.data)
        } catch (error) {
          throw new Error(`Invalid JSON in --data: ${error.message}`)
        }
      }

      const result = await patch(`/credentials/${id}`, body)
      output(result)
    })

  cmd
    .command('delete <id>')
    .description('Delete a credential')
    .action(async (id) => {
      await del(`/credentials/${id}`)
      output({ success: true, id })
    })

  cmd
    .command('schema <typeName>')
    .description('Get the schema for a credential type')
    .action(async (typeName) => {
      const result = await get(`/credentials/schema/${typeName}`)
      output(result)
    })

  return cmd
}
