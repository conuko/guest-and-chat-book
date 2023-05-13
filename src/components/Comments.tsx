import type { FC } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface CommentProps {
  postId: string;
  userId: string;
}

const Comments: FC<CommentProps> = ({ postId, userId }): JSX.Element => {
  const { data: comments, isLoading } = trpc.post.getAllComments.useQuery();
  const { data: subscriptionStatus } = trpc.user.subscriptionStatus.useQuery();
  const { data: session } = useSession();

  const [comment, setComment] = useState("");

  const utils = trpc.useContext();

  const addComment = trpc.post.addComment.useMutation({
    onSuccess() {
      void utils.post.getAllComments.invalidate();
      toast.success("Comment added.");
    },
    onError(e) {
      const errorMessage = e.data?.zodError?.fieldErrors.message;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to add comment.");
      }
    },
  });

  const deleteComment = trpc.post.deleteComment.useMutation({
    onSuccess() {
      void utils.post.getAllComments.invalidate();
      toast.success("Comment deleted.");
    },
    onError() {
      toast.error("Failed to delete comment.");
    },
  });

  const handleComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    addComment.mutate({ postId: postId, message: comment });
    setComment("");
  };

  const handleDelete = async (id: string) => {
    deleteComment.mutate({ id: id });
  };

  return (
    <div>
      {userId !== session?.user?.id && subscriptionStatus === "active" && (
        <form onSubmit={handleComment} className="flex gap-2">
          <input
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="rounded-md bg-zinc-800 px-4 py-2 text-white"
            disabled={comment.length < 1 || comment.length > 100}
          >
            Comment
          </button>
        </form>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {comments?.map(
            (comment) =>
              comment.postId === postId && (
                <div
                  key={comment.id}
                  className="flex items-center justify-between rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2"
                >
                  <div className="flex flex-col">
                    <p>{comment.message}</p>
                    <div className="flex gap-1">
                      <span className="text-gray-400">
                        @{comment.user.name}
                      </span>
                      <span className="font-bold text-gray-400">
                        · {dayjs(comment.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {comment.userId === session?.user?.id &&
                    subscriptionStatus === "active" && (
                      <div>
                        <button
                          className="z-50 pl-5 text-red-400 hover:text-red-500"
                          onClick={() => handleDelete(comment.id)}
                        >
                          X
                        </button>
                      </div>
                    )}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
