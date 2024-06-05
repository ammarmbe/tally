"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Grenze_Gotisch } from "next/font/google";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Pencil, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Session, User } from "lucia";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";

const grenze = Grenze_Gotisch({ subsets: ["latin"] });

export default function Header() {
  const pathname = usePathname();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");

      return (await res.json()) as {
        user: User | null;
        session: Session | null;
      };
    },
  });

  return (
    <header className="flex min-h-[4.5rem] w-full items-center justify-between p-4">
      <h1 className={`text-4xl font-medium leading-none ${grenze.className}`}>
        <Link href="/">T</Link>
      </h1>
      <div className="flex items-center gap-3">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/courses" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                    pathname === "/courses"
                      ? "bg-accent text-accent-foreground"
                      : "bg-background"
                  }`}
                >
                  Your Courses
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/history" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                    pathname === "/history"
                      ? "bg-accent text-accent-foreground"
                      : "bg-background"
                  }`}
                >
                  View History
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {isLoading ? null : user?.session ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.user?.imageUrl} />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/courses/add" className="w-full">
                  <Plus className="mr-2 size-4" />
                  Add course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/edit" className="w-full">
                  <Pencil className="mr-2 size-4" />
                  Edit courses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/logout" className="w-full">
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/api/login" className="hover:underline">
            Login to save
          </Link>
        )}
      </div>
    </header>
  );
}
