import NextAuth, { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { type JWT } from "next-auth/jwt"
import api from "@/helpers/api";
import { TSchool } from "@/models";

type TLoginResponse = {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    school?: TSchool;
  }
}

const dummySchoolData = {
  description: "The best School Ever",
  name: "Alpha Institution",
  motto: "Another one",
  website_url: "https://www.sofascore.com/team/football/kf-fjallabyggdar/70086",
  date_of_establishment: "1996-04-17",
  owner: "f1fffae4-440e-423e-94ad-e0e90f267321",
  tag: "Read",
};
const refreshToken = async (token: User): Promise<JWT> => {
  const { data: { user, school } } = await api.getSessionUser(token?.access_token)

  const res = {
    ...token,
    ...user,
    school: school ? school : dummySchoolData, 
    // ...(school ? { school } : {}),
    name: `${user.first_name} ${user.last_name}`,
  };
  return res
};

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
        const { data: { user, access_token, refresh_token, school } } = await api.loginWithCredentials(username, password)
        if (!(user && access_token)) {
          return null;
        }

        const res = {
          ...user,
          ...(school ? { school } : {}),
          name: `${user.first_name} ${user.last_name}`,
          access_token,
          refresh_token,
        }

        return res;
      }
    }),
  ],
  callbacks: {
    async jwt({ user, token }): Promise<JWT> {
      /**
       * [NOTICE]
       * Everything returned from here will be encoded in the JWT
       * - To keep the token size small, expose only the necessary fields
       * - For security reasons, do not return sensitive information eg. passwords
       */
      return refreshToken((user ?? token));
    },
    async session({ session, token }) {
      return {
        /**
         * [SECURITY NOTICE]
         * Only expose NECESSARY and NON-SENSITIVE fields.
         */
        ...session,
        ...token,
      };
    }
  },
  pages: {
    signIn: '/login',
  }
}

export default NextAuth(authOptions)