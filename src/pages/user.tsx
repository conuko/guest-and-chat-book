import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const User: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  if (!session) {
    return <main>You are not signed in, please sign in first</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook User</h1>
      <div className="pt-10">
        <div className="flex items-center justify-between">
          <p>Hi {session.user?.name}</p>
          <button className="p-2 text-red-400 hover:text-red-500 focus:outline-none">
            <Link href="/">Return</Link>
          </button>
        </div>
        <div className="mt-10">
          <Image
            className="mb-4"
            src={`${session.user?.image}`}
            width={48}
            height={48}
            alt="User Image"
          ></Image>
          <p>
            Username: <p className="text-yellow-200">{session.user?.name}</p>
          </p>
          <p>
            Email: <p className="text-yellow-200">{session.user?.email}</p>
          </p>
        </div>
      </div>
    </main>
  );
};

export default User;
