import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/styles/app.css";
import reactQuill from "react-quill/dist/quill.snow.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chronicles",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: reactQuill },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
