import "next-auth";
import "next-auth/jwt"

import { TAuthUser } from "@/models";

declare module "next-auth" {
  interface User {
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
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
  }
}