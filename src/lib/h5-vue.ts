import fsExtra from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { Answer, compileFile, copyTemplate } from './create'

interface H5Answer {
  vuex?: boolean
  router?: boolean
}

export default function (answer: Answer & H5Answer) {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.green('是否引入vuex ？'),
      },
    ])
    .then((res: any) => {
      answer.vuex = res.confirm
    })
    .then(() =>
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: chalk.green('是否引入vue-router ？'),
        },
      ])
    )
    .then((res: any) => {
      answer.router = res.confirm
    })
    .then(() => {
      copyTemplate(answer, 'h5-vue')
      compileFile(answer, 'package.json')
      compileFile(answer, 'src/main.ts')
      compileFile(answer, 'src/App.vue')
      !answer.vuex && fsExtra.removeSync(`${answer.projectPath}/src/store`)
      if (!answer.router) {
        fsExtra.removeSync(`${answer.projectPath}/src/router`)
        fsExtra.removeSync(`${answer.projectPath}/src/views`)
      }

      console.log(chalk.green('✅ 项目构建完成\n'))
      console.log(chalk.green('执行以下命令以启动项目:\n'))
      console.log(chalk.green(`\t cd ${answer.projectName}\n`))
      console.log(chalk.green(`\t npm install\n`))
      console.log(chalk.green(`\t npm run dev\n`))
    })
}
