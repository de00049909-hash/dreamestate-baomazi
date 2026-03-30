# 多階段構建 - 構建階段
FROM node:22-alpine AS builder

WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm@10.4.1

# 複製依賴文件
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製源代碼
COPY . .

# 構建應用
RUN pnpm build

# 多階段構建 - 運行階段
FROM node:22-alpine

WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm@10.4.1

# 複製依賴文件
COPY package.json pnpm-lock.yaml ./

# 只安裝生產依賴
RUN pnpm install --frozen-lockfile --prod

# 從構建階段複製構建輸出
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 啟動應用
CMD ["node", "dist/index.js"]
