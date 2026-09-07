import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization } from "better-auth/plugins";
import { Resend } from "resend";

import { env } from "@/env";
import { db } from "@/server/db";
import { ac, admin, customer, member, owner } from "./permissions";
import * as schema from "@/server/db/schema";

const resend = new Resend(env.RESEND_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
    },
  },
  plugins: [
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
        customer,
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "Limitless Legacy <noreply@hellolimitlesslegacy.com>",
          to: email,
          subject: "Your sign-in link for Limitless Legacy",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #FAF7F0; border-radius: 16px;">
              <img src="${env.BETTER_AUTH_URL}/logo.jpeg" alt="Limitless Legacy" style="display: block; height: 48px; margin: 0 auto 24px;" />
              <h1 style="color: #17324a; font-size: 22px; font-weight: 800; margin: 0 0 8px;">Your sign-in link</h1>
              <p style="color: rgba(23,50,74,0.75); font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                Click the button below to securely sign in to your Limitless Legacy account. This link expires in 10 minutes.
              </p>
              <div style="text-align: center;">
                <a href="${url}" style="display: inline-block; background: #17324a; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 50px; text-decoration: none;">
                  Sign in to Limitless Legacy
                </a>
              </div>
              <p style="color: rgba(23,50,74,0.5); font-size: 12px; margin-top: 24px;">
                If you didn't request this link, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
