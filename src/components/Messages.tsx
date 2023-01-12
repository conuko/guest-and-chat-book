import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import ReactModal from "react-modal";
import { useState } from "react";

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery();
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messageId, setMessageId] = useState("");

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

  const handleOnClick = (value: string) => {
    setMessageId(value);
    setModalIsOpen(true);
  };

  const handleOnClose = () => {
    setMessageId("");
    setModalIsOpen(false);
  };

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        /* 
        if the message belongs to the user,
        make it possible to click and edit message and show delete button:
        */
        return msg.userId === session?.user?.id ? (
          <button
            className="flex items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6 hover:border-zinc-500"
            key={index}
            onClick={() => handleOnClick(msg.id)}
          >
            <div>
              <p>{msg.message}</p>
              <span className="text-gray-400">- {msg.name}</span>
            </div>
            <div>
              <button
                className="z-50 pl-5 text-red-400 hover:text-red-500"
                onClick={() => handleDelete(msg.id)}
              >
                X
              </button>
            </div>
          </button>
        ) : (
          /* 
           if the message does not belong to the user, just display the message:
          */
          <div
            className="flex items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6"
            key={index}
          >
            <div>
              <p>{msg.message}</p>
              <span className="text-gray-400">- {msg.name}</span>
            </div>
          </div>
        );
      })}
      {deleteMessage.error && (
        <p>Something went wrong! {deleteMessage.error.message}</p>
      )}

      {/* 
      The modal that opens when you click on a message:
      */}
      <ReactModal
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 top-0 left-0"
        className="flex items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6"
        isOpen={modalIsOpen}
      >
        <div>
          {messages?.map((msg, index) => {
            return msg.id === messageId ? (
              <div key={index}>
                <p>{msg.message}</p>
                <span className="text-gray-400">- {msg.name}</span>
              </div>
            ) : null;
          })}
          <button onClick={() => handleOnClose()}>Close</button>
        </div>
      </ReactModal>
    </div>
  );
};

export default Messages;
