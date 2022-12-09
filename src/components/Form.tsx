import { trpc } from "../utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Form = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const utils = trpc.useContext();
  const postMessage = trpc.guestbook.postMessage.useMutation({
    onMutate: () => {
      utils.guestbook.getAll.cancel();
      const optimisticUpdate = utils.guestbook.getAll.getData();

      if (optimisticUpdate) {
        utils.guestbook.getAll.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.guestbook.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postMessage.mutate({
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
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
