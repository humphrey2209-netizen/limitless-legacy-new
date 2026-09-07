import { magicLinkClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, admin, customer, member, owner } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
        customer,
      },
    }),
    magicLinkClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
