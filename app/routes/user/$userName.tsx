import { useNavigate, useSubmit } from "@remix-run/react";
import { Navbar } from "~/layouts";
import { GrLocation } from "react-icons/gr";
import { IoSchool } from "react-icons/io5";
import { FiMail } from "react-icons/fi";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { getUserDetails } from "~/utils/session.server";
import { getUsersProfile } from "~/server/models/user.server";
import { BlogCard } from "~/components";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { fetchBlogs } from "~/server/models/blog.server";
import invariant from "tiny-invariant";
import { toggleUserFollowing } from "~/server/actions/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const loggedInUserDetails = await getUserDetails(request);
  const loggedInUser = await getUsersProfile(
    loggedInUserDetails?.userName || ""
  );
  const requestedUserProfile = await getUsersProfile(params.userName || "");
  if (requestedUserProfile === null) throw new Error("user not found");
  const blogs = await fetchBlogs(requestedUserProfile.userName);
  return typedjson({ loggedInUser, requestedUserProfile, blogs });
}

export default function User() {
  const { loggedInUser, requestedUserProfile, blogs } =
    useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const isAuthorFollowed =
    requestedUserProfile.followers.filter(
      (follower) => follower.id === loggedInUser?.id
    ).length > 0
      ? true
      : false;

  function handleFollow() {
    const formData = new FormData();

    if (loggedInUser === null) return navigate("/signin");

    formData.set("authorId", requestedUserProfile.id);
    formData.set("followerId", loggedInUser.id);

    submit(formData, {
      method: "post",
    });
  }

  function getFollowers() {
    const followers = requestedUserProfile.followers.length;
    if (followers > 1) return `${followers} followers`;

    return `${followers} follower`;
  }

  return (
    <div>
      <Navbar
        user={
          loggedInUser
            ? {
                id: loggedInUser.id,
                firstName: loggedInUser.firstName,
                profile: {
                  userImage: loggedInUser.profile.userImage,
                },
                userName: loggedInUser.userName,
                notificationList: loggedInUser.notificationList,
              }
            : null
        }
      />

      <main className="mt-7 p-2">
        <div className="shadow rounded-2xl overflow-hidden pb-2">
          <Avatar
            userName={requestedUserProfile.userName}
            userImage={requestedUserProfile.profile.userImage}
          />
          <div className="px-6 flex flex-col gap-2">
            <div className="mb-5 flex justify-center gap-5">
              <span className="text-sm flex items-center gap-2">
                <FiMail size="1.5em" />
                {requestedUserProfile.email}
              </span>
              {requestedUserProfile.profile.location ? (
                <span className="text-sm capitalize flex items-center gap-2">
                  <GrLocation size="1.5em" />
                  {requestedUserProfile.profile.location}
                </span>
              ) : null}
              {requestedUserProfile.profile.education ? (
                <span className="text-sm capitalize flex items-center gap-2">
                  <IoSchool size="1.5em" />
                  {requestedUserProfile.profile.education}
                </span>
              ) : null}
            </div>

            <span className="capitalize font-bold text-2xl">
              {requestedUserProfile.firstName.concat(" ") +
                requestedUserProfile.lastName}
            </span>
            <span className="capitalize text-sm">{getFollowers()}</span>
            <span className="text-sm font-medium">
              {requestedUserProfile.userName}
            </span>
            {requestedUserProfile.profile.work ? (
              <span className="capitalize font-medium text-sm">
                {requestedUserProfile.profile.work}
              </span>
            ) : null}
            {loggedInUser?.id === requestedUserProfile.id ? (
              <button
                type="button"
                onClick={() => navigate("/user/profile")}
                className="w-max p-2 rounded-md tracking-wider shadow-md uppercase bg-blue-400 text-white font-medium text-sm outline-none ring ring-transparent focus:ring-blue-300"
              >
                edit profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollow}
                className="w-max p-2 rounded-md tracking-wider shadow-md uppercase bg-blue-400 text-white font-medium text-sm outline-none ring ring-transparent focus:ring-blue-300"
              >
                {isAuthorFollowed ? "unfollow" : "follow"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <h1 className="text-xl capitalize font-medium">recent blogs</h1>

          <div className="space-y-4">
            {blogs.map((blog, index) => (
              <BlogCard
                key={index}
                blog={blog}
                index={index}
                user={loggedInUser?.id ? { id: loggedInUser.id } : undefined}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Avatar(props: { userName: string; userImage: string | null }) {
  const { userName, userImage } = props;

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom left, #3a1c71, #d76d77, #ffaf7b)",
      }}
      className="mb-16 h-40 relative"
    >
      {/* <img
        src="/assets/earth.jpg"
        alt="user"
        className="object-cover "
      /> */}

      <div className="w-24 rounded-full aspect-square bg-black absolute left-6 bottom-0 translate-y-1/2 ring-4 ring-white">
        {userImage ? (
          <img src={userImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full text-white text-3xl uppercase font-medium flex items-center justify-center">
            {userName.at(0)}
          </div>
        )}
      </div>
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const authorId = formData.get("authorId");
  const followerId = formData.get("followerId");

  invariant(authorId && typeof authorId === "string", "authorId is missing");
  invariant(
    followerId && typeof followerId === "string",
    "followerId is missing"
  );

  return toggleUserFollowing(authorId, followerId);
}
