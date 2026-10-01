import type {
  AuthenticatedUser,
  CredentialAuthenticator,
  SessionRepository,
} from "@/ports/authentication";

type LoginOptions = {
  authenticator: CredentialAuthenticator;
  sessions: SessionRepository;
  email: string;
  password: string;
};

export type LoginResult =
  | { ok: true; token: string; user: AuthenticatedUser }
  | { ok: false };

export async function login({
  authenticator,
  sessions,
  email,
  password,
}: LoginOptions): Promise<LoginResult> {
  const user = await authenticator.authenticate(email, password);

  if (!user) {
    return { ok: false };
  }

  return {
    ok: true,
    token: await sessions.create(user.id),
    user,
  };
}
