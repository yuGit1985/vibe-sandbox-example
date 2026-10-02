import type { Customer } from "@/ports/customer-repository";

type CustomerChanges = Pick<
  Customer,
  | "name"
  | "kana"
  | "company"
  | "role"
  | "email"
  | "phone"
  | "location"
  | "status"
  | "rank"
>;

export function updateCustomer(
  customer: Customer,
  changes: CustomerChanges,
): Customer {
  return { ...customer, ...changes };
}
