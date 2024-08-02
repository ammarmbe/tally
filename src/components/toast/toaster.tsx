"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/toast/toast";
import { useToast } from "@/components/toast/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        close = true,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start justify-between gap-5">
              <div className="flex flex-col gap-1">
                {title ? <ToastTitle>{title}</ToastTitle> : null}
                {description ? (
                  <ToastDescription>{description}</ToastDescription>
                ) : null}
              </div>
              {close ? <ToastClose /> : null}
            </div>
            {action ? <div className="mt-2">{action}</div> : null}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
