# 🚀 Quick Deploy Setup Guide

## ⚡ Fast Track - Configure Deploy in 5 Minutes

### Step 1: Configure GitHub Secrets (Required)

Go to: **https://github.com/fernandinhomartins40/fuseloja/settings/secrets/actions**

Click "**New repository secret**" and add these **3 required secrets**:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `123.456.789.012` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_PASSWORD` | SSH password | `your-vps-password` |

### Step 2: Prepare Your VPS (One-time setup)

SSH into your VPS and run:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Create app directory
sudo mkdir -p /opt/fuseloja-fullstack
sudo chown $USER:$USER /opt/fuseloja-fullstack

# Test Docker
docker --version
```

### Step 3: Test Configuration

1. Go to: **https://github.com/fernandinhomartins40/fuseloja/actions**
2. Click "**Test VPS Secrets Configuration**"
3. Click "**Run workflow**"
4. Enable "Test SSH connection to VPS" ✅
5. Click "**Run workflow**"

### Step 4: Deploy!

🎉 **Automatic**: Push any commit to `main` branch
🎮 **Manual**: Go to Actions → "Deploy Fullstack to VPS" → Run workflow

---

## 🔧 Optional Configuration (Recommended)

### Security Secrets (Recommended)
```
JWT_SECRET=your-32-char-random-string
JWT_REFRESH_SECRET=your-other-32-char-random-string
```

Generate random strings:
```bash
openssl rand -base64 32
```

### Email Notifications (Optional)
```
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-app-password
```

### Domain Configuration (Optional)
Go to: **Repository Settings → Secrets and variables → Variables**
```
DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🐛 Troubleshooting

### ❌ "VPS_HOST secret is missing"
- Go to repository secrets and add the missing secrets
- Make sure spelling is exactly: `VPS_HOST`, `VPS_USERNAME`, `VPS_PASSWORD`

### 🔌 SSH Connection Failed
- Verify VPS IP is correct and accessible
- Check if SSH service is running: `sudo systemctl status ssh`
- Ensure port 22 is open, or configure `VPS_PORT` secret

### 🐳 Docker Issues
- Install Docker: `curl -fsSL https://get.docker.com | sh`
- Add user to docker group: `sudo usermod -aG docker $USER`
- Restart SSH session

### 💾 Insufficient Space
- Clean Docker: `docker system prune -a`
- Check space: `df -h`

---

## 📋 Deployment Process

When you deploy, this happens automatically:

1. ✅ **Build** - Frontend and backend are compiled
2. 🔍 **Verify** - Secrets and configuration checked
3. 🔌 **Connect** - SSH connection to your VPS
4. 📥 **Update** - Latest code downloaded
5. 🏗️ **Build** - Docker image created
6. 🚢 **Deploy** - Container started with your app
7. ✅ **Verify** - Health check confirms app is running

**Your app will be available at**: `http://your-vps-ip:3000`

---

## 🆘 Need Help?

1. **Test Secrets**: Run "Test VPS Secrets Configuration" workflow
2. **Check Logs**: Go to Actions tab and check failed workflow logs
3. **Documentation**: See `.github/DEPLOY_SECRETS.md` for detailed guide
4. **SSH Debug**: Add `debug: true` in workflow file for verbose logs

## 🎯 Success Indicators

✅ **Secrets Test Passes**: All required secrets configured
✅ **SSH Test Passes**: Can connect to VPS
✅ **Build Succeeds**: No compilation errors
✅ **Deploy Succeeds**: Container starts and responds to health checks

**Ready to deploy? Push to main branch! 🚀**