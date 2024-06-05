import { redirect } from "next/navigation";

export default async function Page() {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`);

  redirect("/");

  return <div></div>;
}
