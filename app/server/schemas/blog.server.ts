import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string({
      invalid_type_error: "blog title should be of type string",
      required_error: "blog title is a required field",
    })
    .trim()
    .min(1, "blog title must contain atleast one character"),
  body: z
    .string({
      invalid_type_error: "blog body should be of type string",
      required_error: "blog body is a required field",
    })
    .trim()
    .min(1, "blog body must contain atleast one character"),
  tags: z.optional(
    z.string({ invalid_type_error: "tags should be of type string" }).trim()
  ),
});

export type blogSchemaType = z.infer<typeof blogSchema>;
