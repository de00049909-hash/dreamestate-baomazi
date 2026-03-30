# 🌐 夢想不動產報馬仔 - 永久部署完整指南

## 📋 目錄

1. [快速開始](#快速開始)
2. [系統要求](#系統要求)
3. [部署步驟](#部署步驟)
4. [配置說明](#配置說明)
5. [HTTPS 設置](#https-設置)
6. [資料庫配置](#資料庫配置)
7. [監控和維護](#監控和維護)
8. [故障排除](#故障排除)

---

## 🚀 快速開始

### 一鍵部署（推薦）

```bash
# 1. 克隆或下載項目
cd /var/www
git clone https://github.com/your-repo/dreamestate-baomazi.git
cd dreamestate-baomazi

# 2. 運行部署腳本
sudo ./deploy.sh production

# 3. 訪問網站
# https://dreamestate-baomazi.manus.space
```

---

## 💻 系統要求

### 最低配置
- **操作系統**: Ubuntu 20.04 LTS 或更高版本
- **CPU**: 2 核心
- **記憶體**: 2GB RAM
- **磁盤**: 10GB SSD
- **網絡**: 穩定的互聯網連接

### 推薦配置
- **操作系統**: Ubuntu 22.04 LTS
- **CPU**: 4 核心
- **記憶體**: 4GB RAM
- **磁盤**: 20GB SSD
- **帶寬**: 10Mbps 以上

### 必需軟件
```bash
# 安裝 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 pnpm
npm install -g pnpm@10.4.1

# 安裝 Nginx
sudo apt-get install -y nginx

# 安裝 MySQL 8.0
sudo apt-get install -y mysql-server

# 安裝 Certbot（用於 SSL）
sudo apt-get install -y certbot python3-certbot-nginx

# 安裝其他依賴
sudo apt-get install -y curl wget git build-essential
```

---

## 📦 部署步驟

### 步驟 1: 準備伺服器

```bash
# 更新系統
sudo apt-get update && sudo apt-get upgrade -y

# 創建應用用戶（可選）
sudo useradd -m -s /bin/bash www-data

# 創建應用目錄
sudo mkdir -p /var/www/dreamestate-baomazi
sudo chown -R www-data:www-data /var/www/dreamestate-baomazi

# 創建日誌目錄
sudo mkdir -p /var/log/dreamestate-baomazi
sudo chown -R www-data:www-data /var/log/dreamestate-baomazi
```

### 步驟 2: 克隆代碼

```bash
cd /var/www/dreamestate-baomazi

# 克隆 Git 倉庫
sudo -u www-data git clone https://github.com/your-repo/dreamestate-baomazi.git .

# 或者上傳代碼
# scp -r ./dreamestate-baomazi/* user@server:/var/www/dreamestate-baomazi/
```

### 步驟 3: 安裝依賴

```bash
cd /var/www/dreamestate-baomazi

# 安裝 npm 依賴
sudo -u www-data pnpm install --frozen-lockfile

# 構建應用
sudo -u www-data pnpm build
```

### 步驟 4: 配置環境變數

```bash
# 複製環境配置模板
sudo cp .env.production.example .env.production

# 編輯環境變數
sudo nano .env.production
```

編輯以下關鍵變數：

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/dreamestate_db
OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### 步驟 5: 配置資料庫

```bash
# 登錄 MySQL
mysql -u root -p

# 創建資料庫和用戶
CREATE DATABASE dreamestate_db;
CREATE USER 'dreamestate_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON dreamestate_db.* TO 'dreamestate_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 運行數據庫遷移
cd /var/www/dreamestate-baomazi
pnpm db:push
```

### 步驟 6: 配置 Nginx

```bash
# 複製 Nginx 配置
sudo cp nginx-vhost.conf /etc/nginx/sites-available/dreamestate-baomazi

# 啟用站點
sudo ln -s /etc/nginx/sites-available/dreamestate-baomazi /etc/nginx/sites-enabled/

# 移除默認配置
sudo rm -f /etc/nginx/sites-enabled/default

# 測試配置
sudo nginx -t

# 重啟 Nginx
sudo systemctl restart nginx
```

### 步驟 7: 配置 SSL 證書

```bash
# 使用 Let's Encrypt 生成免費證書
sudo certbot certonly --nginx -d dreamestate-baomazi.manus.space

# 設置自動續期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 驗證續期
sudo certbot renew --dry-run
```

### 步驟 8: 設置 Systemd 服務

```bash
# 複製服務文件
sudo cp dreamestate-baomazi.service /etc/systemd/system/

# 重新加載 systemd
sudo systemctl daemon-reload

# 啟用服務
sudo systemctl enable dreamestate-baomazi.service

# 啟動服務
sudo systemctl start dreamestate-baomazi.service

# 檢查狀態
sudo systemctl status dreamestate-baomazi.service
```

---

## ⚙️ 配置說明

### 環境變數詳解

| 變數 | 說明 | 示例 |
|------|------|------|
| `NODE_ENV` | 運行環境 | `production` |
| `PORT` | 應用端口 | `3000` |
| `DATABASE_URL` | 資料庫連接字符串 | `mysql://user:pass@host:3306/db` |
| `OAUTH_SERVER_URL` | OAuth 伺服器 URL | `https://example.com` |
| `AWS_REGION` | AWS 區域 | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS 訪問密鑰 | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS 秘密密鑰 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_S3_BUCKET` | S3 存儲桶名稱 | `dreamestate-baomazi` |

---

## 🔒 HTTPS 設置

### 自動 HTTPS 配置

部署腳本會自動配置 HTTPS。如果需要手動配置：

```bash
# 1. 安裝 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 2. 生成證書
sudo certbot certonly --standalone -d dreamestate-baomazi.manus.space

# 3. 配置自動續期
sudo certbot renew --dry-run

# 4. 設置 cron 任務
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 驗證 HTTPS

```bash
# 檢查證書有效期
sudo openssl x509 -in /etc/letsencrypt/live/dreamestate-baomazi.manus.space/fullchain.pem -text -noout

# 測試 SSL
curl -I https://dreamestate-baomazi.manus.space

# SSL 評分檢查
# 訪問: https://www.ssllabs.com/ssltest/
```

---

## 🗄️ 資料庫配置

### Google Cloud SQL

```bash
# 1. 創建實例
gcloud sql instances create dreamestate-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro

# 2. 創建資料庫
gcloud sql databases create dreamestate_db --instance=dreamestate-db

# 3. 創建用戶
gcloud sql users create dreamestate_user --instance=dreamestate-db

# 4. 獲取連接字符串
gcloud sql instances describe dreamestate-db --format='value(connectionName)'
```

### AWS RDS

```bash
# 1. 創建實例
aws rds create-db-instance \
  --db-instance-identifier dreamestate-db \
  --db-instance-class db.t3.micro \
  --engine mysql

# 2. 等待實例就緒
aws rds wait db-instance-available --db-instance-identifier dreamestate-db

# 3. 獲取端點
aws rds describe-db-instances --db-instance-identifier dreamestate-db
```

---

## 📊 監控和維護

### 查看日誌

```bash
# 應用日誌
sudo tail -f /var/log/dreamestate-baomazi/out.log

# 錯誤日誌
sudo tail -f /var/log/dreamestate-baomazi/error.log

# Nginx 日誌
sudo tail -f /var/log/nginx/dreamestate-baomazi-access.log

# 系統日誌
sudo journalctl -u dreamestate-baomazi.service -f
```

### 性能監控

```bash
# 檢查進程
ps aux | grep node

# 檢查端口
sudo netstat -tlnp | grep 3000

# 檢查磁盤使用
df -h

# 檢查記憶體使用
free -h

# 檢查 CPU 使用
top
```

### 定期備份

```bash
# 備份資料庫
mysqldump -u dreamestate_user -p dreamestate_db > backup_$(date +%Y%m%d).sql

# 備份應用文件
tar -czf dreamestate_backup_$(date +%Y%m%d).tar.gz /var/www/dreamestate-baomazi

# 上傳到 S3
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### 更新應用

```bash
# 1. 停止應用
sudo systemctl stop dreamestate-baomazi.service

# 2. 拉取最新代碼
cd /var/www/dreamestate-baomazi
sudo -u www-data git pull origin main

# 3. 安裝依賴
sudo -u www-data pnpm install --frozen-lockfile

# 4. 構建應用
sudo -u www-data pnpm build

# 5. 運行遷移（如果需要）
sudo -u www-data pnpm db:push

# 6. 啟動應用
sudo systemctl start dreamestate-baomazi.service

# 7. 檢查狀態
sudo systemctl status dreamestate-baomazi.service
```

---

## 🔧 故障排除

### 應用無法啟動

```bash
# 檢查日誌
sudo journalctl -u dreamestate-baomazi.service -n 50

# 檢查環境變數
sudo -u www-data cat /var/www/dreamestate-baomazi/.env.production

# 檢查端口佔用
sudo lsof -i :3000

# 手動啟動測試
cd /var/www/dreamestate-baomazi
node dist/index.js
```

### 資料庫連接失敗

```bash
# 測試連接
mysql -u dreamestate_user -p -h localhost dreamestate_db

# 檢查 MySQL 狀態
sudo systemctl status mysql

# 檢查防火牆
sudo ufw status

# 允許 MySQL 端口
sudo ufw allow 3306
```

### Nginx 配置錯誤

```bash
# 測試配置
sudo nginx -t

# 查看錯誤
sudo tail -f /var/log/nginx/error.log

# 重新加載配置
sudo systemctl reload nginx
```

### SSL 證書問題

```bash
# 檢查證書狀態
sudo certbot certificates

# 續期證書
sudo certbot renew --force-renewal

# 查看證書詳情
openssl x509 -in /etc/letsencrypt/live/dreamestate-baomazi.manus.space/fullchain.pem -text
```

---

## 📞 支援和幫助

如遇到問題，請檢查以下資源：

- [部署文檔](./DEPLOYMENT.md)
- [Nginx 文檔](https://nginx.org/en/docs/)
- [Node.js 文檔](https://nodejs.org/en/docs/)
- [MySQL 文檔](https://dev.mysql.com/doc/)
- [Let's Encrypt 文檔](https://letsencrypt.org/docs/)

---

**最後更新**: 2026 年 3 月 23 日  
**版本**: 1.0.0
