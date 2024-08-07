import buttonStyles from "@/utils/styles/button";
import Image from "next/image";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";

export default function Page() {
  return (
    <div className="flex flex-grow flex-col overflow-x-hidden">
      <div className="grid flex-none gap-y-20 lg:h-dvh lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-8 px-5 pt-32 text-center lg:pt-0">
          <h1
            className={`max-w-[50rem] text-display-sm font-semibold md:text-display-lg ${GeistSans.className}`}
          >
            Effortlessly Track and Manage Attendance with Tally
          </h1>
          <p
            className={`text-secondary max-w-[50rem] text-text-lg md:text-text-xl ${GeistSans.className}`}
          >
            Tally is a simple attendance tracker that helps you keep track of
            attendance for your courses and classes.
          </p>
          <Link
            href="/"
            className={buttonStyles(
              {
                size: "md",
                variant: "primary"
              },
              "mt-3"
            )}
          >
            Go to app
          </Link>
        </div>
        <div className="relative mb-20 h-[70vh] w-full max-w-[70vw] self-center justify-self-center lg:mb-0">
          <Image src="/logo.svg" alt="Tally logo" fill />
        </div>
      </div>
      <footer className="text-tertiary p-2 text-center text-text-sm">
        <p>
          &copy; {new Date().getFullYear()} Tally. All rights reserved.{" "}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
