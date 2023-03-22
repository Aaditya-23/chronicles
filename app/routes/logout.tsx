import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { destroyUserSession } from "~/utils/session.server";

export async function loader() {
  return redirect("/");
}

export default function Logout() {
  return false;
}

export async function action({ request }: ActionArgs) {
  return await destroyUserSession(request, "/signin");
}
