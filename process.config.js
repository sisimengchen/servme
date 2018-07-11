module.exports = {
  apps: [
    {
      name: 'feserver',
      script: './bin/startup.js',
      exec_mode: 'cluster',
      watch: true,
      ignore_watch: ['node_modules', 'views', 'release', 'tmp'],
      env: {
        NODE_ENV: 'development'
      },
      env_test: {
        NODE_ENV: 'test'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
