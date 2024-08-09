import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import LowAttendance from "./low-attendance";
import ClassUpcoming from "./class-upcoming";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        Settings
      </h1>
      <div className="flex flex-col gap-5 p-4 sm:p-8">
        <ClassUpcoming user={session.user} />
        <div className="border-t" />
        <LowAttendance user={session.user} />
      </div>
    </main>
  );
}
