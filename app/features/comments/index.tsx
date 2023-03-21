import { Prisma } from "@prisma/client";
import { Form, useSubmit } from "@remix-run/react";
import { FiHeart } from "react-icons/fi";
import { formatDate } from "~/utils/formatDate";

export default function Comments(props: CommentProps) {
  const { blogId, comments, userId } = props;

  return (
    <div className="pb-3 space-y-8">
      <span className="capitalize text-xl font-semibold">
        top comments {comments.length > 0 ? `(${comments.length})` : null}
      </span>

      <CommentTextArea blogId={blogId} />

      <ul className="space-y-6">
        {comments.map((comment, index) => (
          <UserComment key={index} userId={userId} comment={comment} />
        ))}
      </ul>
    </div>
  );
}

function UserComment(props: { comment: CommentsWithUser; userId?: string }) {
  const { comment, userId } = props;
  const submit = useSubmit();

  const isCommentLiked =
    comment.likes.filter((user) => user.id === userId).length > 0
      ? true
      : false;

  function handleLike(commentId: string) {
    const formData = new FormData();
    formData.set("_action", "like-comment");
    formData.set("commentId", commentId);
    submit(formData, {
      method: "post",
    });
  }

  function getLikes() {
    const likes = comment.likes.length;

    if (likes > 1) return `${likes} likes`;
    return `${likes} like`;
  }

  return (
    <li className="flex gap-3">
      <div className="w-10 self-start aspect-square rounded-full bg-black overflow-hidden">
        {comment.user.profile.userImage ? (
          <img src={comment.user.profile.userImage} alt="" />
        ) : (
          <div className="h-full w-full flex justify-center items-center text-white uppercase font-medium">
            {comment.user.firstName.at(0)}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="w-full px-3 py-2 outline outline-black/5 rounded-md">
          <span className="mr-2 font-medium">{comment.user.firstName}</span>
          <span className="text-xs">{formatDate(comment.updatedAt)}</span>
          <div className="mt-2">{comment.body}</div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleLike(comment.id)}>
            <FiHeart
              className={`${isCommentLiked && "fill-red-500"} text-red-500`}
            />
          </button>
          <span className="text-xs text-gray-500">{getLikes()} </span>
        </div>
      </div>
    </li>
  );
}

function CommentTextArea(props: { blogId: string }) {
  const { blogId } = props;

  return (
    <Form method="post" className="flex flex-col gap-4">
      <textarea
        name="body"
        placeholder="Add to the discussion"
        className="p-2 block w-full rounded outline outline-black/5"
      ></textarea>

      <input type="hidden" name="blogId" value={blogId} />

      <button
        type="submit"
        name="_action"
        value="comment"
        className="p-2 self-end rounded-md text-white text-sm font-medium tracking-wider uppercase bg-blue-400 shadow-md"
      >
        post
      </button>
    </Form>
  );
}

const commentsWithUser = Prisma.validator<Prisma.CommentArgs>()({
  include: {
    user: {
      include: {
        profile: true,
      },
    },
    likes: true,
  },
});

type CommentsWithUser = Prisma.CommentGetPayload<typeof commentsWithUser>;

type CommentProps = {
  userId?: string;
  blogId: string;
  comments: CommentsWithUser[];
};
