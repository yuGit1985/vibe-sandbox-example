export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
};

export interface CredentialAuthenticator {
  authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null>;
}

export interface SessionRepository {
  create(userId: string): Promise<string>;
  findUserByToken(token: string): Promise<AuthenticatedUser | null>;
  revoke(token: string): Promise<void>;
}
