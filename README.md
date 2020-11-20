# LMG
图片服务器 by TypeScript && NodeJs

## Nginx Conf Template
```
server {
    # 对外端口
    listen       80;
    server_name  img.xxx.com;

    root /home/img/files;

    location ~ /cache/(.*) {
        try_files /cache/$1 /cache?url=/$1;
    }

    location = /cache {
        # 对内服务，生成缩略图
        proxy_pass http://127.0.0.1:3011/img/cache;
    }
    
    location = /secret {
        # 对内服务，获取上传密钥
        proxy_pass http://127.0.0.1:3011/upload/secret;
    }

    location = /upload {
        client_max_body_size 20m;

        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Methods 'POST';
        # add_header Access-Control-Allow-Credentials 'true';
        # add_header Access-Control-Allow-Headers 'User-Agent,X-Requested-With,Content-Type,Authorization';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        # 对内服务，文件上传
        proxy_pass http://127.0.0.1:3011/upload/img;
    }
}
```

## 图片缩略
需安装GraphicsMagick
```
注意使用Current Release版本，不然容易报错
Mac下，GraphicsMagick模块需手动添加webp支持
```
```
yum install gcc gcc-c++ libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libwebp-devel libwebp
```
