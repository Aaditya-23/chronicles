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

export const updateProfileSchema = z.object({
  firstName: z
    .string({
      required_error: "firstName is a required field",
      invalid_type_error: "firstName should be of type string",
    })
    .trim()
    .min(1, "firstName should contain atleast one character."),
  lastName: z
    .string({
      required_error: "lastName is a required field",
      invalid_type_error: "lastName should be of type string",
    })
    .trim()
    .min(1, "lastName should contain atleast one character."),
  location: z.optional(
    z
      .string({
        invalid_type_error: "location should be of type string",
      })
      .trim()
  ),
  work: z.optional(
    z
      .string({
        invalid_type_error: "work should be of type string",
      })
      .trim()
  ),
  bio: z.optional(
    z
      .string({
        invalid_type_error: "bio should be of type string",
      })
      .trim()
  ),
  education: z.optional(
    z
      .string({
        invalid_type_error: "education should be of type string",
      })
      .trim()
  ),
});

export const newPasswordInput = z.object({
  oldPassword: z
    .string({
      required_error: "oldPassword is a required field",
      invalid_type_error: "oldPassword should be of type string",
    })
    .trim(),

  newPassword: z
    .string({
      required_error: "newPassword is a required field",
      invalid_type_error: "newPassword should be of type string",
    })
    .trim()
    .min(8, "password should have atleast 8 characters"),

  confirmPassword: z
    .string({
      required_error: "confirmPassword is a required field",
      invalid_type_error: "confirmPassword should be of type string",
    })
    .trim(),
});
