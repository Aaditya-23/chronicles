import { Editor, Header } from "~/features/writeBlog";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { getUserDetails, requireUserSession } from "~/utils/session.server";
import { postBlog } from "~/server/actions/blog.server";
import { getAllTags } from "~/server/models/tag.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ request }: LoaderArgs) {
  await requireUserSession(request);
  const tags = await getAllTags();
  return typedjson(tags, { status: 200 });
}

export default function Write() {
  const tags = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <Header />
      <main className="mx-auto w-9/12 ">
        <Editor tags={tags} />
      </main>
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const user = await getUserDetails(request);
  return postBlog(payload, user);
}
