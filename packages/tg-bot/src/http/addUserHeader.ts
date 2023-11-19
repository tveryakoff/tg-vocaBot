import { Context } from 'grammy'

export const addUserHeader = (axiosInstance: any, user: Context['from']) => {
  const userString = JSON.stringify({
    id: user?.id,
    userName: user?.username,
    firstName: user?.first_name,
    lastName: user?.last_name,
    languageCode: user?.language_code,
  })
  return axiosInstance.interceptors.request.use(function (config: any) {
    config.headers = {
      ...config.headers,
      user: userString,
    }
    return config
  })
}
