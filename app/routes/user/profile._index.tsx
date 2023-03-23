import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { TextField } from "~/components";
import { useUser } from "./profile";
import { getUserDetails } from "~/utils/session.server";
import { updateUserProfile } from "~/server/actions/user.server";

export default function Profile() {
  const user = useUser();

  return (
    <Form method="post" className="flex flex-col gap-3">
      <button
        type="button"
        className="w-16 aspect-square self-center bg-black rounded-full relative group text-2xl font-bold outline-none overflow-hidden"
      >
        {user.profile.userImage ? (
          <img
            src="/assets/earth.jpg"
            alt="avatar"
            className="w-full aspect-square"
          />
        ) : (
          <span className="w-full aspect-square flex justify-center items-center uppercase text-white">
            {user.userName.at(0)}
          </span>
        )}
      </button>

      <div className="flex gap-3">
        <TextField
          label="First Name"
          placeholder="your first name"
          defaultValue={user.firstName}
          name="firstName"
        />
        <TextField
          label="Last Name"
          placeholder="your last name"
          defaultValue={user.lastName}
          name="lastName"
        />
      </div>
      <TextField label="Email" type="email" disabled value={user.email} />
      <TextField label="Username" disabled value={user.userName} />
      <TextField
        label="Location"
        placeholder="New Delhi, India"
        defaultValue={user.profile.location || ""}
        name="location"
      />
      <TextField
        label="Bio"
        placeholder="tell us about yourself"
        defaultValue={user.profile.bio || ""}
        name="bio"
      />
      <div className="flex gap-3">
        <TextField
          label="Work"
          placeholder="what do you do?"
          defaultValue={user.profile.work || ""}
          name="work"
        />
        <TextField
          label="Education"
          placeholder="your school"
          defaultValue={user.profile.education || ""}
          name="education"
        />
      </div>
      <button
        type="submit"
        className="p-2 self-end rounded-md shadow-md font-medium uppercase tracking-wider bg-blue-400 text-white ring ring-transparent focus:ring-blue-300"
      >
        save
      </button>
    </Form>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const userDetails = await getUserDetails(request);

  return updateUserProfile(payload, userDetails?.id || "");
}
