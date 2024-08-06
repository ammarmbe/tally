import buttonStyles from "@/utils/styles/button";
import Drawer from "./drawer";
import { Drawer as DrawerPrimitive } from "vaul";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Sidebar({
  links,
  user
}: {
  user: User;
  links: {
    href: string;
    text: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <Drawer
      trigger={
        <button
          id="Open sidebar"
          className={buttonStyles(
            {
              size: "sm",
              variant: "tertiary",
              symmetrical: true
            },
            "sm:hidden"
          )}
        >
          <Menu size={20} />
        </button>
      }
    >
      <nav className="flex flex-grow flex-col items-center gap-2 p-4">
        {links.map(({ href, text }) => (
          <DrawerPrimitive.Close asChild key={href}>
            <Link
              href={href}
              className={`block w-full min-w-36 rounded-sm px-3 py-2 font-medium transition-all ${
                pathname === href
                  ? "text-primary bg-secondary"
                  : "hover:text-primary hover bg-primary active text-secondary active:shadow-focus-ring"
              }`}
            >
              {text}
            </Link>
          </DrawerPrimitive.Close>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-5 p-4">
        <div className="flex flex-none items-center gap-3">
          <Image
            src={user.image || "/avatar.svg"}
            alt={`${user.name}'s profile picture`}
            width={44}
            height={44}
            quality={100}
            className="block cursor-pointer rounded-full transition-all active:shadow-focus-ring"
          />
          <DrawerPrimitive.Close asChild>
            <Link href="/settings" className="flex flex-col">
              <span className="text-primary text-text-md font-medium">
                {user.name}
              </span>
              <span className="text-secondary text-text-sm">Settings</span>
            </Link>
          </DrawerPrimitive.Close>
        </div>
        <DrawerPrimitive.Close asChild>
          <button
            className={buttonStyles({
              size: "md",
              variant: "tertiary",
              symmetrical: true
            })}
            onClick={() => signOut()}
          >
            <LogOut size={20} />
          </button>
        </DrawerPrimitive.Close>
      </div>
    </Drawer>
  );
}
