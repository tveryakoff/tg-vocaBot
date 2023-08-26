## Tg-bot setup
1. Install dependencies from root `monorepo` with `npm i`
2. Create .env files on and `packages/tg-bot`
3. Create variable `API_KEY_BOT` in  `packages/tg-bot/.env`, copy your bot API_KEY into it
4. Create variable `BACKEND_URL` in `packages/tg-bot/.env` with your server url (http://locahost:3000/) for dev
5. Start bot with npm run dev from `packages/tg-bot`

## Backend setup
1. Install dependencies from root `monorepo` with `npm i`
2. Create .env files on and `packages/backend`
3. Set DB_CONNECTION_URI and DB_NAME env variables in `packages/backend/.env', [find them here](https://cloud.mongodb.com/v2/6421c0a81381c46042a951ae#/clusters/connect?clusterId=Cluster0)
4. Add your ip address in white listed ips [here](https://cloud.mongodb.com/v2/6421c0a81381c46042a951ae#/clusters/connect?clusterId=Cluster0)
5. Start backend with `npm run dev` from `packages/backend`

## Tech Stack
1. Backend - [express.js](https://expressjs.com/)
2. Tg-bot - [telegraf](https://telegrafjs.org/#/)
3. DB ODM - [mongoose](https://mongoosejs.com/)

## Proxy local requests via https
1. Setup ngrok on your computer [guide here](https://dashboard.ngrok.com/get-started/setup)
2. Open terminal in the folder with downloaded ngrok and `sudo cp ngrok /usr/local/bin`
3. Expose your local 8000 port to the internet via https  `ngrok http 8000`
