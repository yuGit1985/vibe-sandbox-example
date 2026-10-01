import { randomUUID } from "node:crypto";
import type {
  AuthenticatedUser,
  CredentialAuthenticator,
  SessionRepository,
} from "@/ports/authentication";

export const prototypeCredentials = {
  email: "kenta.takahashi@orbit.jp",
  password: "orbit-demo",
} as const;

const prototypeUser: AuthenticatedUser = {
  id: "usr-001",
  name: "高橋 健太",
  email: prototypeCredentials.email,
  role: "管理者",
  initials: "高",
};

export class InMemoryAuthentication
  implements CredentialAuthenticator, SessionRepository
{
  private readonly sessions = new Map<string, string>();

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    if (
      email === prototypeCredentials.email &&
      password === prototypeCredentials.password
    ) {
      return structuredClone(prototypeUser);
    }

    return null;
  }

  async create(userId: string): Promise<string> {
    if (userId !== prototypeUser.id) {
      throw new Error("セッションを作成できないユーザーです。");
    }

    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  async findUserByToken(token: string): Promise<AuthenticatedUser | null> {
    return this.sessions.get(token) === prototypeUser.id
      ? structuredClone(prototypeUser)
      : null;
  }

  async revoke(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}

export const authentication = new InMemoryAuthentication();
