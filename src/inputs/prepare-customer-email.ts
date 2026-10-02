export type EmailFieldErrors = {
  subject?: string;
  body?: string;
};

export type PrepareCustomerEmailResult =
  | {
      ok: true;
      value: { customerId: string; subject: string; body: string };
    }
  | { ok: false; message?: string; fieldErrors: EmailFieldErrors };

function readText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function prepareCustomerEmail(
  customerIdValue: FormDataEntryValue | null,
  subjectValue: FormDataEntryValue | null,
  bodyValue: FormDataEntryValue | null,
): PrepareCustomerEmailResult {
  const customerId = readText(customerIdValue);
  const subject = readText(subjectValue);
  const body = readText(bodyValue);
  const fieldErrors: EmailFieldErrors = {};

  if (!customerId) {
    return {
      ok: false,
      message: "送信先の顧客を選択してください。",
      fieldErrors,
    };
  }

  if (!subject) {
    fieldErrors.subject = "件名を入力してください。";
  } else if (subject.length > 100) {
    fieldErrors.subject = "件名は100文字以内で入力してください。";
  }

  if (!body) {
    fieldErrors.body = "本文を入力してください。";
  } else if (body.length > 2000) {
    fieldErrors.body = "本文は2000文字以内で入力してください。";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, value: { customerId, subject, body } };
}
