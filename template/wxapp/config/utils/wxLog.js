let logger
if (wx.getLogManager) {
  logger = wx.getLogManager()
} else {
  console.log('基础库版本低于2.1.0')
  logger = {
    // 兼容
    invalid: true,
    debug: () => {},
    info: () => {},
    log: () => {},
    warn: () => {}
  }
}

export default logger

// LogManager.debug()
// 写 debug 日志

// LogManager.info()
// 写 info 日志

// LogManager.log()
// 写 log 日志

// LogManager.warn()
// 写 warn 日志
