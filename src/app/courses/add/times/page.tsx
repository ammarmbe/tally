import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import AddCourseTimes from "@/components/courses/add/AddCourseTimes";
import { Suspense } from "react";

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
        <AddCourseTimes />
      </Suspense>
    </main>
  );
}
