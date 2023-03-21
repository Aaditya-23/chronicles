-- CreateTable
CREATE TABLE "_BookmarkedBlogs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookmarkedBlogs_AB_unique" ON "_BookmarkedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_BookmarkedBlogs_B_index" ON "_BookmarkedBlogs"("B");

-- AddForeignKey
ALTER TABLE "_BookmarkedBlogs" ADD CONSTRAINT "_BookmarkedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookmarkedBlogs" ADD CONSTRAINT "_BookmarkedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
