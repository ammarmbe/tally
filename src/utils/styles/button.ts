import { twMerge } from "tailwind-merge";

const sizes = {
  xl: {
    default: "py-3 px-[1.125rem] !text-text-md gap-2.5",
    symmetrical: "p-3 !text-text-md gap-2.5"
  },
  lg: {
    default: "py-2.5 px-4 !text-text-md gap-2.5",
    symmetrical: "p-2.5 !text-text-md gap-2.5"
  },
  md: {
    default: "py-2.5 px-3.5 !text-text-sm gap-2",
    symmetrical: "p-2.5 !text-text-sm gap-2"
  },
  sm: {
    default: "py-2 px-3 !text-text-sm gap-2",
    symmetrical: "p-2 !text-text-sm gap-2"
  }
};

const variants = {
  default: {
    primary:
      "bg-brand-solid border-transparent text-primary_on-brand shadow-xs hover",
    secondary: "bg-primary border-primary text-secondary shadow-xs hover",
    tertiary:
      "bg-primary border-transparent text-secondary shadow-xs hover disabled:!bg-transparent disabled:!border-transparent"
  },
  danger: {
    primary:
      "bg-error-solid border-transparent text-primary_on-brand shadow-xs hover",
    secondary:
      "bg-primary hover:bg-error-secondary border-error_subtle text-error-primary shadow-xs",
    tertiary:
      "bg-primary hover:bg-error-secondary border-transparent text-error-primary shadow-xs"
  }
};

const dropdownStyles = {
  default: {
    primary: "active:shadow-focus-ring-shadow-xs active",
    secondary: "active:shadow-focus-ring-shadow-xs active",
    tertiary: "active:shadow-focus-ring-shadow-xs active"
  },
  danger: {
    primary: "active:shadow-focus-ring-error-shadow-xs active",
    secondary: "active:bg-primary active:shadow-focus-ring-error-shadow-xs",
    tertiary: "active:bg-primary active:shadow-focus-ring-error-shadow-xs"
  }
};

const buttonStyles = (
  {
    size = "md",
    variant = "secondary",
    danger = false,
    symmetrical = false,
    dropdown = false
  }: {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "tertiary";
    danger?: boolean;
    symmetrical?: boolean;
    dropdown?: boolean;
  } = {},
  className?: string
) =>
  twMerge(
    "rounded-md flex items-center justify-center font-semibold disabled:!text-disabled disabled:!border-disabled disabled:!bg-disabled disabled:!shadow-none border transition-all h-fit",
    sizes[size][symmetrical ? "symmetrical" : "default"],
    variants[danger ? "danger" : "default"][variant],
    !dropdown
      ? dropdownStyles[danger ? "danger" : "default"][variant]
      : "!rounded-none !border-none",
    className
  );

export default buttonStyles;
