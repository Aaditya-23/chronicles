import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { toggleBlogBookmark } from "~/server/models/blog.server";
import { getUserDetails } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  return redirect("/");
}

export default function Bookmark() {
  return false;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const blogId = formData.get("blogId");
  const redirectTo = formData.get("redirectTo");
  const userDetails = await getUserDetails(request);

  invariant(blogId && typeof blogId === "string", "blogId should be a string");
  invariant(userDetails?.id, "userId is required");

  await toggleBlogBookmark(blogId, userDetails.id);

  if (redirectTo && typeof redirectTo === "string") return redirect(redirectTo);
  return redirect("/");
}
