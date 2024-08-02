import { twMerge } from "tailwind-merge";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={twMerge("bg-disabled inline-block animate-pulse", className)}
      {...props}
    />
  );
}
