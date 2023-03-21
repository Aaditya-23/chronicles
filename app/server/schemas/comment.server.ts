import { z } from "zod";

export const commentSchema = z.object({
  body: z
    .string({
      required_error: "comment is required.",
      invalid_type_error: "comment should be of type string",
    })
    .trim()
    .min(1, "comment is empty"),

  blogId: z
    .string({
      required_error: "blogId is a required field",
      invalid_type_error: "blogId should be of type string",
    })
    .trim(),
});

export const commentLikeInput = z.object({
  commentId: z
    .string({
      required_error: "commentId is required",
      invalid_type_error: "commentId should be of type string",
    })
    .trim(),
});
