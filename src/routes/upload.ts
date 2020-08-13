import Router, { METHOD, Context } from '../core/router'
import { success, error } from '../core/data'

const r = new Router()

interface UploadBody {
  time: string
  secret: string
}
interface UploadFiles {
  file: File
}

r.use('/upload/img', METHOD.POST, async (ctx: Context) => {
  const body = ctx.body as UploadBody
  const files = ctx.files as UploadFiles
  if (body.time && body.secret && files.file) {
    // 参数均存在，开始参数验证
    ctx.response({ status: 200, data: success('') })
  } else {
    ctx.response({ status: 200, data: error('验证失败') })
  }
})

export default r
