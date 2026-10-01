"use client";

import { useActionState } from "react";
import { type LoginFormState, loginAction } from "@/inputs/auth-actions";

const initialState: LoginFormState = {};

export function LoginForm({
  defaultEmail,
  defaultPassword,
}: {
  defaultEmail: string;
  defaultPassword: string;
}) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form className="login-form" action={action} noValidate>
      {state.message && (
        <p className="login-error" role="alert">
          {state.message}
        </p>
      )}
      <div className="login-field">
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={defaultEmail}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
        />
        {state.fieldErrors?.email && (
          <span id="email-error" className="field-error">
            {state.fieldErrors.email}
          </span>
        )}
      </div>
      <div className="login-field">
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue={defaultPassword}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
        />
        {state.fieldErrors?.password && (
          <span id="password-error" className="field-error">
            {state.fieldErrors.password}
          </span>
        )}
      </div>
      <button className="login-submit" type="submit" disabled={pending}>
        {pending ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
