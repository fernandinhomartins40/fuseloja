# 🔐 GitHub Secrets Configuration for VPS Deploy

## Required Secrets

Configure these secrets in your GitHub repository:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 🖥️ VPS Connection Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | IP address or domain of your VPS | `123.456.789.012` |
| `VPS_USERNAME` | SSH username (usually root) | `root` |
| `VPS_PASSWORD` | SSH password | `your-secure-password` |
| `VPS_PORT` | SSH port (optional, defaults to 22) | `22` |
| `VPS_SSH_KEY` | SSH private key (alternative to password) | `-----BEGIN OPENSSH PRIVATE KEY-----` |

### 🔑 Application Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | `super-secret-jwt-key-min-32-chars` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `super-secret-refresh-key-min-32-chars` |
| `EMAIL_USER` | Email for sending notifications | `noreply@yourdomain.com` |
| `EMAIL_PASSWORD` | Email password (use App Password for Gmail) | `app-specific-password` |

### 🌐 Environment Variables (optional)

Configure these in **Variables** section:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `DOMAIN` | Your application domain | `fuseloja.com.br` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://fuseloja.com.br,https://www.fuseloja.com.br` |

## 🚀 VPS Requirements

Your VPS must have:
- ✅ Docker installed
- ✅ Git installed
- ✅ SSH access enabled
- ✅ Port 3000 open (or configure different port)
- ✅ At least 1GB RAM recommended
- ✅ Sudo access for the SSH user

## 🔧 VPS Setup Commands

Run these commands on your VPS to prepare it:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Git
sudo apt install git -y

# Create application directory
sudo mkdir -p /opt/fuseloja-fullstack
sudo chown $USER:$USER /opt/fuseloja-fullstack

# Test Docker
docker --version
```

## 🔐 Security Best Practices

### SSH Key Authentication (Recommended)
Instead of using passwords, use SSH keys:

1. Generate SSH key pair on your local machine:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@fuseloja"
   ```

2. Copy public key to VPS:
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-vps-ip
   ```

3. Add private key to GitHub secret `VPS_SSH_KEY`
4. Remove `VPS_PASSWORD` secret

### JWT Secrets
Generate secure random strings:
```bash
# Generate 32-character random string
openssl rand -base64 32
```

## 🐛 Troubleshooting

### Common Issues:

1. **"missing server host"**
   - Ensure `VPS_HOST` secret is configured
   - Check secret name spelling

2. **SSH connection failed**
   - Verify VPS IP/domain is accessible
   - Check SSH port (default 22)
   - Ensure SSH service is running on VPS

3. **Permission denied**
   - Check SSH credentials
   - Ensure user has sudo access
   - Verify SSH key format if using key auth

4. **Docker build failed**
   - Check VPS disk space: `df -h`
   - Verify Docker is installed: `docker --version`
   - Check Docker daemon: `sudo systemctl status docker`

### Debug Mode
Enable debug in the workflow by changing:
```yaml
debug: true  # Change from false to true
```

## 📞 Support

If you need help:
1. Check GitHub Actions logs
2. SSH into VPS and check: `sudo docker logs fuseloja-app`
3. Verify all secrets are configured correctly
4. Ensure VPS meets minimum requirements