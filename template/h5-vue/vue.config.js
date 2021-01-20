/* eslint-disable @typescript-eslint/no-var-requires */
const tsImportPluginFactory = require('ts-import-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const path = require('path')
const resolve = p => path.resolve(__dirname, p)
const { findTargetDirPath } = require('commit-git')
const adjsPath = findTargetDirPath('adjs.leju.com')
const isDev = process.env.NODE_ENV === 'development'
const isBCH = process.env.BUILD_MODE === 'bch'
const templateFunction = function (data) {
  const { image, total_height, total_width } = data.sprites[0]
  const shared = `.sprite { background-image: url(${image}); background-repeat: no-repeat; background-size: ${
    total_width / 2
  }px ${total_height / 2}px }`

  const perSprite = data.sprites
    .map(function ({ name, width, height, offset_x, offset_y }) {
      return `.sprite-${name} { @extend .sprite; width: ${width / 2}px; height: ${height / 2}px; background-position: ${offset_x / 2}px ${offset_y / 2}px; }`
    })
    .join('\n')

  return shared + '\n' + perSprite
}
module.exports = {
  outputDir: `${adjsPath}/h5/vue/fxzy2020`,
  publicPath: isDev
    ? '/'
    : `https://nres${isBCH ? '.bch' : ''}.leju.com/h5/vue/fxzy2020`,
  filenameHashing: false,
  chainWebpack(config) {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        Object.assign(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })
    config.plugin('spritesmith').use(SpritesmithPlugin, [
      {
        src: {
          cwd: resolve('src/styles/sprites/icon'),
          glob: '*.png'
        },
        target: {
          image: resolve('src/styles/sprites/sprite.png'),
          css: [
            [
              resolve('src/styles/sprites/sprite.scss'),
              {
                format: 'function_based_template'
              }
            ]
          ]
        },
        customTemplates: {
          function_based_template: templateFunction
        },
        apiOptions: {
          cssImageRef: './sprites/sprite.png'
        },
        spritesmithOptions: {
          algorithm: 'binary-tree',
          padding: 20
        }
      }
    ])
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://topic.bch.leju.com',
        pathRewrite: {
          '^/api': '/'
        },
        changeOrigin: true
      }
    }
  }
}
