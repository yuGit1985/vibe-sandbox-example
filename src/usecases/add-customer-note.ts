import type { Customer, CustomerNote } from "@/ports/customer-repository";

type AddCustomerNoteOptions = {
  customer: Customer;
  body: string;
  author: string;
  now?: Date;
};

export function addCustomerNote({
  customer,
  body,
  author,
  now = new Date(),
}: AddCustomerNoteOptions): Customer {
  const note: CustomerNote = {
    id: `note-${now.getTime()}`,
    body,
    author,
    createdAt: now.toISOString(),
  };

  return {
    ...customer,
    notes: [note, ...customer.notes],
  };
}
