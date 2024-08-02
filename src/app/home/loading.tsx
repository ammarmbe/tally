import Skeleton from "@/components/skeleton";

export default function Loading() {
  return (
    <div
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
      }}
      className="grid gap-4 overflow-hidden p-8"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-56 flex-grow rounded-xl" />
      ))}
    </div>
  );
}
