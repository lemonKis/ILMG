import md5 from 'md5'
import fs from 'fs'
import imageType from 'image-type'
import { IncomingMessage, ServerResponse } from 'http'
import config from '../config'
import Router, { METHOD, Context } from '../core/router'
import { imgTypeCheck, imgSize, GmImgSize, imgConvert } from '../core/gm'

/**
 * 图片裁剪路由
 */
const r = new Router()

interface ImgCache {
  url: string
}

r.use(
  '/img/cache',
  METHOD.GET,
  async (ctx: Context, req: IncomingMessage, res: ServerResponse) => {
    const query = ctx.query as ImgCache
    if (!query.url) throw '图片地址参数异常'

    // 1、解析url，获取实际地址以及裁剪参数
    const regArr = /\/\d{4}-\d{2}\/d\d{2}\/(\w{12}).([^_]+)_(\d+)x(\d+)([a-z])_([a-z0-9]{4}).(\w+)/.exec(
      query.url
    )
    if (!regArr) throw '图片获取参数异常'
    // 宽
    let width = Number(regArr[3])
    // 高
    let height = Number(regArr[4])
    // 类型
    const type = regArr[5]
    // 目标扩展名
    const ext = regArr[7]
    if (isNaN(width) || isNaN(height)) throw '图片获取参数错误'

    // 2、拼接md5原始字符串
    const beforeArr = []
    for (let i = 1; i < 8; i++) {
      // 排除掉4位md5
      if (i !== 6) {
        beforeArr.push(regArr[i] || '')
      }
    }
    const before = beforeArr.join('')

    // 3、对比md5的secret是否一致
    const secret = md5(before).substr(0, 4)
    if (secret !== regArr[6]) throw '图片签名错误'

    // 4、查看缓存图片是否存在，存在直接返回
    const cachePath = `${config.filePath}${config.cacheImgDir}${query.url}`
    try {
      if (fs.existsSync(cachePath)) {
        return renderImage(cachePath, res)
      }
    } catch (e) {
      console.log(e)
    }

    // 5、缓存图片不存在，验证原始图片格式是否正确
    const originPath = `${config.filePath}${config.originImgDir}${
      query.url.split('_')[0]
    }`
    const { buffer } = imgTypeCheck(originPath)

    // 6、进行图片转换
    // 原图大小获取
    const osize = (await imgSize(buffer)) as GmImgSize | null
    if (!osize) throw '图片size异常'
    // 图片宽高兼容
    if (width === 0 && height === 0) {
      width = osize.width
      height = osize.height
    } else if (width === 0) {
      width = (height / osize.height) * osize.width
    } else if (height === 0) {
      height = (width / osize.width) * osize.height
    }
    const options = { width, height, type, ext }
    if (!(await imgConvert(buffer, cachePath, options))) throw '图片裁剪错误'

    // 7、读取生成的图片进行渲染
    renderImage(cachePath, res)
  }
)

/**
 * 图片渲染
 * @param path
 */
const renderImage = (path: string, res: ServerResponse) => {
  const buffer = fs.readFileSync(path)
  if (Buffer.isBuffer(buffer)) {
    const t = imageType(buffer)
    if (t) {
      res.writeHead(200, {
        'Content-Type': t.mime,
        Length: Buffer.byteLength(buffer),
      })
      res.write(buffer)
      return res.end()
    }
  }
  throw '图片渲染错误'
}

export default r
