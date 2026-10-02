import type { Customer } from "@/ports/customer-repository";

export function deleteCustomer(
  customers: Customer[],
  customerId: string,
): Customer[] {
  return customers.filter((customer) => customer.id !== customerId);
}
