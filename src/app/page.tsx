import { redirect } from "next/navigation";
import { InMemoryCustomerRepository } from "@/fakes/in-memory-customer-repository";
import { logoutAction } from "@/inputs/auth-actions";
import { sendCustomerEmailAction } from "@/inputs/customer-email-actions";
import { readAuthenticatedUser } from "@/inputs/read-authenticated-user";
import { CustomerDashboard } from "@/ui/customer-dashboard";
import { getCustomers } from "@/usecases/get-customers";

export default async function Home() {
  const user = await readAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const customers = await getCustomers(new InMemoryCustomerRepository());
  return (
    <CustomerDashboard
      initialCustomers={customers}
      currentUser={user}
      logoutAction={logoutAction}
      sendEmailAction={sendCustomerEmailAction}
    />
  );
}
