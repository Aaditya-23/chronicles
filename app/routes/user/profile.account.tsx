import { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { TextField } from "~/components";
import { changePassword } from "~/server/actions/user.server";
import { getUserDetails } from "~/utils/session.server";

export default function Account() {
  return (
    <Form method="post" className="space-y-3">
      <TextField
        label="Old password"
        type="password"
        name="oldPassword"
        placeholder="Old Password"
      />
      <TextField
        label="New password"
        type="password"
        name="newPassword"
        placeholder="New Password"
      />
      <TextField
        label="Comfirm password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
      />

      <button
        type="submit"
        className="p-2 rounded-md text-white font-semibold tracking-wider uppercase bg-blue-400 shadow-md"
      >
        change
      </button>
    </Form>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const userDetails = await getUserDetails(request);

  return changePassword(payload, userDetails?.id);
}
