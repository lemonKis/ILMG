import gm from 'gm'
import fs from 'fs'
import imageType from 'image-type'
import config from '../config'
import { makeDirExists } from './dir'

interface ImgCheckData {
  buffer: Buffer
  mime: string
  ext: string
}

/**
 * 通用文件图片类型检查
 * @param path
 */
export const imgTypeCheck = (path: string): ImgCheckData => {
  // 4、验证file类型是否合法
  let typeResult = null
  let fileBuffer = null
  try {
    fileBuffer = fs.readFileSync(path)
    typeResult = imageType(fileBuffer)
  } catch (e) {
    console.log(e)
  }
  if (!fileBuffer) throw '文件错误'
  if (!typeResult || !typeResult.ext) throw '文件内容异常'
  if (!typeResult.mime || !~config.whiteMimes.indexOf(typeResult.mime))
    throw '非法文件MIME类型'
  return { buffer: fileBuffer, mime: typeResult.mime, ext: typeResult.ext }
}

export interface GmImgSize {
  width: number
  height: number
}

/**
 * 获取图片size
 * @param path
 */
export const imgSize = (buffer: Buffer) => {
  return new Promise((resolve) => {
    gm(buffer).size((err: any, value: GmImgSize | null) => {
      if (err) {
        console.log(err)
      }
      resolve(value)
    })
  })
}

/**
 * 缩略方式map
 */
const typeMap: { [x: string]: any } = {
  a: undefined,
  b: '!',
}

/**
 * 图片缩略
 * @param buffer
 * @param folder
 * @param fileName
 * @param options
 */
export const imgConvert = (
  buffer: Buffer,
  target: string,
  options: {
    width: number
    height: number
    type: string
    ext: string
  }
) => {
  return new Promise((resolve) => {
    const arr = target.split('/')
    arr.pop()
    const folder = arr.join('/')
    makeDirExists(folder)

    const converType = typeMap[options.type]
    gm(buffer)
      .resize(options.width, options.height, converType)
      .setFormat(options.ext)
      .strip()
      .write(target, (err) => {
        resolve(!err)
      })
  })
}
