import { json } from "@remix-run/node";
import { ZodError } from "zod";
import type { userDetailsType } from "~/utils/session.server";
import { createComment, toggleCommentLike } from "../models/comment.server";
import { commentLikeInput } from "../schemas/comment.server";

export async function postComment(input: any, user: userDetailsType) {
  try {
    if (user === null) throw new Error("user not found");
    await createComment(input, user.id);
    return json(null, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = error.errors[0].message;
      return json({ message }, { status: 400 });
    }

    return json({ message: error.message || "" }, { status: 400 });
  }
}

export async function toggleLike(input: any, user: userDetailsType) {
  try {
    if (user === null) throw new Error("user not found");

    const data = commentLikeInput.parse(input);

    await toggleCommentLike(data.commentId, user.id);
    return json(null, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = error.errors[0].message;
      return json({ message }, { status: 400 });
    }

    return json({ message: error.message || "" }, { status: 400 });
  }
}

