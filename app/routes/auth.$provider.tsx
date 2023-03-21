import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
    return {}
}

export async function action({ request }: ActionArgs) {}
