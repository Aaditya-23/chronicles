import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("No Session secret found");

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "user_session",
      httpOnly: true,
      maxAge: 7 * 24 * 3600,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: true,
    },
  });

export async function createUserSession(
  user: { id: string; userName: string },
  redirectTo: string
) {
  const session = await getSession();
  session.set("id", user.id);
  session.set("userName", user.userName);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

async function getUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session;
}

export async function requireUserSession(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("id");
  if (userId && typeof userId === "string") return;

  throw redirect("/signin");
}

export async function getUserDetails(request: Request) {
  const session = await getUserSession(request);
  const id = session.get("id");
  const userName = session.get("userName");
  if (id && userName && typeof id === "string" && typeof userName === "string")
    return { id, userName };
  return null;
}

export type userDetailsType = Awaited<ReturnType<typeof getUserDetails>>;

export async function destroyUserSession(request: Request, redirectTo: string) {
  const session = await getUserSession(request);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
