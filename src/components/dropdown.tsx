import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Dropdown({
  open,
  onOpenChange,
  trigger,
  children,
  className,
  align
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "center" | "start" | "end";
}) {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={twMerge(
          "bg-primary mt-2 flex flex-col overflow-hidden rounded-md border shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        align={align}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
