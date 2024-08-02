import { signIn } from "@/utils/auth";
import buttonStyles from "@/utils/styles/button";
import { LogIn } from "lucide-react";

export default async function Page() {
  return (
    <form
      action={async () => {
        "use server";

        await signIn("google", { redirectTo: "/" });
      }}
      className="flex flex-grow flex-col items-center justify-center gap-2"
    >
      <h2 className="text-text-md font-semibold md:text-text-lg">
        Please sign in.
      </h2>
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
  );
}
