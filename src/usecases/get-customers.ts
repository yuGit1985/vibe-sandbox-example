import type { Customer, CustomerRepository } from "@/ports/customer-repository";

export async function getCustomers(
  repository: CustomerRepository,
): Promise<Customer[]> {
  return repository.list();
}
