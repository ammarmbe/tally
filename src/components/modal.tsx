import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import buttonStyles from "@/utils/styles/button";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Modal({
  open,
  onOpenChange,
  trigger,
  children,
  title,
  description,
  saveButton,
  cancelButton,
  action
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  saveButton?: ReactNode;
  cancelButton?: ReactNode;
  action?: (payload: FormData) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={twMerge(
            "absolute inset-0 z-10 bg-black/30 backdrop-blur-sm"
          )}
        />
        <Dialog.Content className="group absolute inset-0 flex items-center justify-center">
          <form
            action={action}
            className={twMerge(
              "bg-primary relative z-20 flex h-fit w-full max-w-[calc(100dvw-4rem)] flex-col gap-8 rounded-xl p-6 shadow-xl md:max-w-96",
              "transition-all group-data-[state=open]:animate-in group-data-[state=closed]:animate-out group-data-[state=closed]:fade-out-0 group-data-[state=open]:fade-in-0"
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-5">
                <Dialog.Title className="truncate text-text-lg font-semibold">
                  {title}
                </Dialog.Title>
                <Dialog.Close
                  className={buttonStyles({
                    size: "sm",
                    variant: "tertiary",
                    symmetrical: true
                  })}
                >
                  <X size={20} />
                </Dialog.Close>
              </div>
              <Dialog.Description className="text-sm text-tertiary">
                {description}
              </Dialog.Description>
            </div>
            {children}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cancelButton ?? (
                <Dialog.Close asChild>
                  <button
                    className={buttonStyles({
                      size: "md",
                      variant: "secondary"
                    })}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              )}
              {saveButton ?? (
                <button
                  className={buttonStyles({
                    size: "md",
                    variant: "primary"
                  })}
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
