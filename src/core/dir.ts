import fs from 'fs'

/**
 * 写入文件到指定目录
 * @param file
 * @param absoluteFolder
 * @param fileName
 */
export const saveFileToTarget = (
  file: { path: string },
  absoluteFolder: string,
  fileName: string
) => {
  // 文件如果存在，就不写入了
  const fullLink = `${absoluteFolder}${fileName}`
  if (fs.existsSync(fullLink)) return
  // 循环判断目录是否存在
  const pathArr = absoluteFolder.split('/')
  let _path = ''
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      _path += `${pathArr[i]}/`
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
      }
    }
  }
  // copy文件到指定目录
  fs.copyFileSync(file.path, fullLink)
}
