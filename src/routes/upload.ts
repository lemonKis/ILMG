import md5 from 'md5'
import Router, { METHOD, Context } from '../core/router'
import { success } from '../core/data'
import { getEncryptObj, getEncryptStr } from '../core/cipher'
import config from '../config'
import { saveFileToTarget } from '../core/dir'
import { imgTypeCheck } from '../core/gm'

/**
 * 图片上传路由
 */
const r = new Router()

// 文件上传body
interface UploadBody {
  timestamp: string
  nonceStr: string
  secret: string
}

// 文件上传files
interface UploadFiles {
  file: {
    path: string
  }
}

/**
 * 上传图片
 */
r.use(
  '/upload/img',
  METHOD.POST,
  async (ctx: Context) => {
    const body = ctx.body as UploadBody
    const files = ctx.files as UploadFiles
    // 1、验证参数是否都存在
    if (!(body.timestamp && body.nonceStr && body.secret && files.file))
      throw '请求参数异常'

    // 2、验证时间是否满足要求，1分钟内可上传
    const timestamp = Number(body.timestamp)
    if (isNaN(timestamp) || Date.now() - timestamp > 120000) throw '验证过期'

    // 3、验证加密信息是否正确
    const secret = getEncryptStr(body.nonceStr, timestamp)
    if (body.secret !== secret) throw '授权异常'

    // 4、验证file类型是否合法
    const { buffer, ext } = imgTypeCheck(files.file.path)

    // 5、保存原图片，返回图片路径
    const hash = md5(buffer)
    const fileName = `${hash.substr(0, 12)}.${ext}`
    const dt = new Date()
    const y = dt.getFullYear()
    const m = dt.getMonth() + 1
    const d = dt.getDate()
    const folder = `/${y}-${m > 10 ? m : '0' + m}/d${d > 10 ? d : '0' + d}/`
    try {
      const fullFloder = `${config.filePath}${config.originImgDir}${folder}`
      saveFileToTarget(files.file, fullFloder, fileName)
    } catch (e) {
      console.log(e)
      throw '文件写入异常'
    }
    ctx.response({ status: 200, data: success(`${folder}${fileName}`) })
  },
  { timeout: 30000 }
)

/**
 * 获取上传图片的secret
 */
r.use('/upload/secret', METHOD.GET, async (ctx: Context) => {
  if (!ctx.headers.host || !~config.whiteHosts.indexOf(ctx.headers.host)) {
    throw '非法域名'
  }
  // host白名单中才允许获取secret
  const res = getEncryptObj()
  ctx.response({ status: 200, data: success(res) })
})

export default r
