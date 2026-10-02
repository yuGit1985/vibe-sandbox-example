import type {
  EmailDeliveryReceipt,
  EmailSender,
  OutgoingEmail,
} from "@/ports/email-sender";

export class InMemoryEmailSender implements EmailSender {
  private readonly sentEmails: OutgoingEmail[] = [];

  async send(message: OutgoingEmail): Promise<EmailDeliveryReceipt> {
    this.sentEmails.push(structuredClone(message));
    return { id: `email-${this.sentEmails.length}` };
  }

  listSentEmails(): OutgoingEmail[] {
    return structuredClone(this.sentEmails);
  }
}

export const emailSender = new InMemoryEmailSender();
