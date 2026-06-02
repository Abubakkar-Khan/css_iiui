// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Whitelist matching configuration
      const allowedEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      if (user?.email && user.email.toLowerCase() === allowedEmail.toLowerCase()) {
        return true;
      }
      console.warn(`[NextAuth] Rejected unauthorized admin login attempt from: ${user?.email}`);
      return false; // Reject sign-in
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-1234567890',
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
