//app.js
// 全局混入
import './modules/globalMixins'
// 请求拦截器
import './modules/interceptors'

import globalData from './modules/app.ext/app.config.data'
import { Eapp } from 'enhance-wxapp'

Eapp({
  onLaunch() {},
  globalData
})
