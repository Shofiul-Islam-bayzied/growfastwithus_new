#!/bin/bash

###############################################################################
# GrowFastWithUs VPS Deployment Script
###############################################################################

set -e  # Exit on error

echo "🚀 Starting deployment to VPS..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="growfastwithus"
APP_DIR="/home/shofiul/growfastwithus.com"
BACKUP_DIR="/home/shofiul/backups"

# Step 1: Build locally
echo -e "${YELLOW}📦 Building application locally...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 2: Create backup directory
echo -e "${YELLOW}📁 Preparing backup directory...${NC}"
mkdir -p "${BACKUP_DIR}"

# Step 3: Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf deploy-$(date +%Y%m%d-%H%M%S).tar.gz \
    dist/ \
    package.json \
    package-lock.json \
    ecosystem.config.cjs \
    shared/ \
    --exclude=node_modules \
    --exclude=.env

echo -e "${GREEN}✅ Deployment package created${NC}"
echo ""

# Step 4: Instructions for manual deployment
echo -e "${YELLOW}📋 Manual Deployment Steps:${NC}"
echo ""
echo "1. Upload the .tar.gz file to your VPS:"
echo -e "   ${GREEN}scp deploy-*.tar.gz user@77.237.242.177:${APP_DIR}/${NC}"
echo ""
echo "2. SSH into your VPS:"
echo -e "   ${GREEN}ssh user@77.237.242.177${NC}"
echo ""
echo "3. Extract and deploy:"
echo -e "   ${GREEN}cd ${APP_DIR}${NC}"
echo -e "   ${GREEN}tar -xzf deploy-*.tar.gz${NC}"
echo -e "   ${GREEN}npm ci --only=production${NC}"
echo -e "   ${GREEN}pm2 restart ${APP_NAME}${NC}"
echo ""
echo "4. Check application status:"
echo -e "   ${GREEN}pm2 status${NC}"
echo -e "   ${GREEN}pm2 logs ${APP_NAME}${NC}"
echo ""

# Alternative: Automatic deployment if SSH configured
read -p "Do you want to auto-deploy via SSH? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter SSH host (e.g., user@77.237.242.177): " SSH_HOST
    
    if [ -z "$SSH_HOST" ]; then
        echo -e "${RED}❌ SSH host cannot be empty${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📤 Uploading to VPS...${NC}"
    scp deploy-*.tar.gz "${SSH_HOST}:${APP_DIR}/"
    
    echo -e "${YELLOW}🔧 Deploying on VPS...${NC}"
    ssh "${SSH_HOST}" << EOF
        cd ${APP_DIR}
        
        # Backup current version
        if [ -d "dist" ]; then
            echo "Creating backup..."
            tar -czf ${BACKUP_DIR}/backup-\$(date +%Y%m%d-%H%M%S).tar.gz dist/
        fi
        
        # Extract new version
        echo "Extracting new version..."
        tar -xzf deploy-*.tar.gz
        
        # Install production dependencies
        echo "Installing dependencies..."
        npm ci --only=production --ignore-scripts
        
        # Restart application with PM2
        echo "Restarting application..."
        pm2 restart ${APP_NAME} || pm2 start ecosystem.config.cjs
        
        # Show status
        pm2 status
        
        echo ""
        echo "✅ Deployment completed!"
        echo "Check logs with: pm2 logs ${APP_NAME}"
EOF
    
    echo ""
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    echo "Check your application at: https://growfastwithus.com"
else
    echo ""
    echo -e "${YELLOW}Manual deployment package ready: deploy-*.tar.gz${NC}"
fi

