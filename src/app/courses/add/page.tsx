import Header from "@/components/Header";
import { Suspense } from "react";
import AddCourse from "@/components/courses/add/AddCourse";
import Spinner from "@/components/Spinner";

export default function Page() {
  return (
    <main>
      <Header />
      <Suspense
        fallback={
          <section className="flex h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-32 text-center">
            <Spinner size="lg" />
          </section>
        }
      >
        <AddCourse />
      </Suspense>
    </main>
  );
}
