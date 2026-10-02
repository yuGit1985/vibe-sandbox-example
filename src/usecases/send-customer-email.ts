import type { EmailSender } from "@/ports/email-sender";

type SendCustomerEmailOptions = {
  emailSender: EmailSender;
  recipientEmail: string;
  subject: string;
  body: string;
  senderName: string;
};

export async function sendCustomerEmail({
  emailSender,
  recipientEmail,
  subject,
  body,
  senderName,
}: SendCustomerEmailOptions): Promise<{ deliveryId: string }> {
  const receipt = await emailSender.send({
    to: recipientEmail,
    subject,
    body,
    senderName,
  });

  return { deliveryId: receipt.id };
}
