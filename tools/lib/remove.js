/**
 * remove all commons in str (only start with /* and end with * /)
 * @param {string} str 
 */
export const removeCommons = (str) => {
  let current = str
  for (let commonStartAt = current.indexOf("/*"); current.includes("/*"); commonStartAt = current.indexOf("/*")) {
    const commentEndAt = current.indexOf("*/")
    const beforeCommon = current.substring(0, commonStartAt)

    // 如果找不到对应的 '*/' 则说明后面的全都是注释
    const afterCommon = commentEndAt > 0 ? current.substring(commentEndAt + 2) : ''

    current = beforeCommon + afterCommon
  }
  return current
}

export const removeBlinkLine = str => {
  return str.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}