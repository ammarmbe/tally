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
  onSubmit
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  saveButton?: ReactNode;
  cancelButton?: ReactNode;
  onSubmit?: () => void;
}) {
  const Component = onSubmit ? "form" : "div";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={twMerge(
            "sticky inset-0 top-0 z-[50] h-[100dvh] bg-black/30 backdrop-blur-sm"
          )}
        />
        <Dialog.Content className="group sticky inset-0 top-0 z-[60] flex h-[100dvh] items-center justify-center">
          <Component
            onSubmit={onSubmit}
            className={twMerge(
              "bg-primary relative flex h-fit w-full max-w-[calc(100dvw-4rem)] flex-col gap-8 rounded-xl p-6 shadow-xl md:max-w-96",
              "max-h-[70vh] overflow-auto transition-all group-data-[state=open]:animate-in group-data-[state=closed]:animate-out group-data-[state=closed]:fade-out-0 group-data-[state=open]:fade-in-0"
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
              {description ? (
                <Dialog.Description className="text-sm text-tertiary">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            {children}
            {cancelButton !== null && saveButton !== null ? (
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
            ) : null}
          </Component>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
