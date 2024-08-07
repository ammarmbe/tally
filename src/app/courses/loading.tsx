import Skeleton from "@/components/skeleton";

export default function Loading() {
  return (
    <div
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
      }}
      className="grid gap-4 overflow-hidden p-4 sm:sm:p-8"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="text-secondary flex h-full flex-col rounded-xl border p-4 shadow-xs transition-all"
        >
          <div className="flex flex-grow flex-col">
            <Skeleton className="h-7 w-44 rounded-md" />
            <Skeleton className="mt-3 h-5 w-32 rounded-sm" />
            <Skeleton className="mt-2 h-5 w-24 rounded-sm" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
