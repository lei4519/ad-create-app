/* eslint-disable @typescript-eslint/no-var-requires */
const { sh, runShellThenCommitGit } = require('commit-git')
const { deploy } = require('leju-deploy-tools')
const config = require('./vue.config.js')
const isBCH = process.argv[2] === 'test'
;(async () => {
  await runShellThenCommitGit(
    [
      () =>
        sh(
          `npx cross-env ${isBCH ? 'BUILD_MODE=bch' : ''} vue-cli-service build`
        )
    ],
    {
      isBCH: true,
      outputDir: config.outputDir,
      targetGitDirName: 'adjs.leju.com'
    }
  )
  isBCH &&
    (await deploy({
      target:
        'http://deploy.leju.com:8008/showdeployfiles/?p=adjs.bch.leju.com&e=dev_test',
      filterPath: 'h5/vue/fxzy2020'
    }))
})()
