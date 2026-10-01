import { InMemoryCustomerRepository } from "@/fakes/in-memory-customer-repository";
import { CustomerDashboard } from "@/ui/customer-dashboard";
import { getCustomers } from "@/usecases/get-customers";

export default async function Home() {
  const customers = await getCustomers(new InMemoryCustomerRepository());
  return <CustomerDashboard initialCustomers={customers} />;
}
