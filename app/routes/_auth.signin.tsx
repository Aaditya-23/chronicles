import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useNavigation } from "@remix-run/react";
import { TextField } from "~/features/form";
import { signIn } from "~/server/actions/user.server";

export default function Signin() {
  const navigation = useNavigation();

  return (
    <>
      <Form method="post" className="flex flex-col gap-2">
        <div className="flex gap-2">
          <TextField
            label="Email"
            name="email"
            placeholder="you@mail.com"
            type="email"
            required
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          name="_action"
          value="signup"
          className="self-end p-2 uppercase text-white font-semibold rounded-md shadow-md bg-blue-400"
          disabled={navigation.state !== "idle"}
        >
          sign in
        </button>
      </Form>

      <p className="mt-4 text-end capitalize text-sm text-gray-400">
        don't have an account?
        <Link className="text-blue-400 underline font-medium" to="/signup">
          Signup
        </Link>
      </p>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  return signIn(payload);
}
