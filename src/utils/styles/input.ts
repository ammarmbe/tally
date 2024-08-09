import { twMerge } from "tailwind-merge";

export const inputStyles = (
  {
    size = "md",
    error = false
  }: {
    size?: "sm" | "md";
    error?: boolean;
  } = {},
  className?: string
) =>
  twMerge(
    "appearance-none rounded-md h-fit disabled:!text-disabled disabled:!border-disabled disabled:!bg-disabled disabled:!shadow-none border transition-all shadow-xs placeholder:text-placeholder bg-primary resize-none",
    size === "sm" ? "py-2 px-3 text-text-md" : "py-2.5 px-3.5 text-text-md",
    error
      ? "focus:shadow-focus-ring-error-shadow-xs border-error-solid"
      : "focus:shadow-focus-ring-shadow-xs border-primary",
    className
  );

export const labelStyles = (
  { required = false }: { required?: boolean } = {},
  className?: string
) =>
  twMerge(
    "text-secondary font-medium text-text-sm",
    required ? "after:content-['_*'] after:text-brand-tertiary" : undefined,
    className
  );

export const errorStyles = "text-text-sm text-red-500";
