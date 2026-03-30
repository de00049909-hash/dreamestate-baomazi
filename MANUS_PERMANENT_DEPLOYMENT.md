# 🌐 Manus 永久部署指南 - 夢想不動產報馬仔

本指南將幫助您將應用從臨時沙箱部署轉換為 Manus 平台上的永久網站。

## 📋 目錄

1. [部署概述](#部署概述)
2. [前置要求](#前置要求)
3. [部署步驟](#部署步驟)
4. [域名配置](#域名配置)
5. [環境配置](#環境配置)
6. [監控和維護](#監控和維護)

---

## 📊 部署概述

### 當前狀態
- **臨時 URL**: https://3000-i91qsnn97g8v3tmvixk87-7f441dec.sg1.manus.computer/
- **狀態**: ✅ 沙箱環境運行中
- **類型**: 臨時部署

### 目標狀態
- **永久 URL**: https://dreamestate-baomazi.manus.space/
- **狀態**: ✅ 永久公開部署
- **類型**: 生產環境

### 部署架構

```
┌─────────────────────────────────────────────┐
│         Manus 永久部署平台                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │    Nginx 反向代理 + HTTPS            │  │
│  │  dreamestate-baomazi.manus.space    │  │
│  └──────────────────────────────────────┘  │
│                    ↓                        │
│  ┌──────────────────────────────────────┐  │
│  │  應用實例 (Node.js + Express)        │  │
│  │  - 自動擴展 (2-5 實例)               │  │
│  │  - 負載均衡                          │  │
│  │  - 健康檢查                          │  │
│  └──────────────────────────────────────┘  │
│                    ↓                        │
│  ┌──────────────────────────────────────┐  │
│  │  MySQL 8.0 資料庫                    │  │
│  │  - 自動備份                          │  │
│  │  - 高可用性                          │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ 前置要求

### 必需項目
- ✅ Manus 帳戶（已有）
- ✅ 應用代碼（已準備）
- ✅ Git 倉庫（可選但推薦）
- ✅ 域名（已分配：dreamestate-baomazi.manus.space）

### 應用要求
- ✅ Node.js 22+ 支援
- ✅ 構建腳本配置
- ✅ 環境變數配置
- ✅ 資料庫遷移腳本

---

## 🚀 部署步驟

### 步驟 1: 準備應用代碼

```bash
# 1. 確保所有配置文件已準備
cd /home/ubuntu/dreamestate_line_strategy

# 2. 驗證 manus.json 配置
cat manus.json

# 3. 驗證 package.json 構建命令
cat package.json | grep -A 5 '"scripts"'

# 4. 驗證 .env.production 配置
cat .env.production
```

### 步驟 2: 提交代碼到 Git

```bash
# 1. 初始化 Git 倉庫（如果還未初始化）
git init
git add .
git commit -m "Initial commit: Dream Estate Baomazi permanent deployment"

# 2. 添加遠程倉庫
git remote add origin https://github.com/your-username/dreamestate-baomazi.git

# 3. 推送代碼
git branch -M main
git push -u origin main
```

### 步驟 3: 在 Manus 平台部署

#### 方式 A: 使用 Manus Web 界面

1. **登錄 Manus 控制台**
   - 訪問 https://manus.im
   - 使用您的帳戶登錄

2. **創建新部署**
   - 點擊「新建部署」或「New Deployment」
   - 選擇「Web Application」

3. **配置部署**
   - **應用名稱**: dreamestate-baomazi
   - **部署類型**: web-db-user
   - **Git 倉庫**: https://github.com/your-username/dreamestate-baomazi.git
   - **分支**: main
   - **構建命令**: `pnpm install --frozen-lockfile && pnpm build`
   - **啟動命令**: `node dist/index.js`
   - **端口**: 3000

4. **配置環境變數**
   - 點擊「環境變數」
   - 添加以下變數：
     ```
     NODE_ENV=production
     PORT=3000
     OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space
     ```

5. **配置資料庫**
   - 選擇「MySQL 8.0」
   - 資料庫名稱: `dreamestate_db`
   - 啟用自動備份

6. **配置域名**
   - 主域名: `dreamestate-baomazi.manus.space`
   - 啟用 HTTPS（自動）
   - 啟用自動續期

7. **部署應用**
   - 點擊「部署」按鈕
   - 等待部署完成（通常 5-10 分鐘）

#### 方式 B: 使用 Manus CLI

```bash
# 1. 安裝 Manus CLI
npm install -g @manus/cli

# 2. 登錄 Manus
manus login

# 3. 創建永久部署
manus deploy create \
  --name dreamestate-baomazi \
  --type web-db-user \
  --git-repo https://github.com/your-username/dreamestate-baomazi.git \
  --build-command "pnpm install --frozen-lockfile && pnpm build" \
  --start-command "node dist/index.js" \
  --port 3000 \
  --database mysql \
  --domain dreamestate-baomazi.manus.space

# 4. 設置環境變數
manus deploy env set NODE_ENV=production
manus deploy env set OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space

# 5. 部署應用
manus deploy start
```

### 步驟 4: 驗證部署

```bash
# 1. 檢查部署狀態
manus deploy status

# 2. 查看部署日誌
manus deploy logs -f

# 3. 測試應用訪問
curl https://dreamestate-baomazi.manus.space/

# 4. 檢查資料庫連接
# 應用應該能成功連接到資料庫
```

---

## 🌐 域名配置

### 主域名
- **域名**: dreamestate-baomazi.manus.space
- **狀態**: ✅ 自動配置
- **HTTPS**: ✅ 自動啟用
- **證書**: Let's Encrypt（自動續期）

### 別名域名（可選）
```
www.dreamestate-baomazi.manus.space
baomazi.manus.space
```

### DNS 配置（如使用自定義域名）
```
A 記錄:
  主機名: dreamestate-baomazi
  值: [Manus 提供的 IP]
  TTL: 3600

CNAME 記錄:
  主機名: www
  值: dreamestate-baomazi.manus.space
  TTL: 3600
```

---

## ⚙️ 環境配置

### 必需環境變數

| 變數名 | 值 | 說明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 運行環境 |
| `PORT` | `3000` | 應用端口 |
| `OAUTH_SERVER_URL` | `https://dreamestate-baomazi.manus.space` | OAuth 伺服器 |
| `DATABASE_URL` | `mysql://...` | 資料庫連接（自動配置） |

### 可選環境變數

```env
# AWS S3 配置
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=dreamestate-baomazi

# 應用配置
APP_NAME=夢想不動產報馬仔
APP_DESCRIPTION=專業房產推薦和查詢平台
LOG_LEVEL=info
```

### 設置環境變數

```bash
# 通過 CLI 設置
manus deploy env set AWS_REGION=us-east-1
manus deploy env set AWS_ACCESS_KEY_ID=your_key
manus deploy env set AWS_SECRET_ACCESS_KEY=your_secret

# 或通過 Web 界面
# 進入部署設置 → 環境變數 → 添加新變數
```

---

## 📊 監控和維護

### 查看部署狀態

```bash
# 實時日誌
manus deploy logs -f

# 查看特定時間範圍的日誌
manus deploy logs --since 1h

# 查看錯誤日誌
manus deploy logs --level error
```

### 性能監控

```bash
# 查看資源使用情況
manus deploy stats

# 查看實例信息
manus deploy instances

# 查看自動擴展狀態
manus deploy autoscale status
```

### 數據庫管理

```bash
# 查看資料庫狀態
manus database status

# 查看備份列表
manus database backups list

# 手動備份
manus database backup create

# 恢復備份
manus database restore --backup-id <id>
```

### 更新應用

```bash
# 1. 更新代碼
git add .
git commit -m "Update: new features"
git push origin main

# 2. 觸發重新部署
manus deploy redeploy

# 3. 查看部署進度
manus deploy logs -f

# 4. 驗證更新
curl https://dreamestate-baomazi.manus.space/
```

### 回滾應用

```bash
# 查看部署歷史
manus deploy history

# 回滾到上一個版本
manus deploy rollback

# 回滾到特定版本
manus deploy rollback --version <version-id>
```

---

## 🔒 安全配置

### HTTPS 設置
- ✅ 自動啟用
- ✅ 自動續期
- ✅ 強制 HTTPS 重定向
- ✅ HSTS 頭部配置

### 防火牆規則
```bash
# 允許特定 IP
manus firewall allow 192.168.1.0/24

# 禁止特定 IP
manus firewall deny 10.0.0.0/8

# 查看防火牆規則
manus firewall list
```

### API 速率限制
```bash
# 配置速率限制
manus deploy config set rate-limit=1000/minute

# 查看當前配置
manus deploy config get rate-limit
```

---

## 📈 性能優化

### 自動擴展配置

```bash
# 設置最小實例數
manus deploy autoscale set --min-instances 2

# 設置最大實例數
manus deploy autoscale set --max-instances 5

# 設置擴展閾值
manus deploy autoscale set --scale-up-threshold 70
manus deploy autoscale set --scale-down-threshold 30
```

### 資源限制

```bash
# 設置 CPU 限制
manus deploy resources set --cpu 1000m

# 設置記憶體限制
manus deploy resources set --memory 1Gi
```

---

## 🆘 故障排除

### 應用無法啟動

```bash
# 1. 查看詳細日誌
manus deploy logs --level debug

# 2. 檢查環境變數
manus deploy env list

# 3. 檢查資料庫連接
# 查看 DATABASE_URL 是否正確配置

# 4. 檢查構建日誌
manus deploy build-logs
```

### 資料庫連接失敗

```bash
# 1. 驗證資料庫狀態
manus database status

# 2. 檢查資料庫用戶權限
manus database users list

# 3. 查看資料庫日誌
manus database logs
```

### 域名無法訪問

```bash
# 1. 檢查 DNS 配置
nslookup dreamestate-baomazi.manus.space

# 2. 檢查 SSL 證書
manus deploy ssl status

# 3. 檢查部署狀態
manus deploy status
```

---

## 📞 支援和幫助

### 常用命令

```bash
# 查看所有命令
manus help

# 查看特定命令幫助
manus deploy help

# 查看部署詳情
manus deploy info

# 查看應用日誌
manus deploy logs -f
```

### 聯繫支援

- 📧 **郵件**: support@manus.im
- 💬 **實時聊天**: https://manus.im/support
- 📖 **文檔**: https://docs.manus.im
- 🐛 **問題報告**: https://github.com/manus/issues

---

## ✨ 部署完成檢查清單

- [ ] Git 倉庫已推送
- [ ] manus.json 配置已驗證
- [ ] 環境變數已配置
- [ ] 資料庫已創建
- [ ] 域名已配置
- [ ] HTTPS 已啟用
- [ ] 部署已完成
- [ ] 應用可以訪問
- [ ] 資料庫連接正常
- [ ] 日誌監控已配置
- [ ] 備份已啟用
- [ ] 自動擴展已配置

---

## 📊 部署信息總結

| 項目 | 詳情 |
|------|------|
| **應用名稱** | dreamestate-baomazi |
| **部署類型** | web-db-user |
| **運行時** | Node.js 22 |
| **主域名** | dreamestate-baomazi.manus.space |
| **資料庫** | MySQL 8.0 |
| **HTTPS** | ✅ 啟用 |
| **自動擴展** | ✅ 啟用 (2-5 實例) |
| **自動備份** | ✅ 啟用 (每日) |
| **監控** | ✅ 啟用 |

---

**部署日期**: 2026 年 3 月 23 日  
**版本**: 1.0.0  
**狀態**: 準備就緒
