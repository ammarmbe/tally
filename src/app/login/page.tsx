import { auth, signIn } from "@/utils/auth";
import buttonStyles from "@/utils/styles/button";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (session?.user) return redirect("/");

  return (
    <main className="flex flex-grow flex-col">
      <div className="flex flex-none items-center justify-center py-8">
        <Image src="/logo.svg" alt="Tally logo" height={32} width={23} />
      </div>
      <form
        action={async () => {
          "use server";

          await signIn("google", { redirectTo: "/" });
        }}
        className="flex flex-grow flex-col items-center justify-center gap-2"
      >
        <h2 className="text-text-lg font-semibold">Please sign in.</h2>
        <p className="text-secondary text-text-md">
          You need to sign in to use Tally.
        </p>
        <button
          type="submit"
          className={buttonStyles(
            {
              size: "sm",
              variant: "primary"
            },
            "mt-4"
          )}
        >
          <LogIn size={16} /> Sign in
        </button>
      </form>
    </main>
  );
}
