export const Secret = {
  accessSecret: 'SECRET_ACCESS_KEY',
  refreshSecret: 'SECRET_REFRESH_KEY', 
};

export const Cors = {
  origin: [
      'http://localhost:8080',
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5500',
      'https://podcast-deploy.vercel.app',
  ],
  methods: 'GET,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['X-admin-pass', 'X-hash-pass', 'Library', 'Content-Type', 'Authorization'],
  credentials: true,
};