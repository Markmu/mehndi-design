import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 简单的用户验证，实际项目中应该使用数据库存储用户信息
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 验证用户名和密码
        if (credentials.username === ADMIN_USERNAME && 
            credentials.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            name: credentials.username,
            email: `${credentials.username}@example.com`,
            role: "admin"
          };
        }
        
        // 验证失败
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
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
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24小时
  },
});

export { handler as GET, handler as POST };