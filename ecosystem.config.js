module.exports = {
  apps: [
    {
      name: 'dreamestate-baomazi',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        OAUTH_SERVER_URL: 'https://dreamestate-baomazi.manus.space'
      },
      error_file: '/var/log/dreamestate/error.log',
      out_file: '/var/log/dreamestate/out.log',
      log_file: '/var/log/dreamestate/combined.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000,
      shutdown_with_message: true,
      merge_logs: true,
      args: ''
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo/dreamestate-baomazi.git',
      path: '/var/www/dreamestate-baomazi',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production server"'
    }
  }
};
