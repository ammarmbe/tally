import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-8 pb-0 text-display-xs font-semibold md:text-display-sm">
        Add Course
      </h1>
      {children}
    </main>
  );
}
