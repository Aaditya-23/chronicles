import { createNewBlog } from "../models/blog.server";
import { json, redirect } from "@remix-run/node";
import { ZodError } from "zod";
import type { userDetailsType } from "~/utils/session.server";

export async function postBlog(input: any, user: userDetailsType) {
  try {
    if (user === null) throw new Error("user not found");

    await createNewBlog(input, user.id);
    return redirect("/");
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.errors[0];
      return json({ error: message }, { status: 400 });
    } else if (error instanceof Error)
      return json({ error: error.message }, { status: 400 });

    throw error;
  }
}
