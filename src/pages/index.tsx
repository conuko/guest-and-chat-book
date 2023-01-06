import { type NextPage } from "next";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Messages from "../components/Messages";
import Form from "../components/Form";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  console.log(session?.user?.name?.split(" ")[0]);
  console.log(session?.user?.image);
  console.log(session?.user?.email);

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook</h1>
      <div className="pt-10">
        {session ? (
          <>
            <div className="flex items-center justify-between">
              <p>
                Hi{" "}
                <Link
                  className="text-yellow-200 hover:text-yellow-400"
                  href="/user"
                >
                  {session.user?.name}
                </Link>
              </p>
              <button
                className="p-2 text-red-400 hover:text-red-500 focus:outline-none"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
            <div className="pt-6">
              <Form />
            </div>
            <div className="pt-10">
              <Messages />
            </div>
          </>
        ) : (
          <div>
            <button
              className="flex items-center justify-between gap-4 rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
              onClick={() => signIn("discord")}
            >
              Login with
              <Image
                src="/discord.svg"
                alt="Discord logo"
                width={32}
                height={32}
              />
            </button>
            <button
              className="mt-4 flex items-center justify-between gap-4 rounded-md border-2 border-white bg-white p-2 text-black focus:outline-none"
              onClick={() => signIn("github")}
            >
              Login with
              <Image
                src="/github.svg"
                alt="GitHub logo"
                width={32}
                height={32}
              />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
