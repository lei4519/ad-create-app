const autoprefixer = require('autoprefixer')
const pxToViewport = require('postcss-px-to-viewport')
module.exports = {
  plugins: [
    autoprefixer(),
    pxToViewport({
      unitToConvert: 'px',
      viewportWidth: 375,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      replace: true,
    })
  ],
}
