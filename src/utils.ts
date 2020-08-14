import { HttpQuery } from './core/router'

export const parseQuery = (url: string): HttpQuery => {
  const queryStr = url?.split('?')[1] || ''
  const query: HttpQuery = {}
  queryStr.split('&').forEach((item) => {
    const arr = item.split('=')
    query[arr[0]] = arr[1]
  })
  return query
}

export const randomString = (len: number = 8): string => {
  // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
