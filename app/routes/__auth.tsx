import { Outlet, useLocation } from "@remix-run/react";

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
    </header>
  );
}
