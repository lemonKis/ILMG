import { createServer } from 'http'
import config from './config'
import runRoutes from './routes'

createServer(function (req, res) {
  // 发送路由到对应控制器
  if (!runRoutes(req, res)) {
    // 没有处理到，就直接返回404了
    res.writeHead(404)
    res.end()
  }
  // res.writeHead(200, {
  //   'content-type': 'text/plain',
  // })
  // res.write('hello nodejs')
  // res.end()
}).listen(config.port)
