import { config } from "../config"
import { isDirExists } from "../utils"
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fsExtra from 'fs-extra'
import Handlebars from 'handlebars'

export default async function create (projectName?: string) {
  let templateName: string
  await checkProjectName()
  await chooseTemplate()
  await checkDir()

  function checkProjectName () {
    if (!projectName) {
      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: chalk.green('请输入项目名称'),
            validate: (name: string) => {
              if (!name.trim()) {
                return chalk.red('目录名称不合法, 请重新输入')
              }
              return true
            }
          }
        ])
        .then((answer: any) => {
          projectName = answer.name
        })
    }
    return Promise.resolve()
  }
  function chooseTemplate () {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: chalk.green('请选择模板'),
          choices: config.map((_: any) => _.name)
        }
      ])
      .then((answer: any) => {
        templateName = answer.name
      })
  }
  function checkDir () {
    const projectPath = path.resolve(projectName!)
    if (isDirExists(projectPath)) {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: chalk.green('当前路径下已存在同名目录，请重新输入目录名称'),
            validate: (name: string) => {
              if (!name.trim()) {
                return chalk.red('目录名称不合法, 请重新输入')
              }
              if (isDirExists(path.resolve(name))) {
                return chalk.red('当前路径下已存在同名目录，请重新输入目录名称')
              } else {
                return true
              }
            }
          }
        ])
        .then((answer: any) => {
          projectName = answer.name
          return mkProject(path.resolve(answer.name), templateName)
        })
    } else {
      return mkProject(projectPath, templateName)
    }
  }
  function mkProject(projectPath: string, templateName: string) {
    console.log(chalk.green('⌛️ 项目构建中...\n'))
    const { repo } = config.find(item => item.name === templateName)!
    fsExtra.copySync(path.resolve(__dirname, `../../template/${repo}`), projectPath)
    const content = fsExtra.readFileSync(`${projectPath}/package.json`, 'utf-8')
    fsExtra.writeFileSync(`${projectPath}/package.json`, Handlebars.compile(content)({projectName}))
    console.log(chalk.green('✅ 项目构建完成\n'))
    console.log(chalk.green('执行以下命令以启动项目:\n'))
    console.log(chalk.green(`\t cd ${projectName}\n`))
    console.log(chalk.green(`\t npm install\n`))
    console.log(chalk.green(`\t 微信开发者工具: 工具 - 构建npm\n`))
  }
}
