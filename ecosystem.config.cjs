module.exports = {
  apps: [{
    name: 'growfastwithus',
    script: './dist/index.js',
    cwd: '/home/shofiul/growfastwithus.com',
    env: {
      NODE_ENV: 'production',
      PORT: '5000',
      DATABASE_URL: 'postgresql://growfast:ShoFiul12112002@growfastwithus@localhost:5432/growfastwithus',
      SESSION_SECRET: 'b27de187209f006221206282280e50c6302a7be676092b4f674322f6038009e2',
      JWT_SECRET: '63288569e2ffd45014f74dfae0386309df3ee7c94ecc3ebfbacef522971d46a2',
      COOKIE_SECURE: 'true',
      COOKIE_SAME_SITE: 'strict',
      DOMAIN: 'growfastwithus.com',
      FRONTEND_URL: 'https://growfastwithus.com',
      ALLOWED_ORIGINS: 'https://growfastwithus.com,https://www.growfastwithus.com'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
