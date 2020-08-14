import md5 from 'md5'
import config from '../config'
import { randomString } from '../utils'

/**
 * 获取加密对象
 */
export const getEncryptObj = () => {
  const now = Date.now()
  const str = randomString()
  const before = `${config.secret}${str}${now}`
  const after = md5(before).toUpperCase()
  return {
    secret: after,
    nonceStr: str,
    timestamp: now,
  }
}

/**
 * 验证加密信息
 * @param nonceStr
 * @param timestamp
 */
export const getEncryptStr = (nonceStr: string, timestamp: number) => {
  const before = `${config.secret}${nonceStr}${timestamp}`
  const after = md5(before).toUpperCase()
  return after
}
