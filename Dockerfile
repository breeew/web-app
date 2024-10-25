# 使用官方的 Node.js 镜像作为构建阶段
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app
COPY . .

# 安装依赖项
RUN npm install

# 运行项目的构建命令
RUN npm run build-beta

# 使用 Nginx 作为生产环境的镜像
FROM nginx:alpine

# 复制生成的前端静态文件到 Nginx 默认的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件（可选）
# 如果你有自定义的 nginx.conf 文件，可以复制进来
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露Nginx的80端口
EXPOSE 80

# 启动Nginx服务器
CMD ["nginx", "-g", "daemon off;"]