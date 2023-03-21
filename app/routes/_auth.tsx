import { Form, Outlet, useLocation } from "@remix-run/react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { ClientOnly } from "remix-utils";
import SocialAuth from "~/features/socialAuth/index.client";

export default function AuthLayout() {
  return (
    <>
      <main className="w-1/2 flex flex-col items-center ">
        <div className="mt-5">
          <Header />
          <Outlet />
        </div>
      </main>

      <aside className="fixed top-0 bottom-0 left-1/2 right-0 bg-black">
        <img
          src="./assets/earth.jpg"
          alt="earth"
          className="h-full w-full object-contain"
        />
      </aside>
    </>
  );
}

function Header() {
  const heading = useLocation().pathname;

  return (
    <header className="mb-5 flex flex-col gap-5">
      <h1 className="text-2xl font-bold capitalize">
        {heading === "/signup" ? "join us" : "welcome back"}
      </h1>

      <Form method="post" action="/auth/google" className="flex flex-col gap-2">
        <ClientOnly>
          {() => (
            <OAuthButton value="google">
              continue with <FcGoogle size="1.5em" />
              <SocialAuth />
            </OAuthButton>
          )}
        </ClientOnly>

        <Divider />

        <OAuthButton value="github">
          continue with <BsGithub size="1.5em" />
        </OAuthButton>
      </Form>
    </header>
  );
}

function OAuthButton(props: { value: string; children: React.ReactNode }) {
  const { value, children } = props;

  return (
    <button
      type="submit"
      name="_action"
      value={value}
      className="p-2 w-full border rounded-md text-sm capitalize flex justify-center items-center gap-1 ring ring-transparent focus:ring-blue-300 outline-none"
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div className="w-11/12 self-center flex items-center gap-1 text-sm text-gray-400 before:flex-1 before:bg-gray-300 before:h-px before:rounded after:flex-1 after:bg-gray-300 after:h-px after:rounded ">
      or
    </div>
  );
}
