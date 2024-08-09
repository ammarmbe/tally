"use client";

import buttonStyles from "@/utils/styles/button";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

export default function Drawer({
  trigger,
  children,
  close
}: {
  trigger: ReactNode;
  children: ReactNode;
  close?: boolean;
}) {
  return (
    <DrawerPrimitive.Root direction="right" shouldScaleBackground>
      <DrawerPrimitive.Trigger asChild>{trigger}</DrawerPrimitive.Trigger>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="absolute inset-0 z-[50] bg-black/30 backdrop-blur-sm" />
        {close ? (
          <DrawerPrimitive.Close
            className={buttonStyles(
              {
                size: "sm",
                variant: "tertiary",
                symmetrical: true
              },
              "absolute left-4 top-4 z-[60] w-fit bg-transparent transition-all data-[state=open]:animate-in data-[state=closed]:animate-out"
            )}
          >
            <X size={16} />
          </DrawerPrimitive.Close>
        ) : null}
        <DrawerPrimitive.Content className="bg-primary fixed right-0 top-0 z-[70] flex h-dvh w-[80dvw] flex-col border-l py-4">
          {children}
        </DrawerPrimitive.Content>
        <DrawerPrimitive.Overlay />
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
