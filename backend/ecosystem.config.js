module.exports = {
  apps: [{
    name: 'fuseloja',
    script: 'src/index.js',
    cwd: '/opt/fuseloja/current/backend',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      FRONTEND_URL: 'https://fuseloja.com.br'
    },
    error_file: '/opt/fuseloja/logs/error.log',
    out_file: '/opt/fuseloja/logs/out.log',
    log_file: '/opt/fuseloja/logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    // Health check
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    // Advanced options
    listen_timeout: 3000,
    kill_timeout: 5000,
    shutdown_with_message: true,
    wait_ready: true,
    // Environment variables
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      FRONTEND_URL: 'https://fuseloja.com.br',
      PM2_SERVE_PATH: '/opt/fuseloja/current/backend/public',
      PM2_SERVE_PORT: 8080,
      PM2_SERVE_SPA: true,
      PM2_SERVE_HOMEPAGE: '/index.html'
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }],

  // Deploy configuration
  deploy: {
    production: {
      user: 'root',
      host: ['82.25.69.57'],
      ref: 'origin/main',
      repo: 'https://github.com/fernandinhomartins40/fuseloja.git',
      path: '/opt/fuseloja',
      'pre-deploy-local': '',
      'post-deploy': 'cd backend && npm ci --production && cd ../frontend && npm ci && npm run build && cp -r dist ../backend/public && cd ../backend && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /opt/fuseloja/logs'
    }
  }
};