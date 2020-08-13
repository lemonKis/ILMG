import { IncomingMessage, ServerResponse } from 'http'
import { setResponse, ResponseOptions, parseBody } from '../core/data'

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
    [x: string]: Function
  }
}

// 上下文对象
export interface Context {
  path: string
  headers: object
  query: object
  body: object
  files?: object
  response: (options: ResponseOptions) => void
}

class Router {
  // 路由指向对象
  _mapper: RouterMapper

  // 初始化
  constructor() {
    this._mapper = {}
  }

  // 注册路由
  use(path: string, type: METHOD, func: Function) {
    if (!this._mapper[type]) {
      this._mapper[type] = {}
    }
    this._mapper[type][path] = func
  }

  // 调用
  call(path: string, req: IncomingMessage, res: ServerResponse): Boolean {
    const { headers, method } = req
    if (method) {
      const methodMapper = this._mapper[method]
      if (methodMapper && methodMapper[path]) {
        // 解析请求内容
        parseBody(
          req,
          (data: { query: object; body: object; files?: object }) => {
            // 解析完成调用对应路由方法
            const response = setResponse.bind(res)
            const ctx: Context = {
              path,
              headers,
              query: data.query,
              body: data.body,
              files: data.files,
              response,
            }
            methodMapper[path].call(this, ctx)
          }
        )
        return true
      }
    }
    return false
  }
}

export default Router
