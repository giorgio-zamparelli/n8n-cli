import { Command } from 'commander'
import { post } from '../client.js'
import { output } from '../output.js'

export function auditCommand() {
  const cmd = new Command('audit').description('Security audit')

  cmd
    .command('generate')
    .description('Generate a security audit report')
    .option(
      '--categories <categories>',
      'Comma-separated categories to audit (credentials, database, filesystem, instance, nodes)',
    )
    .action(async (options) => {
      const body = {}

      if (options.categories) {
        body.categories = options.categories.split(',').map((c) => c.trim())
      }

      const result = await post('/audit', body)
      output(result)
    })

  return cmd
}
