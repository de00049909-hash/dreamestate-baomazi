#!/bin/bash

# 夢想不動產報馬仔 - 部署腳本
# 用法: ./deploy.sh [production|staging]

set -e

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
ENVIRONMENT=${1:-production}
APP_NAME="dreamestate-baomazi"
APP_PATH="/var/www/$APP_NAME"
APP_USER="www-data"
DOMAIN="dreamestate-baomazi.manus.space"
LOG_DIR="/var/log/$APP_NAME"

# 函數定義
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查前置條件
check_prerequisites() {
    log_info "檢查前置條件..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安裝"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm 未安裝"
        exit 1
    fi
    
    if ! command -v nginx &> /dev/null; then
        log_warn "Nginx 未安裝，請手動安裝"
    fi
    
    log_info "前置條件檢查完成"
}

# 創建目錄結構
setup_directories() {
    log_info "設置目錄結構..."
    
    sudo mkdir -p "$APP_PATH"
    sudo mkdir -p "$LOG_DIR"
    sudo chown -R "$APP_USER:$APP_USER" "$APP_PATH"
    sudo chown -R "$APP_USER:$APP_USER" "$LOG_DIR"
    
    log_info "目錄結構設置完成"
}

# 克隆或更新代碼
update_code() {
    log_info "更新代碼..."
    
    if [ -d "$APP_PATH/.git" ]; then
        cd "$APP_PATH"
        sudo -u "$APP_USER" git pull origin main
    else
        log_error "Git 倉庫未找到，請先克隆代碼"
        exit 1
    fi
    
    log_info "代碼更新完成"
}

# 安裝依賴
install_dependencies() {
    log_info "安裝依賴..."
    
    cd "$APP_PATH"
    sudo -u "$APP_USER" pnpm install --frozen-lockfile
    
    log_info "依賴安裝完成"
}

# 構建應用
build_application() {
    log_info "構建應用..."
    
    cd "$APP_PATH"
    sudo -u "$APP_USER" pnpm build
    
    log_info "應用構建完成"
}

# 配置環境變數
configure_environment() {
    log_info "配置環境變數..."
    
    if [ ! -f "$APP_PATH/.env.production" ]; then
        log_warn ".env.production 不存在，請手動創建"
        log_info "參考 .env.production.example"
    fi
    
    log_info "環境變數配置完成"
}

# 設置 Systemd 服務
setup_systemd_service() {
    log_info "設置 Systemd 服務..."
    
    sudo cp "$APP_PATH/$APP_NAME.service" "/etc/systemd/system/$APP_NAME.service"
    sudo systemctl daemon-reload
    sudo systemctl enable "$APP_NAME.service"
    
    log_info "Systemd 服務設置完成"
}

# 配置 Nginx
configure_nginx() {
    log_info "配置 Nginx..."
    
    sudo cp "$APP_PATH/nginx-vhost.conf" "/etc/nginx/sites-available/$APP_NAME"
    
    if [ ! -L "/etc/nginx/sites-enabled/$APP_NAME" ]; then
        sudo ln -s "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/$APP_NAME"
    fi
    
    # 移除默認站點
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # 測試 Nginx 配置
    sudo nginx -t
    
    log_info "Nginx 配置完成"
}

# 配置 SSL 證書
setup_ssl_certificate() {
    log_info "配置 SSL 證書..."
    
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot 未安裝，請先安裝: sudo apt-get install certbot python3-certbot-nginx"
        return 1
    fi
    
    sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@example.com
    
    log_info "SSL 證書配置完成"
}

# 啟動服務
start_services() {
    log_info "啟動服務..."
    
    sudo systemctl start "$APP_NAME.service"
    sudo systemctl start nginx
    
    # 等待服務啟動
    sleep 2
    
    # 檢查服務狀態
    if sudo systemctl is-active --quiet "$APP_NAME.service"; then
        log_info "應用服務已啟動"
    else
        log_error "應用服務啟動失敗"
        sudo systemctl status "$APP_NAME.service"
        exit 1
    fi
    
    if sudo systemctl is-active --quiet nginx; then
        log_info "Nginx 已啟動"
    else
        log_error "Nginx 啟動失敗"
        sudo systemctl status nginx
        exit 1
    fi
}

# 驗證部署
verify_deployment() {
    log_info "驗證部署..."
    
    # 檢查本地端口
    if curl -s http://localhost:3000 > /dev/null; then
        log_info "應用服務正常運行"
    else
        log_error "應用服務無法訪問"
        exit 1
    fi
    
    # 檢查 HTTPS
    if curl -s -k https://localhost > /dev/null; then
        log_info "HTTPS 配置正常"
    else
        log_warn "HTTPS 配置可能有問題"
    fi
    
    log_info "部署驗證完成"
}

# 顯示部署摘要
show_summary() {
    log_info "部署完成！"
    echo ""
    echo "=========================================="
    echo "部署摘要"
    echo "=========================================="
    echo "應用名稱: $APP_NAME"
    echo "環境: $ENVIRONMENT"
    echo "域名: $DOMAIN"
    echo "應用路徑: $APP_PATH"
    echo "日誌路徑: $LOG_DIR"
    echo ""
    echo "訪問 URL: https://$DOMAIN"
    echo ""
    echo "常用命令:"
    echo "  查看日誌: tail -f $LOG_DIR/out.log"
    echo "  重啟服務: sudo systemctl restart $APP_NAME.service"
    echo "  停止服務: sudo systemctl stop $APP_NAME.service"
    echo "  服務狀態: sudo systemctl status $APP_NAME.service"
    echo "=========================================="
}

# 主函數
main() {
    log_info "開始部署 $APP_NAME ($ENVIRONMENT 環境)..."
    
    check_prerequisites
    setup_directories
    update_code
    install_dependencies
    build_application
    configure_environment
    setup_systemd_service
    configure_nginx
    setup_ssl_certificate
    start_services
    verify_deployment
    show_summary
    
    log_info "部署成功！"
}

# 執行主函數
main "$@"
