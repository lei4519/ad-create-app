const fs = require('fs')
export const isDirExists = (path: string): boolean => {
  try {
    fs.statSync(path)
    return true
  } catch (e) {
    return false
  }
}
