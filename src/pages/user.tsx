import type { NextPage, GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";
import Link from "next/link";
import Image from "next/image";

const SignoutButton = () => {
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-red-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-red-600"
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign out
    </button>
  );
};

const UpgradeButton = () => {
  const { mutateAsync: createCheckoutSession } =
    trpc.stripe.createCheckoutSession.useMutation();
  const { push } = useRouter();
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          push(checkoutUrl);
        }
      }}
    >
      Upgrade account
    </button>
  );
};

const ManageBillingButton = () => {
  const { mutateAsync: createBillingPortalSession } =
    trpc.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
      onClick={async () => {
        const { billingPortalUrl } = await createBillingPortalSession();
        if (billingPortalUrl) {
          push(billingPortalUrl);
        }
      }}
    >
      Manage subscription and billing
    </button>
  );
};

const User: NextPage = () => {
  const { data: session, status } = useSession();

  const { data: subscriptionStatus, isLoading } =
    trpc.user.subscriptionStatus.useQuery();

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
          <SignoutButton />
          {!isLoading && subscriptionStatus !== null && (
            <>
              <p className="text-xl text-gray-700">
                Your subscription is {subscriptionStatus}.
              </p>
              <ManageBillingButton />
            </>
          )}
          {!isLoading && subscriptionStatus === null && (
            <>
              <p className="text-xl text-gray-700">You are not subscribed!!!</p>
              <UpgradeButton />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default User;
