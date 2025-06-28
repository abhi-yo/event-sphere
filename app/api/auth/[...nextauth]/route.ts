import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

// Extend the session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
      isAdmin: boolean;
      adminLevel: string;
    };
  }
  interface User {
    id: string;
    email: string;
    isAdmin: boolean;
    adminLevel: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    isAdmin: boolean;
    adminLevel: string;
  }
}

// Define auth options as a constant, not exported
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error("No user found");
        }

        if (user.isActive === false) {
          throw new Error("Account is disabled");
        }

        if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
          throw new Error(
            "Account is temporarily locked due to multiple failed login attempts"
          );
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          if (user.lockUntil && user.lockUntil.getTime() < Date.now()) {
            await User.updateOne(
              { _id: user._id },
              { $unset: { loginAttempts: 1, lockUntil: 1 } }
            );
          } else {
            const updates: {
              $inc: { loginAttempts: number };
              $set?: { lockUntil: Date };
            } = { $inc: { loginAttempts: 1 } };
            if ((user.loginAttempts || 0) + 1 >= 5) {
              updates.$set = {
                lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
              };
            }
            await User.updateOne({ _id: user._id }, updates);
          }
          throw new Error("Invalid password");
        }

        await User.updateOne(
          { _id: user._id },
          {
            $unset: { loginAttempts: 1, lockUntil: 1 },
            $set: { lastLogin: new Date() },
          }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin || false,
          adminLevel: user.adminLevel || "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "hyperlocaleventappdefaultsecretkey",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.adminLevel = user.adminLevel;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.adminLevel = token.adminLevel as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (user && "isAdmin" in user) {
        console.log(
          `🔐 LOGIN: ${user.email} (Admin: ${
            user.isAdmin
          }) at ${new Date().toISOString()}`
        );
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
