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
