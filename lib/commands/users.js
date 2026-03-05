import { Command } from 'commander'
import { get } from '../client.js'
import { output } from '../output.js'

export function usersCommand() {
  const cmd = new Command('users').description('Manage users')

  cmd
    .command('list')
    .description('List users')
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

      const result = await get('/users', query)
      output(result)
    })

  cmd
    .command('get <id>')
    .description('Get a user by ID')
    .action(async (id) => {
      const result = await get(`/users/${id}`)
      output(result)
    })

  return cmd
}
