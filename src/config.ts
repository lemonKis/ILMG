interface Config {
  port: string
  secret: string
  whiteHosts: string[]
  whiteMimes: string[]
  filePath: string
  originImgDir: string
  cacheImgDir: string
}

const cfg: Config = {
  port: '3011',
  secret: 'xxxxx',
  whiteHosts: ['localhost:3011'],
  whiteMimes: [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/x-png',
    'image/gif',
    'image/webp',
  ],
  filePath: './files',
  originImgDir: '/imgs',
  cacheImgDir: '/cache',
}

export default cfg
