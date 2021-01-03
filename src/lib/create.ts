import { config } from '../config'
import { isDirExists } from '../utils'
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fsExtra from 'fs-extra'
import Handlebars from 'handlebars'

export interface Answer {
  projectName?: string
  templateName: string
  projectPath: string
}

export default async function create(projectName?: string) {
  const answer: Answer = {
    projectName,
    templateName: '',
    projectPath: '',
  }
  await checkProjectName()
  await checkDir()
  await chooseTemplate()

  function checkProjectName() {
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
            },
          },
        ])
        .then((res: any) => {
          answer.projectName = res.name
        })
    }
    return Promise.resolve()
  }
  function checkDir() {
    const projectPath = (answer.projectPath = path.resolve(answer.projectName!))
    if (isDirExists(projectPath)) {
      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: chalk.green(
              '当前路径下已存在同名目录，请重新输入目录名称'
            ),
            validate: (name: string) => {
              if (!name.trim()) {
                return chalk.red('目录名称不合法, 请重新输入')
              }
              if (isDirExists(path.resolve(name))) {
                return chalk.red('当前路径下已存在同名目录，请重新输入目录名称')
              } else {
                return true
              }
            },
          },
        ])
        .then((res: any) => {
          answer.projectName = res.name
          answer.projectPath = path.resolve(res.name)
        })
    }
  }
  function chooseTemplate() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'name',
          message: chalk.green('请选择模板'),
          choices: config.map((_: any) => _.name),
        },
      ])
      .then((res: any) => {
        answer.templateName = res.name
        const { repo } = config.find(item => item.name === res.name)!
        return require(`./${repo}`).default(answer)
      })
  }
}

export function copyTemplate(answer: any, p: string) {
  const { projectPath } = answer
  console.log(chalk.green('⌛️ 项目构建中...\n'))
  fsExtra.copySync(path.resolve(__dirname, `../../template/${p}`), projectPath)
}

export function compileFile(answer: any, p: string) {
  fsExtra.writeFileSync(
    `${answer.projectPath}/${p}`,
    Handlebars.compile(
      fsExtra.readFileSync(`${answer.projectPath}/${p}`, 'utf-8')
    )(answer)
  )
}
