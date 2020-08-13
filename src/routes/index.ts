import { IncomingMessage, ServerResponse } from 'http'
import Router from '../core/router'

export default function (req: IncomingMessage, res: ServerResponse): Boolean {
  const { url } = req
  const path = url?.split('?')[0] || ''
  // 根据前缀动态读取路由
  const prefix = path.split('/')[1]
  if (prefix && prefix !== 'index') {
    const instance: Router = require(`./${prefix}`).default
    // 执行对应方法
    return instance.call(path, req, res)
  }
  return false
}
