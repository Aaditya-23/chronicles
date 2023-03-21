import type { Tag } from "@prisma/client";
import { Form, useNavigation, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { ClientOnly } from "remix-utils";
import QuillEditor from "./quillEditor.client";
import { Popover } from "@headlessui/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function Editor(props: EditorProps) {
  const { tags } = props;
  const [body, setBody] = useState("");
  const [blogTags, setBlogTags] = useState<Array<string>>([]);
  const submit = useSubmit();
  const navigation = useNavigation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("body", body);
    formData.set("tags", blogTags.join(","));
    submit(formData, {
      method: "post",
    });
  }

  return (
    //TODO: change fallback ui
    <ClientOnly fallback={<>Loading</>}>
      {() => (
        <>
          <Form
            id="new-blog"
            onSubmit={handleSubmit}
            className="ring-2 rounded-md shadow ring-black/5 flex flex-col gap-7 overflow-hidden"
          >
            <input
              type="text"
              name="title"
              placeholder="Title..."
              className="py-2 px-10 text-5xl outline-none font-bold"
              required
            />

            <div className="px-10">
              <Combobox
                blogTags={blogTags}
                setBlogTags={setBlogTags}
                tags={tags}
              />
            </div>

            <QuillEditor value={body} setValue={(value) => setBody(value)} />
          </Form>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              form="new-blog"
              disabled={navigation.state !== "idle"}
              className="p-2 rounded-md text-white font-semibold tracking-wider uppercase bg-blue-400 shadow-md"
            >
              post
            </button>
          </div>
        </>
      )}
    </ClientOnly>
  );
}

function Combobox(props: ComboboxProps) {
  const { blogTags, setBlogTags, tags } = props;

  const [query, setQuery] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag.title.includes(query.toLowerCase().trim())
  );

  function toggleTag(tag: string) {
    const index = blogTags.findIndex((element) => element === tag);
    
    if (index === -1) {
      setBlogTags([...blogTags, tag]);
      return;
    }

    const list = blogTags.slice(0, index).concat(blogTags.slice(index + 1));
    setBlogTags(list);
  }

  return (
    <Popover className="relative">
      <Popover.Button
        as="div"
        tabIndex={0}
        className="w-max p-2 flex gap-2 text-xs outline-none cursor-pointer"
      >
        {blogTags.length > 0 ? (
          blogTags.map((tag, index) => (
            <div
              key={index}
              className="p-1 flex items-center gap-1 rounded-md bg-gray-200"
            >
              #{tag}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleTag(tag);
                }}
                className="hover:text-red-600"
              >
                <AiOutlineClose />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-600">Add upto four tags...</span>
        )}
      </Popover.Button>

      <Popover.Panel className="mt-2 p-2 absolute z-10 w-max bg-white outline outline-black/5 shadow-md rounded-md">
        <input
          type="text"
          placeholder="search..."
          className="outline outline-black/5 rounded-md text-xs p-1  "
          onChange={(event) => setQuery(event.target.value)}
        />

        <ul className="mt-2">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag, index) => (
              <li
                key={index}
                className="p-1 text-xs text-gray-500 flex items-center gap-2 rounded hover:bg-blue-400 hover:text-white cursor-pointer"
                onClick={(event) => toggleTag(tag.title)}
              >
                <AiOutlineCheck
                  className={`${
                    blogTags.includes(tag.title) ? "opacity-100" : "opacity-0"
                  }`}
                />
                {tag.title}
              </li>
            ))
          ) : (
            <li
              className="p-1 text-xs text-gray-500 flex items-center gap-2 rounded hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={(event) => toggleTag(query)}
            >
              <AiOutlineCheck
                className={`${
                  blogTags.includes(query) ? "opacity-100" : "opacity-0"
                }`}
              />

              {query}
            </li>
          )}
        </ul>
      </Popover.Panel>
    </Popover>
  );
}

type EditorProps = {
  tags: Tag[];
};

type ComboboxProps = {
  blogTags: Array<string>;
  setBlogTags(blogTags: ComboboxProps["blogTags"]): void;
  tags: Tag[];
};
