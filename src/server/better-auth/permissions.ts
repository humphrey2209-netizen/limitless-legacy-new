import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

/**
 * Access controller built on the default Better Auth organization statements.
 * Import this on both server (auth config) and client (authClient config).
 */
const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

/**
 * owner – full control over the organization.
 */
export const owner = ac.newRole({
  ...ownerAc.statements,
});

/**
 * admin – full control except delete org or transfer ownership.
 */
export const admin = ac.newRole({
  ...adminAc.statements,
});

/**
 * member – standard read-only organization member (default Better Auth member).
 */
export const member = ac.newRole({
  ...memberAc.statements,
});

/**
 * customer – same privileges as the organization member role.
 * This is a custom role that maps 1-to-1 with `member` permissions.
 */
export const customer = ac.newRole({
  ...memberAc.statements,
});
