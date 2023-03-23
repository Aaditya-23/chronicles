import { db } from "~/utils/prisma.server";
import {
  newPasswordInput,
  updateProfileSchema,
  userSchema,
} from "../schemas/user.server";
import { compare, hash } from "bcrypt";
import { z } from "zod";

const saltRounds = 10;

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
      bookmaredBlogs: {
        include: {
          likes: true,
          bookmarks: true,
          tags: true,
          author: {
            select: {
              userName: true,
              profile: { select: { userImage: true } },
            },
          },
        },
      },
      followers: true,
      notificationList: true,
    },
  });

  return user;
}

export async function toggleFollowing(authorId: string, followerId: string) {
  if (!(await userExists(followerId))) throw "invalid followerId";

  const author = await db.user.findUnique({
    where: { id: authorId },
    include: { followers: true },
  });

  if (author === null) throw new Error("invalid authorId");

  const authorIsFollowed =
    author.followers.filter((user) => user.id === followerId).length > 0
      ? true
      : false;

  if (authorIsFollowed)
    await db.user.update({
      where: { id: authorId },
      data: {
        followers: {
          disconnect: {
            id: followerId,
          },
        },
      },
    });
  else
    await db.user.update({
      where: { id: authorId },
      data: {
        followers: {
          connect: {
            id: followerId,
          },
        },
      },
    });
}

export async function updateUser(input: any, userId: string) {
  const { firstName, lastName, location, work, bio, education } =
    updateProfileSchema.parse(input);

  await db.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      profile: {
        update: {
          bio,
          location,
          work,
          education,
        },
      },
    },
  });
}

export async function changeUserPassword(input: any, userId: string) {
  const data = newPasswordInput.parse(input);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      hashedPassword: true,
    },
  });

  if (user === null) throw new Error("no user found");

  const doPasswordsMatch = await compare(data.oldPassword, user.hashedPassword);

  if (!doPasswordsMatch) throw new Error("old password is incorrect");
  else if (data.newPassword !== data.confirmPassword)
    throw new Error("your passwords dont match");

  const newHashedPassword = await hash(data.newPassword, saltRounds);

  await db.user.update({
    where: { id: userId },
    data: {
      hashedPassword: newHashedPassword,
    },
  });
}

export async function clearUserNotificationList(userId: string) {
  if (!(await userExists(userId))) throw new Error("no user found");

  await db.user.update({
    where: { id: userId },
    data: {
      notificationList: {
        deleteMany: {},
      },
    },
  });
}
