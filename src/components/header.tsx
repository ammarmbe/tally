"use client";

import { useUser } from "@/utils/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Dropdown from "./dropdown";
import buttonStyles from "@/utils/styles/button";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import dayjs from "dayjs";
import Sidebar from "./sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const links = [
  {
    href: `/date/${dayjs().format("YYYY-MM-DD")}`,
    text: "Home"
  },
  {
    href: "/courses",
    text: "My courses"
  },
  {
    href: "/history",
    text: "My history"
  },
  {
    href: "/courses/add",
    text: "Add course"
  }
];

export default function Header() {
  const pathname = usePathname();
  const user = useUser();

  if (pathname === "/login" || pathname === "/home" || pathname === "/privacy")
    return;

  return (
    <header className="flex h-[4.375rem] w-full flex-none items-center justify-center border-b sm:h-20">
      <div className="flex max-w-7xl flex-grow items-center justify-between p-4 py-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src="/logo.svg" alt="Tally logo" height={32} width={23} />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(({ href, text }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-sm px-3 py-2 text-text-sm font-medium transition-all ${
                  pathname === href
                    ? "text-primary bg-secondary"
                    : "hover:text-primary hover bg-primary active text-secondary active:shadow-focus-ring"
                }`}
              >
                {text}
              </Link>
            ))}
          </nav>
        </div>
        {user ? (
          <>
            <Sidebar links={links} user={user} />
            <Dropdown
              trigger={
                <Image
                  src={user.image || "/avatar.svg"}
                  alt={`${user.name}'s profile picture`}
                  width={40}
                  height={40}
                  quality={100}
                  className="hidden cursor-pointer rounded-full transition-all active:shadow-focus-ring sm:block"
                />
              }
              className="overflow-hidden"
            >
              <DropdownMenu.Item asChild>
                <Link
                  href="/settings"
                  className={buttonStyles({
                    size: "sm",
                    variant: "tertiary",
                    dropdown: true
                  })}
                >
                  <Settings size={16} /> Settings
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <button
                  className={buttonStyles({
                    size: "sm",
                    variant: "tertiary",
                    dropdown: true
                  })}
                  onClick={() => signOut()}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </DropdownMenu.Item>
            </Dropdown>
          </>
        ) : null}
      </div>
    </header>
  );
}
