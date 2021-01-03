import fsExtra from 'fs-extra'
import Handlebars from 'handlebars'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { Answer, copyTemplate } from './create'

interface WeappAnswer {
  isOpen3rd?: boolean
}

export default function (answer: Answer & WeappAnswer) {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.green('是第三方小程序吗？'),
      },
    ])
    .then((res: any) => {
      answer.isOpen3rd = res.confirm

      copyTemplate(answer, 'wxapp')
      editProjectName(answer)
      wxappCreated(answer)
    })
}

function wxappCreated(answer: any) {
  // 删除ext.json
  !answer.isOpen3rd && fsExtra.removeSync(`${answer.projectPath}/ext.json`)
  // 编译 app.config.js template/wxapp/config/app.config.js
  const content = fsExtra.readFileSync(
    `${answer.projectPath}/config/app.config.js`,
    'utf-8'
  )
  fsExtra.writeFileSync(
    `${answer.projectPath}/config/app.config.js`,
    Handlebars.compile(content)(answer)
  )
  console.log(chalk.green('✅ 项目构建完成\n'))
  console.log(chalk.green('执行以下命令以启动项目:\n'))
  console.log(chalk.green(`\t cd ${answer.projectName}\n`))
  console.log(chalk.green(`\t npm install\n`))
  console.log(chalk.green(`\t 微信开发者工具: 工具 - 构建npm\n`))
}

function editProjectName(answer: any) {
  // package.json 项目名称
  const packageJson = fsExtra.readFileSync(
    `${answer.projectPath}/package.json`,
    'utf-8'
  )
  fsExtra.writeFileSync(
    `${answer.projectPath}/package.json`,
    Handlebars.compile(packageJson)(answer)
  )
  // project.config.json 项目名称
  const projectConfig = fsExtra.readFileSync(
    `${answer.projectPath}/project.config.json`,
    'utf-8'
  )
  fsExtra.writeFileSync(
    `${answer.projectPath}/project.config.json`,
    Handlebars.compile(projectConfig)(answer)
  )
}
