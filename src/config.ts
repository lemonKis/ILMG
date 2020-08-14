interface Config {
  port: string
  secret: string
  whiteHosts: string[]
  whiteMimes: string[]
  filePath: string
}

const cfg: Config = {
  port: '3011',
  secret: 'xxxxx',
  whiteHosts: ['localhost:3011'],
  whiteMimes: ['image/jpeg'],
  filePath: './files'
}

export default cfg
