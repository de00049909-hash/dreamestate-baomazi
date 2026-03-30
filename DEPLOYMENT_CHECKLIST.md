# 🚀 部署檢查清單

## 部署前準備

- [ ] 確認伺服器已安裝 Node.js 22+
- [ ] 確認已安裝 pnpm
- [ ] 確認已安裝 Nginx
- [ ] 確認已安裝 MySQL 8.0+
- [ ] 確認已安裝 Certbot
- [ ] 確認域名已指向伺服器 IP
- [ ] 確認防火牆已開放 80 和 443 端口

## 部署步驟

### 1. 系統準備
- [ ] 更新系統: `sudo apt-get update && sudo apt-get upgrade -y`
- [ ] 創建應用目錄: `sudo mkdir -p /var/www/dreamestate-baomazi`
- [ ] 創建日誌目錄: `sudo mkdir -p /var/log/dreamestate-baomazi`
- [ ] 設置目錄權限

### 2. 代碼部署
- [ ] 克隆或上傳代碼到 `/var/www/dreamestate-baomazi`
- [ ] 驗證代碼完整性
- [ ] 檢查 `.env.production` 配置

### 3. 依賴安裝
- [ ] 運行 `pnpm install --frozen-lockfile`
- [ ] 運行 `pnpm build`
- [ ] 驗證構建成功

### 4. 資料庫配置
- [ ] 創建 MySQL 資料庫
- [ ] 創建資料庫用戶
- [ ] 運行 `pnpm db:push` 進行遷移
- [ ] 驗證資料庫連接

### 5. Nginx 配置
- [ ] 複製 `nginx-vhost.conf` 到 `/etc/nginx/sites-available/`
- [ ] 啟用站點配置
- [ ] 測試 Nginx 配置: `sudo nginx -t`
- [ ] 重啟 Nginx: `sudo systemctl restart nginx`

### 6. SSL 證書
- [ ] 運行 Certbot: `sudo certbot certonly --nginx -d your-domain.com`
- [ ] 驗證證書生成成功
- [ ] 設置自動續期

### 7. Systemd 服務
- [ ] 複製 `dreamestate-baomazi.service` 到 `/etc/systemd/system/`
- [ ] 重新加載 systemd: `sudo systemctl daemon-reload`
- [ ] 啟用服務: `sudo systemctl enable dreamestate-baomazi.service`
- [ ] 啟動服務: `sudo systemctl start dreamestate-baomazi.service`

### 8. 驗證部署
- [ ] 檢查應用服務狀態: `sudo systemctl status dreamestate-baomazi.service`
- [ ] 檢查本地連接: `curl http://localhost:3000`
- [ ] 檢查 HTTPS: `curl -k https://localhost`
- [ ] 檢查域名訪問: `curl https://your-domain.com`

## 部署後配置

### 監控和日誌
- [ ] 配置日誌輪轉
- [ ] 設置監控告警
- [ ] 配置備份策略

### 性能優化
- [ ] 啟用 Gzip 壓縮
- [ ] 配置靜態資源快取
- [ ] 優化資料庫查詢

### 安全加固
- [ ] 配置防火牆規則
- [ ] 設置 fail2ban
- [ ] 配置 DDoS 防護

## 常見問題

### 應用無法啟動
```bash
sudo journalctl -u dreamestate-baomazi.service -n 50
```

### 資料庫連接失敗
```bash
mysql -u dreamestate_user -p -h localhost dreamestate_db
```

### Nginx 配置錯誤
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## 回滾計畫

如部署失敗，執行以下步驟：

1. 停止應用: `sudo systemctl stop dreamestate-baomazi.service`
2. 恢復代碼: `git revert <commit-hash>`
3. 重新構建: `pnpm build`
4. 啟動應用: `sudo systemctl start dreamestate-baomazi.service`

## 聯繫支援

如需幫助，請提供以下信息：

- 伺服器操作系統和版本
- 錯誤日誌內容
- 部署命令和輸出
- 系統資源使用情況

---

**部署日期**: _______________  
**部署人員**: _______________  
**驗證人員**: _______________
