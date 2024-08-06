import buttonStyles from "@/utils/styles/button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="relative flex h-dvh flex-grow flex-col overflow-x-hidden">
        <div className="flex h-dvh flex-none flex-col">
          <div className="flex flex-none items-center justify-center pt-8">
            <Image src="/logo.svg" alt="Tally logo" height={32} width={23} />
          </div>
          <div className="flex flex-grow flex-col items-center justify-center gap-5 px-5 pb-[35vh] text-center">
            <h1 className="text-display-sm font-semibold sm:text-display-lg">
              Effortlessly Track and Manage Attendance with Tally
            </h1>
            <p className="text-secondary text-text-lg sm:text-text-xl">
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
          <div className="absolute right-1/2 top-full h-[90vh] w-[69vh] -translate-y-[40%] translate-x-1/2 sm:right-0 sm:top-1/2 sm:translate-x-[calc(40%-5vw)]">
            <Image src="/logo.svg" alt="Tally logo" fill />
          </div>
        </div>
        <footer className="text-tertiary p-2 pt-[70vh] text-center text-text-sm">
          <p>
            &copy; {new Date().getFullYear()} Tally. All rights reserved.{" "}
            <Link className="underline underline-offset-2" href="/privacy">
              Privacy policy
            </Link>
            .
          </p>
        </footer>
      </div>
    </>
  );
}
