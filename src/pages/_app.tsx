import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Raleway } from "@next/font/google";
import { Toaster } from "react-hot-toast";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const raleway = Raleway({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          font-family: ${raleway.style.fontFamily};
        }
      `}</style>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
