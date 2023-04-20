import type { FC } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export interface CommentProps {
  postId: string;
  userId: string;
}

const Comments: FC<CommentProps> = ({ postId, userId }): JSX.Element => {
  const { data: comments, isLoading } = trpc.post.getAllComments.useQuery();
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

  const handleComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    addComment.mutate({ postId: postId, message: comment });
    setComment("");
  };

  return (
    <div>
      <h1>- Comments -</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {comments?.map(
            (comment) =>
              comment.postId === postId && (
                <div key={comment.id}>
                  <p>{comment.message}</p>
                </div>
              )
          )}
        </div>
      )}
      {userId !== session?.user?.id && (
        <form onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </form>
      )}
    </div>
  );
};

export default Comments;
