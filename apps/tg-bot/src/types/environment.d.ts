export {}

declare global {
  namespace NodeJS {
    interface process {
      env: {
        API_KEY_BOT: number
        BOT_URL: string
        BACKEND_URL: string
      }
    }
  }
}
