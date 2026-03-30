# 夢想不動產報馬仔 - 永久部署指南

本文檔提供了將應用部署到永久伺服器的完整指南。

## 目錄

1. [前置要求](#前置要求)
2. [本地開發部署](#本地開發部署)
3. [雲端部署](#雲端部署)
4. [配置 HTTPS](#配置-https)
5. [資料庫設置](#資料庫設置)
6. [監控和維護](#監控和維護)

## 前置要求

- Docker 和 Docker Compose
- Node.js 22+
- MySQL 8.0+
- SSL 證書（用於 HTTPS）
- 域名或子域名

## 本地開發部署

### 使用 Docker Compose 啟動完整棧

```bash
# 1. 進入項目目錄
cd /home/ubuntu/dreamestate_line_strategy

# 2. 構建並啟動所有服務
docker-compose up -d

# 3. 檢查服務狀態
docker-compose ps

# 4. 查看日誌
docker-compose logs -f app

# 5. 停止服務
docker-compose down
```

### 服務訪問

- **應用**: http://localhost:3000
- **Nginx 代理**: http://localhost (HTTP) / https://localhost (HTTPS)
- **資料庫**: localhost:3306

## 雲端部署

### 選項 1: Google Cloud Run

```bash
# 1. 構建 Docker 鏡像
docker build -t gcr.io/YOUR_PROJECT_ID/dreamestate-baomazi .

# 2. 推送到 Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/dreamestate-baomazi

# 3. 部署到 Cloud Run
gcloud run deploy dreamestate-baomazi \
  --image gcr.io/YOUR_PROJECT_ID/dreamestate-baomazi \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=mysql://... \
  --allow-unauthenticated
```

### 選項 2: AWS ECS

```bash
# 1. 推送到 ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag dreamestate-baomazi:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dreamestate-baomazi:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dreamestate-baomazi:latest

# 2. 在 ECS 中創建任務定義和服務
```

### 選項 3: Kubernetes

```bash
# 1. 創建 Kubernetes 部署配置
kubectl apply -f k8s/deployment.yaml

# 2. 創建服務
kubectl apply -f k8s/service.yaml

# 3. 配置 Ingress
kubectl apply -f k8s/ingress.yaml
```

## 配置 HTTPS

### 使用 Let's Encrypt 和 Certbot

```bash
# 1. 安裝 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 2. 生成證書
sudo certbot certonly --standalone -d dreamestate-baomazi.manus.space

# 3. 將證書複製到 ssl 目錄
sudo cp /etc/letsencrypt/live/dreamestate-baomazi.manus.space/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/dreamestate-baomazi.manus.space/privkey.pem ./ssl/key.pem

# 4. 設置自動續期
sudo certbot renew --dry-run
```

### 使用自簽名證書（開發用）

```bash
# 生成自簽名證書
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -nodes -out ssl/cert.pem -keyout ssl/key.pem -days 365
```

## 資料庫設置

### Google Cloud SQL

```bash
# 1. 創建 Cloud SQL 實例
gcloud sql instances create dreamestate-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1

# 2. 創建資料庫
gcloud sql databases create dreamestate_db --instance=dreamestate-db

# 3. 創建用戶
gcloud sql users create dreamestate_user \
  --instance=dreamestate-db \
  --password=your_secure_password

# 4. 獲取連接字符串
gcloud sql instances describe dreamestate-db --format='value(connectionName)'
```

### AWS RDS

```bash
# 1. 使用 AWS 控制台或 CLI 創建 RDS 實例
aws rds create-db-instance \
  --db-instance-identifier dreamestate-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password your_secure_password

# 2. 創建資料庫和用戶
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p
CREATE DATABASE dreamestate_db;
CREATE USER 'dreamestate_user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON dreamestate_db.* TO 'dreamestate_user'@'%';
```

### 初始化資料庫架構

```bash
# 使用 Drizzle ORM 遷移
pnpm db:push
```

## 環境變數配置

編輯 `.env.production` 文件：

```env
# 必需
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@host:3306/database
OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space

# AWS S3（可選）
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=dreamestate-baomazi

# 應用配置
APP_NAME=夢想不動產報馬仔
APP_URL=https://dreamestate-baomazi.manus.space
```

## 監控和維護

### 日誌管理

```bash
# 查看應用日誌
docker-compose logs -f app

# 查看 Nginx 日誌
docker-compose logs -f nginx

# 查看資料庫日誌
docker-compose logs -f db
```

### 性能監控

- 使用 Google Cloud Monitoring 或 AWS CloudWatch
- 配置警報以監控 CPU、記憶體和磁盤使用情況
- 設置日誌聚合（ELK Stack、Datadog 等）

### 備份策略

```bash
# 定期備份資料庫
docker-compose exec db mysqldump -u root -p dreamestate_db > backup.sql

# 恢復備份
docker-compose exec -T db mysql -u root -p dreamestate_db < backup.sql
```

### 更新和升級

```bash
# 1. 拉取最新代碼
git pull origin main

# 2. 重新構建鏡像
docker-compose build --no-cache

# 3. 重新啟動服務
docker-compose up -d

# 4. 驗證部署
curl https://dreamestate-baomazi.manus.space
```

## 故障排除

### 應用無法啟動

```bash
# 檢查環境變數
docker-compose config

# 檢查日誌
docker-compose logs app

# 檢查資料庫連接
docker-compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### 資料庫連接失敗

```bash
# 驗證資料庫服務
docker-compose ps db

# 測試連接
docker-compose exec db mysql -u root -p -e "SELECT 1"
```

### HTTPS 證書問題

```bash
# 檢查證書有效期
openssl x509 -in ssl/cert.pem -text -noout

# 更新證書
sudo certbot renew --force-renewal
```

## 支援和資源

- [Docker 文檔](https://docs.docker.com/)
- [Nginx 文檔](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Google Cloud SQL](https://cloud.google.com/sql/docs)
- [AWS RDS](https://docs.aws.amazon.com/rds/)

---

**最後更新**: 2026 年 3 月 23 日
