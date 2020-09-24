import { config } from "../config"
import { isDirExists } from "../utils"

const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')

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
        console.log('templateName', templateName)
      })
  }
  function checkDir () {
    const projectPath = path.resolve(projectName)
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
          return mkProject(path.resolve(answer.name), templateName)
        })
    } else {
      return mkProject(projectPath, templateName)
    }
  }
  function mkProject(projectPath: string, templateName: string) {


  }
}

