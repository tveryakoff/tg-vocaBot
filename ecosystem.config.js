console.log(`Starting deployment with following environment variables:\n${process?.env}`)

module.exports = {
  apps: [
    {
      name: 'tgBot',
      script: 'dotenv -e ~/workspace/big-dict-new/.env && npm run start',
      env: {
        NODE_ENV: process?.env?.NODE_ENV,
        DB_CONNECTION_URI: process?.env?.DB_CONNECTION_URI,
        DB_NAME: process?.env?.DB_NAME,
        API_KEY_BOT: process?.env?.API_KEY_BOT,
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '185.247.18.75',
      key: '~/.ssh/tveryakoff',
      ref: 'origin/main',
      repo: 'git@bitbucket.org:tveryakov-projects/big-dict-mono.git',
      path: '~/workspace/big-dict-new/',
      'post-deploy': 'npm i dotenv-cli -g && npm ci --include=dev && npm run build',
    },
  },
}
