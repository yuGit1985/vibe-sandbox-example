export type PreparedLogin =
  | { ok: true; email: string; password: string }
  | {
      ok: false;
      fieldErrors: { email?: string; password?: string };
    };

export function prepareLogin(
  emailValue: FormDataEntryValue | null,
  passwordValue: FormDataEntryValue | null,
): PreparedLogin {
  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const fieldErrors: { email?: string; password?: string } = {};

  if (!email) {
    fieldErrors.email = "メールアドレスを入力してください。";
  } else if (!email.includes("@")) {
    fieldErrors.email = "有効なメールアドレスを入力してください。";
  }

  if (!password) {
    fieldErrors.password = "パスワードを入力してください。";
  }

  return Object.keys(fieldErrors).length > 0
    ? { ok: false, fieldErrors }
    : { ok: true, email, password };
}
