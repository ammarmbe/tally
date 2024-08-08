"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return router.replace(`/date/${dayjs().format("YYYY-MM-DD")}`);
}
