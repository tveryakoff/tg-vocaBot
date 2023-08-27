export type User = {
  tgIdHash: string
  firstName: string
  lastName: string
  userName: string
}

export type UserRequest = {
  id: string
  first_name?: string
  last_name?: string
  user_name?: string
}
