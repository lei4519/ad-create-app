const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
  chainWebpack(config) {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        // 修改它的选项...
        Object.assign(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: 'es2015',
          },
        })
        return options
      })
  },
}
