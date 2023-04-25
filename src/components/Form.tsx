import { trpc } from "../utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const Form = () => {
  const { data: session } = useSession();

  const { data: subscriptionStatus, isLoading } =
    trpc.user.subscriptionStatus.useQuery();

  const [message, setMessage] = useState("");
  const utils = trpc.useContext();

  const postMessage = trpc.post.postMessage.useMutation({
    // refetch messages after a message is added
    onSuccess() {
      void utils.post.getAllMessages.invalidate();
      toast.success("Message posted");
    },
    onError(e) {
      const errorMessage = e.data?.zodError?.fieldErrors.message;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong. Failed to post message.");
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not signed in</div>;
  }

  if (subscriptionStatus === "active") {
    return (
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          postMessage.mutate({
            userId: session?.user?.id as string,
            name: session?.user?.name as string,
            message,
          });
          setMessage("");
        }}
      >
        <input
          type="text"
          value={message}
          placeholder="Your message..."
          minLength={2}
          maxLength={100}
          onChange={(event) => setMessage(event.target.value)}
          className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
          disabled={message.length < 2 || postMessage.isLoading}
        >
          Submit
        </button>
      </form>
    );
  } else {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-center">
          You need an active{" "}
          <Link className="text-yellow-200 hover:text-yellow-400" href="/user">
            subscription
          </Link>{" "}
          to post or edit messages.
        </p>
      </div>
    );
  }
};

export default Form;
