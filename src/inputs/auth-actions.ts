"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authentication } from "@/fakes/in-memory-authentication";
import { login } from "@/usecases/login";
import { logout } from "@/usecases/logout";
import { prepareLogin } from "./prepare-login";
import { sessionCookieName, sessionDurationSeconds } from "./session-cookie";

export type LoginFormState = {
  message?: string;
  fieldErrors?: { email?: string; password?: string };
};

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const prepared = prepareLogin(
    formData.get("email"),
    formData.get("password"),
  );

  if (!prepared.ok) {
    return { fieldErrors: prepared.fieldErrors };
  }

  const result = await login({
    authenticator: authentication,
    sessions: authentication,
    email: prepared.email,
    password: prepared.password,
  });

  if (!result.ok) {
    return { message: "メールアドレスまたはパスワードが正しくありません。" };
  }

  (await cookies()).set(sessionCookieName, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: sessionDurationSeconds,
    path: "/",
  });

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  await logout(authentication, token);

  cookieStore.delete(sessionCookieName);
  redirect("/login");
}
