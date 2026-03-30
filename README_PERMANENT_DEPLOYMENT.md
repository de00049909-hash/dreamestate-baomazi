# 🚀 夢想不動產報馬仔 - 永久部署快速開始指南

## 📌 重要信息

**當前臨時網址**: https://3000-i91qsnn97g8v3tmvixk87-7f441dec.sg1.manus.computer/

**目標永久網址**: https://dreamestate-baomazi.manus.space/

---

## ⚡ 3 步快速部署

### 第 1 步：推送代碼到 GitHub (5 分鐘)

```bash
cd /home/ubuntu/dreamestate_line_strategy

# 初始化 Git
git init
git add .
git commit -m "Dream Estate Baomazi - Ready for permanent deployment"

# 添加遠程倉庫（替換 your-username）
git remote add origin https://github.com/your-username/dreamestate-baomazi.git
git branch -M main
git push -u origin main
```

### 第 2 步：登錄 Manus 平台 (2 分鐘)

1. 訪問 https://manus.im
2. 使用您的帳戶登錄
3. 進入控制面板

### 第 3 步：創建永久部署 (10 分鐘)

#### 方式 A：使用 Web 界面（推薦新手）

1. 點擊「新建部署」或「New Deployment」
2. 選擇「Web Application」
3. 填入以下信息：
   ```
   應用名稱: dreamestate-baomazi
   Git 倉庫: https://github.com/your-username/dreamestate-baomazi.git
   分支: main
   構建命令: pnpm install --frozen-lockfile && pnpm build
   啟動命令: node dist/index.js
   端口: 3000
   資料庫: MySQL 8.0
   域名: dreamestate-baomazi.manus.space
   ```
4. 點擊「部署」按鈕
5. 等待 5-10 分鐘部署完成

#### 方式 B：使用 CLI（推薦進階用戶）

```bash
# 安裝 Manus CLI
npm install -g @manus/cli

# 登錄
manus login

# 創建部署
manus deploy create \
  --name dreamestate-baomazi \
  --type web-db-user \
  --git-repo https://github.com/your-username/dreamestate-baomazi.git \
  --build-command "pnpm install --frozen-lockfile && pnpm build" \
  --start-command "node dist/index.js" \
  --port 3000 \
  --database mysql \
  --domain dreamestate-baomazi.manus.space

# 設置環境變數
manus deploy env set NODE_ENV=production
manus deploy env set OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space

# 啟動部署
manus deploy start

# 查看部署進度
manus deploy logs -f
```

---

## ✅ 部署完成後

部署完成後，您將擁有：

- ✅ 永久公開網址：https://dreamestate-baomazi.manus.space/
- ✅ 自動 HTTPS 和證書續期
- ✅ 自動備份（每日）
- ✅ 自動擴展（2-5 實例）
- ✅ 負載均衡
- ✅ 實時監控和告警
- ✅ 24/7 技術支援

---

## 📊 應用配置

### 環境變數
```env
NODE_ENV=production
PORT=3000
OAUTH_SERVER_URL=https://dreamestate-baomazi.manus.space
DATABASE_URL=mysql://...（自動配置）
APP_NAME=夢想不動產報馬仔
APP_DESCRIPTION=專業房產推薦和查詢平台
LOG_LEVEL=info
```

### 資料庫
- **類型**: MySQL 8.0
- **自動備份**: 每日
- **自動恢復**: 支援

### 域名
- **主域名**: dreamestate-baomazi.manus.space
- **HTTPS**: 自動啟用
- **證書**: Let's Encrypt（自動續期）

---

## 🔧 常用命令

```bash
# 查看部署狀態
manus deploy status

# 查看實時日誌
manus deploy logs -f

# 查看應用信息
manus deploy info

# 設置環境變數
manus deploy env set KEY=value

# 查看環境變數
manus deploy env list

# 重新部署
manus deploy redeploy

# 回滾到上一個版本
manus deploy rollback

# 查看資源使用
manus deploy stats

# 查看備份列表
manus database backups list

# 手動備份
manus database backup create

# 恢復備份
manus database restore --backup-id <id>
```

---

## 🆘 常見問題

### Q: 如何更新應用？
```bash
# 1. 更新代碼
git add .
git commit -m "Update: new features"
git push origin main

# 2. 重新部署
manus deploy redeploy

# 3. 查看進度
manus deploy logs -f
```

### Q: 如何回滾版本？
```bash
# 查看部署歷史
manus deploy history

# 回滾到上一個版本
manus deploy rollback

# 或回滾到特定版本
manus deploy rollback --version <version-id>
```

### Q: 如何查看日誌？
```bash
# 實時日誌
manus deploy logs -f

# 查看最後 100 行
manus deploy logs --tail 100

# 查看特定時間範圍
manus deploy logs --since 1h
```

### Q: 如何手動備份資料庫？
```bash
# 創建備份
manus database backup create

# 查看備份列表
manus database backups list

# 恢復備份
manus database restore --backup-id <backup-id>
```

### Q: 如何配置告警通知？
```bash
# 在 Manus 控制面板中：
# 1. 進入部署設置
# 2. 點擊「告警」
# 3. 添加通知方式（郵件、Slack 等）
# 4. 設置告警規則
```

---

## 📞 技術支援

- **文檔**: https://docs.manus.im
- **社區**: https://community.manus.im
- **郵件**: support@manus.im
- **實時聊天**: https://manus.im/support

---

## 📋 部署檢查清單

在部署前，請確認：

- [ ] 代碼已提交到 GitHub
- [ ] Manus 帳戶已登錄
- [ ] Git 倉庫地址正確
- [ ] 構建命令正確
- [ ] 啟動命令正確
- [ ] 端口設置為 3000
- [ ] 資料庫類型為 MySQL 8.0
- [ ] 域名設置正確

部署後，請驗證：

- [ ] 應用可以訪問
- [ ] HTTPS 正常工作
- [ ] 資料庫連接正常
- [ ] 日誌正常輸出
- [ ] 監控告警已配置
- [ ] 備份已啟用

---

## 🎯 部署時間表

| 步驟 | 任務 | 時間 |
|------|------|------|
| 1 | 推送代碼到 GitHub | 5 分鐘 |
| 2 | 登錄 Manus 平台 | 2 分鐘 |
| 3 | 創建永久部署 | 10 分鐘 |
| 4 | 等待部署完成 | 5-10 分鐘 |
| 5 | 驗證網站 | 2 分鐘 |
| **總計** | | **24-29 分鐘** |

---

## 🎁 部署完成後的優化建議

1. **配置監控告警**
   - 設置 CPU/記憶體告警
   - 設置錯誤率告警
   - 配置通知方式

2. **優化性能**
   - 啟用 CDN 加速
   - 配置靜態資源快取
   - 優化資料庫查詢

3. **安全加固**
   - 配置防火牆規則
   - 設置 IP 白名單
   - 啟用 DDoS 防護

4. **備份計劃**
   - 設置每日自動備份
   - 測試備份恢復
   - 配置異地備份

---

## 📊 預期成本（Manus 平台）

| 項目 | 規格 | 月費估計 |
|------|------|---------|
| 應用實例 | 2-5 自動擴展 | $20-50 |
| 資料庫 | MySQL 8.0 | $10-30 |
| 存儲 | 100GB | $5-10 |
| 備份 | 每日自動 | 包含 |
| 帶寬 | 按使用量 | $0.1/GB |
| **總計** | | **$35-90/月** |

*注：Manus 提供免費試用期，實際費用取決於使用量*

---

## 🌟 當前臨時訪問

網站仍可通過以下地址臨時訪問（沙箱運行期間）：

**URL**: https://3000-i91qsnn97g8v3tmvixk87-7f441dec.sg1.manus.computer/

---

## ✨ 成功指標

部署完成後，您應該看到：

- ✅ 永久 URL 可訪問
- ✅ HTTPS 正常工作
- ✅ 資料庫連接正常
- ✅ 應用功能正常
- ✅ 日誌正常輸出
- ✅ 自動備份運行
- ✅ 監控告警配置
- ✅ 性能指標良好

---

## 🎉 恭喜！

您的夢想不動產報馬仔網站已準備好進行永久部署！

**下一步**: 按照上述 3 步快速部署指南進行操作，您的網站將在 30 分鐘內成為真正的永久公開網站。

**需要幫助？** 查看完整文檔或聯繫 Manus 技術支援。

---

**最後更新**: 2026 年 3 月 23 日  
**版本**: 1.0.0  
**狀態**: ✅ 準備就緒
