//app.js
import { Eapp } from 'enhance-weapp'

// 全局混入
import './config/app.mxins'
// 请求拦截器
import './config/app.interceptors'

Eapp({})
