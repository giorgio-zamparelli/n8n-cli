import { Command } from 'commander'
import { post } from '../client.js'
import { output } from '../output.js'

export function sourceControlCommand() {
  const cmd = new Command('source-control').description(
    'Source control operations',
  )

  cmd
    .command('pull')
    .description('Pull changes from source control')
    .action(async () => {
      const result = await post('/source-control/pull')
      output(result)
    })

  return cmd
}
