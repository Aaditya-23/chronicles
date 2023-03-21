import { db } from "~/utils/prisma.server";
import { userSchema } from "../schemas/user.server";
import { compare, hash } from "bcrypt";
import { z } from "zod";

export async function newUser(input: any) {
  const data = userSchema
    .refine((data) => data.password === data.confirmPassword, {
      message: "your passwords don't match",
      path: ["confirmPassword"],
    })
    .parse(input);

  if (await isEmailInUse(data.email))
    throw { message: "account with same email exists", path: "email" };
  else if (await isUserNameInUse(data.userName))
    throw { message: "this username is not available", path: "userName" };

  const { firstName, lastName, email, userName, password } = data;

  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      userName,
      hashedPassword,
      profile: { create: {} },
      preference: { create: {} },
    },
    select: {
      id: true,
      userName: true,
    },
  });

  return user;
}

export async function newUserSession(input: any) {
  const data = userSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string({
        invalid_type_error: "password should be a string",
        required_error: "password is a required field",
      }),
    })
    .parse(input);

  const userId = await authenticateUser(data.email, data.password);

  return userId;
}

async function isEmailInUse(email: string) {
  const res = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  return res ? true : false;
}

async function isUserNameInUse(userName: string) {
  userName = userName.toLowerCase();
  const res = await db.user.findUnique({
    where: {
      userName,
    },
    select: {
      userName: true,
    },
  });

  return res ? true : false;
}

async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      userName: true,
      hashedPassword: true,
    },
  });

  if (user === null) throw new Error("invalid email or password");

  const isPasswordCorrect = await compare(password, user.hashedPassword);
  if (!isPasswordCorrect) throw new Error("invalid email or password");

  return { id: user.id, userName: user.userName };
}

export async function userExists(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  return user ? true : false;
}

export async function getUsersProfile(userName: string) {
  const user = await db.user.findUnique({
    where: {
      userName,
    },
    include: {
      profile: true,
    },
  });

  return user;
}
