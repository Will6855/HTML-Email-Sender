import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      email: string;
      createdAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role: string;
    email: string;
    createdAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
    email: string;
    createdAt: Date;
  }
}