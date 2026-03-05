#!/usr/bin/env node

import { Command } from 'commander'
import { setPretty, outputError } from '../lib/output.js'
import { workflowsCommand } from '../lib/commands/workflows.js'
import { executionsCommand } from '../lib/commands/executions.js'
import { credentialsCommand } from '../lib/commands/credentials.js'
import { tagsCommand } from '../lib/commands/tags.js'
import { variablesCommand } from '../lib/commands/variables.js'
import { usersCommand } from '../lib/commands/users.js'
import { auditCommand } from '../lib/commands/audit.js'
import { sourceControlCommand } from '../lib/commands/source-control.js'

const program = new Command()

program
  .name('n8n-cli')
  .description('CLI wrapper for the n8n REST API')
  .version('1.0.0')
  .option('--pretty', 'Pretty-print JSON output')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.optsWithGlobals()

    if (opts.pretty) {
      setPretty(true)
    }
  })

program.addCommand(workflowsCommand())
program.addCommand(executionsCommand())
program.addCommand(credentialsCommand())
program.addCommand(tagsCommand())
program.addCommand(variablesCommand())
program.addCommand(usersCommand())
program.addCommand(auditCommand())
program.addCommand(sourceControlCommand())

program.parseAsync(process.argv).catch((error) => {
  outputError(error.message)
  process.exit(1)
})
