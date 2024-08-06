import dayjs from "dayjs";
import { redirect } from "next/navigation";

export default function Page() {
  return redirect(`/date/${dayjs().format("YYYY-MM-DD")}`);
}
