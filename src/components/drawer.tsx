"use client";

import type { ReactNode } from "react";
import { Drawer as DrawerPrimitive } from "vaul";

export default function Drawer({
  trigger,
  children,
}: {
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <DrawerPrimitive.Root direction="right" shouldScaleBackground>
      <DrawerPrimitive.Trigger asChild>{trigger}</DrawerPrimitive.Trigger>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm" />
        <DrawerPrimitive.Content className="bg-primary fixed right-0 top-0 z-20 flex h-dvh flex-col border-l">
          {children}
        </DrawerPrimitive.Content>
        <DrawerPrimitive.Overlay />
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
