import { createServer, IncomingMessage, ServerResponse } from 'http'
import config from './config'
import runRoutes from './routes'

createServer(function (req: IncomingMessage, res: ServerResponse) {
  // 发送路由到对应控制器
  if (!runRoutes(req, res)) {
    // 没有处理到，就直接返回404了
    res.writeHead(404)
    res.end()
  }
}).listen(config.port)
