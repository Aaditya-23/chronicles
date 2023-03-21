import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: "first name should be a string",
      required_error: "first name is a required field",
    })
    .trim()
    .min(1, "first name cannot be empty")
    .transform((val) => val.toLowerCase()),
  lastName: z
    .string({
      invalid_type_error: "last name should be a string",
      required_error: "last name is a required field",
    })
    .trim()
    .min(1, "last name cannot be empty")
    .transform((val) => val.toLowerCase()),
  email: z
    .string({
      invalid_type_error: "email should be a string",
      required_error: "email is a required field",
    })
    .email("invalid email")
    .transform((val) => val.toLowerCase()),
  userName: z
    .string({
      invalid_type_error: "username should be a string",
      required_error: "username is a required field",
    })
    .trim()
    .min(1, "username cannot be empty"),
  password: z
    .string({
      invalid_type_error: "password should be a string",
      required_error: "password is a required field",
    })
    .min(8, "your password must be atleast 8 characters"),
  confirmPassword: z.string({
    invalid_type_error: "passwords don't match",
    required_error: "confirm your password",
  }),
});

export type userSchemaType = z.infer<typeof userSchema>;
