import { TSchool } from "./School"

export interface TAuthUser {
  name: string
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  is_active: boolean
  date_joined: string
  created_at: string
  updated_at: string
  access_token?: string
  refresh_token?: string
  school?: TSchool
};