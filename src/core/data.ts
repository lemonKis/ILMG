import { IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http'
import { parseQuery } from '../utils'

export interface ResponseOptions {
  status?: number
  data?: string
  headers?: OutgoingHttpHeaders
}

/**
 * 结果输出函数，外部绑定this给ServerResponse
 */
export function setResponse(this: ServerResponse, options: ResponseOptions) {
  this.writeHead(options.status || 200, options.headers || {})
  this.write(options.data || '')
  this.end()
}

/**
 * 成功通用json返回
 * @param data
 * @param msg
 */
export const success = (data: string | object = '', msg: string = '') => {
  return JSON.stringify({
    code: 1,
    msg,
    data,
  })
}

/**
 * 失败通用json返回
 * @param data
 * @param msg
 */
export const error = (msg: string, code: number = 0) => {
  return JSON.stringify({
    code,
    msg,
    data: null,
  })
}

/**
 * 解析请求的数据成可直接读取的对象
 * @param req
 */
export const parseBody = (req: IncomingMessage, callback: Function) => {
  const { url, headers } = req
  // 根据类型解析其他
  const query = parseQuery(url || '')
  const contentType = headers['content-type'] || ''
  if (~contentType?.indexOf('multipart/form-data')) {
    // form表单提交/文件上传
    const formidable = require('formidable')
    const form = formidable({ multiples: true })
    form.parse(req, (err: any, body: any, files: any) => {
      if (err) {
        console.log(err)
      }
      callback({ body, query, files })
    })
  } else {
    // 解析请求的json
    let body = ''
    req.on('data', (chunk) => {
      // 限制body数据大小
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) req.connection.destroy()
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        body = JSON.parse(body)
      } catch (e) {}
      callback({ body, query })
    })
  }
}
