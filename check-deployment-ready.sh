#!/bin/bash

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}夢想不動產報馬仔 - 部署準備檢查${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 檢查計數
PASSED=0
FAILED=0
WARNING=0

# 檢查函數
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 存在"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 不存在"
        ((FAILED++))
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 已安裝"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 未安裝"
        ((FAILED++))
    fi
}

check_service() {
    if systemctl is-active --quiet "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 服務運行中"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} $1 服務未運行"
        ((WARNING++))
    fi
}

# 1. 檢查必需文件
echo -e "${BLUE}[1] 檢查必需文件${NC}"
check_file "manus.json"
check_file "package.json"
check_file ".env.production"
check_file "Dockerfile"
check_file "dist/index.js"
echo ""

# 2. 檢查必需工具
echo -e "${BLUE}[2] 檢查必需工具${NC}"
check_command "node"
check_command "pnpm"
check_command "git"
check_command "curl"
echo ""

# 3. 檢查應用配置
echo -e "${BLUE}[3] 檢查應用配置${NC}"
if grep -q '"name": "dreamestate_line_strategy"' package.json; then
    echo -e "${GREEN}✓${NC} package.json 配置正確"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} package.json 配置有誤"
    ((FAILED++))
fi

if grep -q '"NODE_ENV"' .env.production; then
    echo -e "${GREEN}✓${NC} .env.production 配置正確"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env.production 配置有誤"
    ((FAILED++))
fi

if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✓${NC} 應用已構建"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} 應用未構建"
    ((WARNING++))
fi
echo ""

# 4. 檢查 Git 配置
echo -e "${BLUE}[4] 檢查 Git 配置${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git 倉庫已初始化"
    ((PASSED++))
    
    if git remote get-url origin &> /dev/null; then
        REMOTE=$(git remote get-url origin)
        echo -e "${GREEN}✓${NC} Git 遠程倉庫: $REMOTE"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} Git 遠程倉庫未配置"
        ((WARNING++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Git 倉庫未初始化"
    ((WARNING++))
fi
echo ""

# 5. 檢查應用運行
echo -e "${BLUE}[5] 檢查應用運行${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 應用正在運行"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} 應用未運行"
    ((WARNING++))
fi
echo ""

# 6. 檢查部署文檔
echo -e "${BLUE}[6] 檢查部署文檔${NC}"
check_file "MANUS_PERMANENT_DEPLOYMENT.md"
check_file "PERMANENT_DEPLOYMENT_SUMMARY.md"
check_file "DEPLOYMENT_CHECKLIST.md"
echo ""

# 總結
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}檢查結果總結${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ 通過: $PASSED${NC}"
echo -e "${YELLOW}⚠ 警告: $WARNING${NC}"
echo -e "${RED}✗ 失敗: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 所有檢查通過！應用已準備好進行永久部署。${NC}"
    echo ""
    echo -e "${BLUE}後續步驟:${NC}"
    echo "1. 推送代碼到 Git 倉庫"
    echo "2. 登錄 Manus 平台 (https://manus.im)"
    echo "3. 創建新的永久部署"
    echo "4. 按照部署指南完成配置"
    echo ""
    echo -e "${BLUE}快速參考:${NC}"
    echo "- 部署指南: MANUS_PERMANENT_DEPLOYMENT.md"
    echo "- 部署摘要: PERMANENT_DEPLOYMENT_SUMMARY.md"
    echo "- 檢查清單: DEPLOYMENT_CHECKLIST.md"
    exit 0
else
    echo -e "${RED}✗ 檢查失敗。請修復上述問題後重試。${NC}"
    exit 1
fi
