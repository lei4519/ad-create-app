#! /usr/bin/env node
import program from 'commander'
import create from '../lib/create'

program
  .version('1.0.0')
  .name('ad-create-app')
  .usage('<command> [options]')
  .on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log('create:')
    console.log('  ad-create-app create 项目名称')
  })
program
  .command('*')
  .action(function (name: string) {
    console.log('not found "%s" command', name)
  })
interface Programs {
  list: ProgramsConfig[]
  use: (config: ProgramsConfig) => Programs
  run: () => void
}
interface ProgramsConfig {
  command: string
  alias: string
  description: string
  action: () => any
}

const programs: Programs = {
  list: [],
  use (config) {
    this.list.push(config)
    return this
  },
  run () {
    this.list.forEach(({ command, alias, description, action }) => {
      program
        .command(command)
        .alias(alias)
        .description(description)
        .action(action)
    })
  }
}

programs
  .use({
    command: 'create [projectName]',
    alias: 'c',
    description: '创建项目',
    action: create
  })
  .run()

program.parse(process.argv)
