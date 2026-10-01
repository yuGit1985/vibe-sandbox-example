import type { Customer } from "@/ports/customer-repository";

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ja");
}

export function searchCustomers(
  customers: Customer[],
  rawQuery: string,
): Customer[] {
  const query = normalize(rawQuery);

  if (!query) {
    return customers;
  }

  return customers.filter((customer) => {
    return normalize(`${customer.name} ${customer.kana}`).includes(query);
  });
}
