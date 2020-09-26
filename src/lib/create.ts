import { config } from "../config"
import { isDirExists } from "../utils"
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fsExtra from 'fs-extra'
import Handlebars from 'handlebars'

export default async function create (projectName?: string) {
  const answer: any = {
    projectName,
    templateName: '',
    projectPath: ''
  }
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
        .then((res: any) => {
          answer.projectName = res.name
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
      .then((res: any) => {
        answer.templateName = res.name
        if (answer.templateName === '微信小程序') {
          return inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: chalk.green('是第三方小程序吗？'),
            },
          ]).then((res: any) => {
            answer.isOpen3rd = res.confirm
          })
        }
      })
  }
  function checkDir () {
    const projectPath = answer.projectPath = path.resolve(answer.projectName!)
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
        .then((res: any) => {
          answer.projectName = res.name
          answer.projectPath = path.resolve(res.name)
          return mkProject(answer)
        })
    } else {
      return mkProject(answer)
    }
  }
  function mkProject(answer: any) {
    const {projectPath, templateName} = answer
    console.log(chalk.green('⌛️ 项目构建中...\n'))
    const { repo } = config.find(item => item.name === templateName)!
    fsExtra.copySync(path.resolve(__dirname, `../../template/${repo}`), projectPath)
    editProjectName(answer)
    console.log(chalk.green('✅ 项目构建完成\n'))
    if (repo === 'wxapp') {
      wxappCreated(answer)
    }
  }
}

function editProjectName(answer: any) {
  // package.json 项目名称
  const packageJson = fsExtra.readFileSync(`${answer.projectPath}/package.json`, 'utf-8')
  fsExtra.writeFileSync(`${answer.projectPath}/package.json`, Handlebars.compile(packageJson)(answer))
  // project.config.json 项目名称
  const projectConfig = fsExtra.readFileSync(`${answer.projectPath}/project.config.json`, 'utf-8')
  fsExtra.writeFileSync(`${answer.projectPath}/project.config.json`, Handlebars.compile(projectConfig)(answer))
}

function wxappCreated(answer: any) {
  // 删除ext.json
  !answer.isOpen3rd && fsExtra.removeSync(`${answer.projectPath}/ext.json`)
  // 编译 app.config.js template/wxapp/config/app.config.js
  const content = fsExtra.readFileSync(`${answer.projectPath}/config/app.config.js`, 'utf-8')
  fsExtra.writeFileSync(`${answer.projectPath}/config/app.config.js`, Handlebars.compile(content)(answer))

  console.log(chalk.green('执行以下命令以启动项目:\n'))
  console.log(chalk.green(`\t cd ${answer.projectName}\n`))
  console.log(chalk.green(`\t npm install\n`))
  console.log(chalk.green(`\t 微信开发者工具: 工具 - 构建npm\n`))
}