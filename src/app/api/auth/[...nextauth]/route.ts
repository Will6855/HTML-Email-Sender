// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
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

        // Find user in the database
        const user = await prisma.generalAccount.findUnique({
          where: { username: credentials.username }
        });

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id.toString(),
            username: user.username,
            role: user.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add username and role to token if user is found
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add username and role to session
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };