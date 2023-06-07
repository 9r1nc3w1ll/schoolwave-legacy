import { method } from "lodash"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'

interface TAuthUser {
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
};

interface TRegisterCredentials {
  access_token: string;
  refresh_token: string;
  user: TAuthUser;
  school?: TSchool;
}

type TSchool = any; // TODO: Refactor to actual school type

type TLoginResponse = {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: TAuthUser;
    school?: TSchool;
  }
}


const BACKEND_LOGIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/login`;

export const authOptions: NextAuthOptions = {
  secret: 'topsecret',
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Username and password",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as any
        const res = await fetch(BACKEND_LOGIN_URL, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        })

        if (!res.ok) {
          throw Error(JSON.stringify({
            message: await res.json(),
            status: res.status,
            statusText: res.statusText,
          }))
        }

        const { data: { user, access_token, refresh_token, school } }: TLoginResponse = await res.json()

        if (!(user && access_token)) {
          return null;
        }

        return {
          ...user,
          ...(school ? { school } : {}),
          name: `${user.first_name} ${user.last_name}`,
          access_token,
          refresh_token,
        }
      }
    }),
    CredentialsProvider({
      id: "register",
      credentials: {},
      async authorize(credentials, req) {
        const { username, first_name, last_name, email, password } = credentials as any;

        const response = await fetch(`${process.env.NEXT_PUBLIC_NEXT_PUBLIC_BACKEND_URL}/school/register-admin`, {
          method: "POST",
          body: JSON.stringify({
            username,
            first_name,
            last_name,
            email,
            password,
          }),
          headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) {
          throw Error(JSON.stringify({
            message: await response.json(),
            status: response.status,
            statusText: response.statusText,
          }))
        }

        const { data: { user, access_token, refresh_token, school } }: TLoginResponse = await response.json();

        if (!user) {
          return null;
        }

        return {
          ...user,
          ...(school ? { school } : {}),
          name: `${user.first_name} ${user.last_name}`,
          access_token,
          refresh_token,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ user, token }) {
      /**
       * [NOTICE]
       * Everything returned from here will be encoded in the JWT
       * - To keep the token size small, expose only the necessary fields
       * - For security reasons, do not return sensitive information eg. passwords
       */
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return {
        /**
         * [SECURITY NOTICE]
         * Only expose NECESSARY and NON-SENSITIVE fields.
         */
        ...session,
        access_token: token.access_token,
        username: token.username,
        first_name: token.first_name,
        last_name: token.last_name,
        email: token.email,
        role: token.role,
        is_active: token.is_active,
        date_joined: token.date_joined,
        created_at: token.created_at,
        updated_at: token.updated_at,
        ...token.school ? {
          school: token.school
        } : {},
   
      };
    }
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)