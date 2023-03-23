import { db } from "~/utils/prisma.server";
import { blogSchema } from "../schemas/blog.server";
import { userExists } from "./user.server";

export async function createNewBlog(input: any, userId: string) {
  const data = blogSchema.parse(input);

  if (!(await userExists(userId))) throw new Error("invalid user");

  const { title, body } = data;
  const tags = data.tags?.split(",");

  const blog = await db.blog.create({
    data: {
      title,
      body,
      authorId: userId,
      tags: {
        connectOrCreate: tags?.map((tag) => ({
          where: { title: tag },
          create: {
            title: tag,
          },
        })),
      },
    },
    select: {
      id: true,
    },
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
      followers: {
        select: {
          id: true,
          notificationList: true,
        },
      },
    },
  });

  if (user === null) return;

  const message = `${user.userName} published a new blog`;
  const url = `/blogs/${blog.id}`;

  user.followers.forEach(async (user) => {
    await db.user.update({
      where: { id: user.id },
      data: {
        notificationList: {
          create: {
            message,
            url,
          },
        },
      },
    });
  });
}

export async function fetchBlogs(userName?: string) {
  return await db.blog.findMany({
    where: {
      author: { userName },
    },
    select: {
      id: true,
      title: true,
      likes: true,
      bookmarks: true,
      tags: true,
      author: {
        select: {
          userName: true,
          profile: {
            select: {
              userImage: true,
            },
          },
        },
      },
      updatedAt: true,
    },
  });
}

export async function fetchBlog(blogId: string) {
  return await db.blog.findUnique({
    where: {
      id: blogId,
    },
    include: {
      author: {
        select: {
          firstName: true,
          userName: true,
          profile: {
            select: {
              userImage: true,
            },
          },
        },
      },
      tags: true,
      comments: {
        include: {
          user: {
            include: { profile: true },
          },
          likes: true,
        },
      },
      likes: true,
      bookmarks: true,
    },
  });
}

export async function toggleBlogLike(blogId: string, userId: string) {
  const blog = await db.blog.findUnique({
    where: { id: blogId },
    select: {
      likes: true,
    },
  });

  if (blog === null) return { message: "blog not found" };

  const isFavouriteBlog =
    blog.likes.filter((user) => user.id === userId).length > 0 ? true : false;

  if (isFavouriteBlog)
    await db.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likes: {
          disconnect: { id: userId },
        },
      },
    });
  else
    await db.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likes: {
          connect: { id: userId },
        },
      },
    });
}

export async function toggleBlogBookmark(blogId: string, userId: string) {
  const blog = await db.blog.findUnique({
    where: { id: blogId },
    select: {
      bookmarks: true,
    },
  });

  if (blog === null) return { message: "blog not found" };

  const isBookmarkedBlog =
    blog.bookmarks.filter((user) => user.id === userId).length > 0
      ? true
      : false;

  if (isBookmarkedBlog)
    await db.blog.update({
      where: {
        id: blogId,
      },
      data: {
        bookmarks: {
          disconnect: { id: userId },
        },
      },
    });
  else
    await db.blog.update({
      where: {
        id: blogId,
      },
      data: {
        bookmarks: {
          connect: { id: userId },
        },
      },
    });
}

export async function blogExists(blogId: string) {
  const blog = await db.blog.findUnique({
    where: {
      id: blogId,
    },
    select: {
      id: true,
    },
  });

  return blog ? true : false;
}
