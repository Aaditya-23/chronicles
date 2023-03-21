import { NavLink } from "@remix-run/react";
import { Navbar } from "~/layouts";
import type { LoaderArgs } from "@remix-run/node";
import { fetchBlogs } from "~/server/models/blog.server";
import { BlogCard } from "~/components";
import { getUserDetails } from "~/utils/session.server";
import { typedjson } from "remix-typedjson";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { getUsersProfile } from "~/server/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userDetails = await getUserDetails(request);
  const user = await getUsersProfile(userDetails?.userName || "");
  const blogs = await fetchBlogs();
  return typedjson({ user, blogs });
}

export default function Index() {
  const { user, blogs } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <Navbar
        user={
          user
            ? {
                id: user.id,
                firstName: user.firstName,
                userImage: user.profile.userImage,
                userName: user.userName,
              }
            : null
        }
      />

      <main className="p-3">
        <nav className="my-3 flex gap-2">
          <NavLink
            to=""
            style={({ isActive }) =>
              isActive ? { color: "black" } : { color: "gray" }
            }
            className=" text-lg font-semibold capitalize"
          >
            relevant
          </NavLink>

          <NavLink
            to="following"
            style={({ isActive }) =>
              isActive ? { color: "black" } : { color: "gray" }
            }
            className=" text-lg font-semibold capitalize"
          >
            following
          </NavLink>

          <NavLink
            to="top"
            style={({ isActive }) =>
              isActive ? { color: "black" } : { color: "gray" }
            }
            className=" text-lg font-semibold capitalize"
          >
            top
          </NavLink>
        </nav>

        <div className="grid grid-cols-4 gap-x-3 gap-y-5">
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              index={index}
              user={user ? { id: user.id } : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
