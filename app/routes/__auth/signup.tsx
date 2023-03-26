import { useEffect, useState } from "react";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { TextField } from "~/features/form";
import { signUp } from "~/server/actions/user.server";

export default function Signup() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  const [errors, setErrors] = useState({
    firstName: data?.errors?.firstName,
    lastName: data?.errors?.lastName,
    email: data?.errors?.email,
    userName: data?.errors?.userName,
    password: data?.errors?.password,
    confirmPassword: data?.errors?.confirmPassword,
  });

  useEffect(() => {
    if (data === undefined) return;

    setErrors({
      firstName: data.errors?.firstName,
      lastName: data.errors?.lastName,
      email: data.errors?.email,
      userName: data.errors?.userName,
      password: data.errors?.password,
      confirmPassword: data.errors?.confirmPassword,
    });
  }, [data]);

  return (
    <>
      <Form method="post" className="flex flex-col gap-2 ">
        <div className="flex gap-2">
          <TextField
            label="First Name"
            name="firstName"
            placeholder="your first name"
            error={errors.firstName ? errors.firstName : undefined}
            onChange={() =>
              setErrors((prev) => ({ ...prev, firstName: undefined }))
            }
            required
          />

          <TextField
            label="Last Name"
            name="lastName"
            placeholder="your last name"
            error={errors.lastName ? errors.lastName : undefined}
            onChange={() =>
              setErrors((prev) => ({ ...prev, lastName: undefined }))
            }
            required
          />
        </div>

        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email ? errors.email : undefined}
          onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          required
        />

        <TextField
          label="Username"
          name="userName"
          placeholder="Choose a unique username"
          error={errors.userName ? errors.userName : undefined}
          onChange={() =>
            setErrors((prev) => ({ ...prev, userName: undefined }))
          }
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="Choose a strong password"
          error={errors.password ? errors.password : undefined}
          onChange={() =>
            setErrors((prev) => ({ ...prev, password: undefined }))
          }
          required
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword ? errors.confirmPassword : undefined}
          onChange={() =>
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
          }
          required
        />

        <button
          type="submit"
          name="_action"
          value="signup"
          className="self-end p-2 uppercase text-white font-semibold rounded-md shadow-md bg-blue-400"
          disabled={navigation.state !== "idle"}
        >
          sign up
        </button>
      </Form>

      <p className="mt-4 text-end capitalize text-sm text-gray-400">
        already have an account?
        <Link className="text-blue-400 underline font-medium" to="/signin">
          Signin
        </Link>
      </p>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const _action = formData.get("_action");

  invariant(typeof _action === "string", "_action is required");
  invariant(_action === "signup", "invalid _action type");

  return signUp(payload);
}
