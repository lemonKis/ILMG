import fs from 'fs'

/**
 * 检测目录，不存在进行创建
 * @param folder
 */
export const makeDirExists = (folder: string) => {
  const pathArr = folder.split('/')
  let _path = ''
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      _path += `${pathArr[i]}/`
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
      }
    }
  }
}

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
  // 目录检测与创建
  makeDirExists(absoluteFolder)
  // copy文件到指定目录
  fs.copyFileSync(file.path, fullLink)
}
