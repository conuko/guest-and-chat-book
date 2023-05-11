import type { NextPage, GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";
import Link from "next/link";
import Image from "next/image";
import Address from "../components/Address";

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
        <div className="mt-10 mb-10">
          <Image
            className="mb-4"
            src={`${session.user?.image}`}
            width={48}
            height={48}
            alt="User Image"
          ></Image>
          <div>
            Username: <p className="text-yellow-200">{session.user?.name}</p>
          </div>
          <div>
            Email:{" "}
            <p className="mb-10 text-yellow-200">{session.user?.email}</p>
          </div>
          <Address />
          {!isLoading && subscriptionStatus !== null && (
            <>
              <div className="mt-5 mb-2 flex flex-col gap-2 text-xl">
                <p>
                  {subscriptionStatus === "active" &&
                    "✅ You are subscribed ✅"}
                </p>
                <p>Your subscription is {subscriptionStatus}.</p>
              </div>
              <ManageBillingButton />
            </>
          )}
          {!isLoading && subscriptionStatus === null && (
            <>
              <p className="mt-5 mb-2 text-xl">⛔ You are not subscribed ⛔</p>
              <UpgradeButton />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

// use getServerSideProps to get the session object and redirect the user if they are not authenticated
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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
