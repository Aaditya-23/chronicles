import { useState } from "react";
import { BlogCard, Searchbar } from "~/components";
import { Navbar } from "~/layouts";
import type { LoaderArgs } from "@remix-run/node";
import { getUserDetails } from "~/utils/session.server";
import { getUsersProfile } from "~/server/models/user.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { fetchBlogs } from "~/server/models/blog.server";

export async function loader({ request }: LoaderArgs) {
  const userDetails = await getUserDetails(request);
  const user = await getUsersProfile(userDetails?.userName || "");
  const blogs = await fetchBlogs();

  return typedjson({ user, blogs });
}

export default function Search() {
  const { user, blogs } = useTypedLoaderData<typeof loader>();

  const [query, setQuery] = useState("");

  function handleQuery(query: string) {
    setQuery(query);
  }

  const filteredBlogs = blogs.filter((blog) => blog.title.includes(query));

  return (
    <div>
      <Navbar
        user={
          user
            ? {
                firstName: user.firstName,
                id: user.id,
                userImage: user.profile.userImage,
                userName: user.userName,
              }
            : null
        }
      />

      <main className="mt-5 px-3 space-y-3">
        <Searchbar setQuery={handleQuery} />

        <div className="flex flex-col gap-4">
          {filteredBlogs.map((blog, index) => (
            <BlogCard
              blog={blog}
              index={index}
              key={index}
              user={user ? { id: user.id } : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
