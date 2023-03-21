import { db } from "~/utils/prisma.server";

export async function getAllTags() {
  return db.tag.findMany({
    where: {},
  });
}
