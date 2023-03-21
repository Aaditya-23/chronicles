import { newUser, newUserSession } from "../models/user.server";
import { json } from "@remix-run/node";
import { ZodError } from "zod";
import { createUserSession } from "~/utils/session.server";

export async function signUp(input: any) {
  try {
    const user = await newUser(input);

    return createUserSession(user, "/");
  } catch (error: any) {
    if (error instanceof ZodError) {
      let errors: Record<string, string> = {};

      error.errors.forEach((err) => {
        errors[err.path.toString()] = err.message;
      });

      return json({ errors: errors }, { status: 400 });
    } else if (error?.path && error?.message) {
      return json(
        {
          errors: {
            [error.path as string]: error.message as string,
          },
        },
        { status: 400 }
      );
    }

    throw error;
  }
}

export async function signIn(input: any) {
  try {
    const user = await newUserSession(input);
    
    return createUserSession(user, "/");
  } catch (error) {
    if (error instanceof ZodError) {
      const { message } = error.errors[0];
      return json({ error: message }, { status: 400 });
    } else if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
