import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// 简单的用户验证，实际项目中应该使用数据库存储用户信息
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // 为 Google 登录的用户设置普通用户角色
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user"
        };
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        if (credentials.username === ADMIN_USERNAME && 
            credentials.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            name: credentials.username,
            email: `${credentials.username}@example.com`,
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 将用户角色添加到 token 中
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // 将用户角色添加到 session 中
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    // 添加授权回调来控制重定向
    async redirect({ url, baseUrl }) {
      // 如果是绝对URL或相对URL，则直接返回
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24小时
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };