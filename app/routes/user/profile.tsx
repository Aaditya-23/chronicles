import type { LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  NavLink,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { Navbar } from "~/layouts";
import { getUsersProfile } from "~/server/models/user.server";
import { getUserDetails } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const userDetails = await getUserDetails(request);
  if (userDetails === null) return redirect("signin");
  const user = await getUsersProfile(userDetails.userName);
  if (user === null) return redirect("signin");
  return json(user);
}

export default function Profile() {
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <Navbar
        user={{
          id: user.id,
          userName: user.userName,
          userImage: user.profile.userImage,
          firstName: user.firstName
        }}
      />

      <div className="mt-8 grid grid-cols-[1fr_3fr]">
        <aside className="capitalize   font-medium">
          <nav className="p-2 flex flex-col gap-2">
            <NavLink
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "black",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }
                  : { color: "gray" }
              }
              to="."
              end
            >
              profile
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "black",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }
                  : { color: "gray" }
              }
              to="account"
            >
              account
            </NavLink>
            <NavLink
              style={({ isActive }) =>
                isActive
                  ? {
                      color: "black",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }
                  : { color: "gray" }
              }
              to="notifications"
            >
              notifications
            </NavLink>
          </nav>
        </aside>

        <main className="px-2">
          <Outlet context={user} />
        </main>
      </div>
    </div>
  );
}

export function useUser() {
  return useOutletContext<
    NonNullable<Awaited<ReturnType<typeof getUsersProfile>>>
  >();
}
