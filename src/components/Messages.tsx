import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery();
  const { data: session } = useSession();

  // delete message
  const utils = trpc.useContext();

  const deleteMessage = trpc.guestbook.deleteMessage.useMutation({
    async onSuccess() {
      // refetches messages after a message is deleted
      await utils.guestbook.getAll.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    deleteMessage.mutate({ id: id });
  };

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        return (
          <div
            className="flex items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6"
            key={index}
          >
            <div>
              <p>{msg.message}</p>
              <span className="text-gray-400">- {msg.name}</span>
            </div>
            {msg.userId === session?.user?.id && (
              <div>
                <button
                  className="pl-5 text-red-400 hover:text-red-500"
                  onClick={() => handleDelete(msg.id)}
                >
                  X
                </button>
              </div>
            )}
          </div>
        );
      })}
      {deleteMessage.error && (
        <p>Something went wrong! {deleteMessage.error.message}</p>
      )}
    </div>
  );
};

export default Messages;
