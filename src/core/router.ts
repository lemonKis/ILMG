import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http'
import { setResponse, ResponseOptions, parseBody } from '../core/data'
import { error } from '../core/data'

// method枚举
export enum METHOD {
  GET = 'GET',
  POST = 'POST',
}

// query对象
export interface HttpQuery {
  [x: string]: string
}

// 路由实现mapper
interface RouterMapper {
  // METHOD
  [x: string]: {
    // PATH
    [x: string]: {
      option: RouterOption
      func: Function
    }
  }
}

// 路由注册可选项
interface RouterOption {
  timeout: number
}

// 上下文对象
export interface Context {
  path: string
  headers: IncomingHttpHeaders
  query: object
  body: object
  files?: object
  response: (options: ResponseOptions) => void
}

class Router {
  // 路由指向对象
  _mapper: RouterMapper
  // 超时处理
  _timer: NodeJS.Timeout | null

  // 初始化
  constructor() {
    this._mapper = {}
    this._timer = null
  }

  // 注册路由
  use(
    path: string,
    type: METHOD,
    func: Function,
    option: RouterOption = { timeout: 10000 }
  ) {
    if (!this._mapper[type]) {
      this._mapper[type] = {}
    }
    // 默认请求超时时间10s
    if (!option.timeout) {
      option.timeout = 10000
    }
    // 映射到路由数据中
    this._mapper[type][path] = {
      func,
      option: option,
    }
  }

  // 调用
  call(path: string, req: IncomingMessage, res: ServerResponse): Boolean {
    const { headers, method } = req
    if (method && this._mapper[method] && this._mapper[method][path]) {
      // 获取到对应请求对象
      const callObj = this._mapper[method][path]
      // 请求超时处理
      this._timer && clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        req.destroy()
      }, callObj.option.timeout)
      // 解析请求内容
      parseBody(
        req,
        (data: { query: object; body: object; files?: object }) => {
          // 解析请求完成调用对应路由方法
          const response = setResponse.bind(res)
          const ctx: Context = {
            path,
            headers,
            query: data.query,
            body: data.body,
            files: data.files,
            response,
          }
          callObj.func.call(this, ctx, req, res).catch((e: any) => {
            // 全局异常捕获
            const errMsg = typeof e === 'string' ? e : '服务器异常'
            response({ status: 200, data: error(errMsg) })
          })
        }
      )
      return true
    }
    return false
  }
}

export default Router
