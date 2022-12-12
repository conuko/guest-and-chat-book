import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Messages from "../components/Messages";
import Form from "../components/Form";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook</h1>
      <div className="pt-10">
        {session ? (
          <>
            <p>Hi {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
            <div className="pt-6">
              <Form />
            </div>
            <div className="pt-10">
              <Messages />
            </div>
          </>
        ) : (
          <button onClick={() => signIn("discord")}>Login with Discord</button>
        )}
      </div>
    </main>
  );
};

export default Home;
