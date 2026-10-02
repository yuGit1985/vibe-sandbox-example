"use server";

import { InMemoryCustomerRepository } from "@/fakes/in-memory-customer-repository";
import { emailSender } from "@/fakes/in-memory-email-sender";
import { sendCustomerEmail } from "@/usecases/send-customer-email";
import {
  type EmailFieldErrors,
  prepareCustomerEmail,
} from "./prepare-customer-email";
import { readAuthenticatedUser } from "./read-authenticated-user";

export type CustomerEmailActionResult =
  | { ok: true; message: string }
  | { ok: false; message?: string; fieldErrors?: EmailFieldErrors };

export async function sendCustomerEmailAction(
  formData: FormData,
): Promise<CustomerEmailActionResult> {
  const currentUser = await readAuthenticatedUser();
  if (!currentUser) {
    return { ok: false, message: "ログインし直してから送信してください。" };
  }

  const prepared = prepareCustomerEmail(
    formData.get("customerId"),
    formData.get("subject"),
    formData.get("body"),
  );
  if (!prepared.ok) {
    return {
      ok: false,
      ...(prepared.message ? { message: prepared.message } : {}),
      fieldErrors: prepared.fieldErrors,
    };
  }

  const repository = new InMemoryCustomerRepository();
  const customers = await repository.list();
  const customer = customers.find(({ id }) => id === prepared.value.customerId);
  if (!customer) {
    return { ok: false, message: "送信先の顧客が見つかりません。" };
  }

  await sendCustomerEmail({
    emailSender,
    recipientEmail: customer.email,
    subject: prepared.value.subject,
    body: prepared.value.body,
    senderName: currentUser.name,
  });

  return { ok: true, message: `${customer.name}さんにメールを送信しました。` };
}
