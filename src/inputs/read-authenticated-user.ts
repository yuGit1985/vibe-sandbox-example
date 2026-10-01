import { cookies } from "next/headers";
import { authentication } from "@/fakes/in-memory-authentication";
import { getAuthenticatedUser } from "@/usecases/get-authenticated-user";
import { sessionCookieName } from "./session-cookie";

export async function readAuthenticatedUser() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return getAuthenticatedUser(authentication, token);
}
