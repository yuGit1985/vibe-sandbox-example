import type {
  AuthenticatedUser,
  SessionRepository,
} from "@/ports/authentication";

export async function getAuthenticatedUser(
  sessions: SessionRepository,
  token: string | undefined,
): Promise<AuthenticatedUser | null> {
  if (!token) {
    return null;
  }

  return sessions.findUserByToken(token);
}
