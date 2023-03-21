import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { toggleBlogLike } from "~/server/models/blog.server";
import { getUserDetails } from "~/utils/session.server";

export async function loader() {
  return redirect("/");
}

export default function Like() {
  return false;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const blogId = formData.get("blogId");
  const redirectTo = formData.get("redirectTo");
  const userDetails = await getUserDetails(request);

  invariant(blogId && typeof blogId === "string", "blogId should be a string");
  invariant(userDetails?.id, "userId is required");

  await toggleBlogLike(blogId, userDetails.id);

  if (redirectTo && typeof redirectTo === "string") return redirect(redirectTo);
  return redirect("/");
}
