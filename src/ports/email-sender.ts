export type OutgoingEmail = {
  to: string;
  subject: string;
  body: string;
  senderName: string;
};

export type EmailDeliveryReceipt = {
  id: string;
};

export interface EmailSender {
  send(message: OutgoingEmail): Promise<EmailDeliveryReceipt>;
}
