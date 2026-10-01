import type { SessionRepository } from "@/ports/authentication";

export async function logout(
  sessions: SessionRepository,
  token: string | undefined,
): Promise<void> {
  if (token) {
    await sessions.revoke(token);
  }
}
