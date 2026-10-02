import type { CustomerRank, CustomerStatus } from "@/ports/customer-repository";

type EditableCustomer = {
  name: string;
  kana: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: CustomerStatus;
  rank: CustomerRank;
};

export type CustomerFieldErrors = Partial<
  Record<keyof EditableCustomer, string>
>;

export type PrepareCustomerResult =
  | { ok: true; value: EditableCustomer }
  | { ok: false; fieldErrors: CustomerFieldErrors };

const statuses: CustomerStatus[] = ["active", "follow-up", "inactive"];
const ranks: CustomerRank[] = ["S", "A", "B", "C"];

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateRequired(
  fieldErrors: CustomerFieldErrors,
  field: keyof EditableCustomer,
  value: string,
  label: string,
  maxLength: number,
) {
  if (!value) {
    fieldErrors[field] = `${label}を入力してください。`;
  } else if (value.length > maxLength) {
    fieldErrors[field] = `${label}は${maxLength}文字以内で入力してください。`;
  }
}

export function prepareCustomer(formData: FormData): PrepareCustomerResult {
  const name = readText(formData, "name");
  const kana = readText(formData, "kana");
  const company = readText(formData, "company");
  const role = readText(formData, "role");
  const email = readText(formData, "email").toLowerCase();
  const phone = readText(formData, "phone");
  const location = readText(formData, "location");
  const status = readText(formData, "status");
  const rank = readText(formData, "rank");
  const fieldErrors: CustomerFieldErrors = {};

  validateRequired(fieldErrors, "name", name, "氏名", 100);
  validateRequired(fieldErrors, "kana", kana, "ふりがな", 100);
  validateRequired(fieldErrors, "company", company, "会社名", 100);
  validateRequired(fieldErrors, "role", role, "役職", 100);
  validateRequired(fieldErrors, "email", email, "メールアドレス", 254);
  validateRequired(fieldErrors, "phone", phone, "電話番号", 30);
  validateRequired(fieldErrors, "location", location, "所在地", 100);

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    fieldErrors.email = "正しいメールアドレスを入力してください。";
  }
  if (!statuses.includes(status as CustomerStatus)) {
    fieldErrors.status = "ステータスを選択してください。";
  }
  if (!ranks.includes(rank as CustomerRank)) {
    fieldErrors.rank = "ランクを選択してください。";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      name,
      kana,
      company,
      role,
      email,
      phone,
      location,
      status: status as CustomerStatus,
      rank: rank as CustomerRank,
    },
  };
}
