import { db } from "~/utils/prisma.server";
import { commentSchema } from "../schemas/comment.server";
import { blogExists } from "./blog.server";
import { userExists } from "./user.server";

export async function createComment(input: any, userId: string) {
  const data = commentSchema.parse(input);

  if (!(await userExists(userId))) throw new Error("invalid user");
  if (!(await blogExists(data.blogId))) throw new Error("blog does not exists");

  await db.comment.create({
    data: {
      body: data.body,
      blog: {
        connect: {
          id: data.blogId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function toggleCommentLike(commentId: string, userId: string) {
  if (!(await userExists(userId))) throw new Error("invalid user");

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { likes: true },
  });

  if (comment === null) throw new Error("comment not found");

  const commentIsLiked =
    comment.likes.filter((user) => user.id === userId).length > 0
      ? true
      : false;

  if (commentIsLiked)
    await db.comment.update({
      where: { id: commentId },
      data: {
        likes: { disconnect: { id: userId } },
      },
    });
  else
    await db.comment.update({
      where: { id: commentId },
      data: {
        likes: { connect: { id: userId } },
      },
    });
}

export async function commentExists(commentId: string) {
  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
    },
  });

  return comment ? true : false;
}
