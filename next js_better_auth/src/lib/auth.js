import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";

const uri = process.env.BETTER_AUTH_DB_URI;
if (!uri) {
  throw new Error("BETTER_AUTH_DB_URI is not configured");
}

const globalForMongo = globalThis;
const client = globalForMongo.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("better-auth-db");
const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      void resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: "Reset your password",
        html: `
        <h4>Reset your password</h4>
        Click the link to reset your password: ${url}
        <p>Ignore this email if you haven't requested a password reset.</p>
        `,
      })
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify your email address',
        html: `
        <h1>Please Verify your email address</h1>
        Click <a href="${url}">here</a> to verify your email.
        `,
      })
    },
     sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 7 * 24 * 3600 // 7 days
  },

 socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET 
        }, 
        github: { 
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET 
        }, 
    },
  database: mongodbAdapter(db, { client }),
});