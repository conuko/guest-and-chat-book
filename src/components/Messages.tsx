import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import ReactModal from "react-modal";
import { useState } from "react";

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery();
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [message, setMessage] = useState("");

  const utils = trpc.useContext();

  const deleteMessage = trpc.guestbook.deleteMessage.useMutation({
    // refetch messages after a message is deleted
    async onSuccess() {
      await utils.guestbook.getAll.invalidate();
    },
  });

  const updateMessage = trpc.guestbook.updateMessage.useMutation({
    async onSuccess() {
      await utils.guestbook.getAll.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    deleteMessage.mutate({ id: id });
  };

  const handleOnClick = (value: string) => {
    setMessageId(value);
    setModalIsOpen(true);

    /* 
    add the message to the state, when the message id matches
    the id of the message that was clicked:
    */
    messages?.map((msg) => {
      msg.id === value && setMessage(msg.message);
    });
  };

  const handleOnClose = () => {
    setMessageId("");
    setMessage("");
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
          <div
            className="flex cursor-pointer items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6 hover:border-zinc-500"
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
          </div>
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
      <ReactModal
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 top-0 left-0"
        className="flex items-center justify-between gap-2 rounded-md border-2 border-zinc-800 p-6"
        isOpen={modalIsOpen}
        ariaHideApp={false}
      >
        <div>
          {messages?.map((msg, index) => {
            return msg.id === messageId ? (
              <div key={index}>
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    updateMessage.mutate({ id: messageId, message: message });
                    handleOnClose();
                  }}
                >
                  <input
                    type="text"
                    value={message}
                    minLength={2}
                    maxLength={100}
                    onChange={(event) => setMessage(event.target.value)}
                    className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
                  >
                    Edit
                  </button>
                </form>

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
