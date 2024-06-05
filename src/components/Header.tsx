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
import {
  BookMarked,
  Home,
  LogOut,
  Menu,
  Pencil,
  Plus,
  History,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Session, User } from "lucia";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

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
    <>
      <header className="flex min-h-[4.5rem] w-full items-center justify-between p-4">
        <h1 className={`text-4xl font-medium leading-none ${grenze.className}`}>
          <Link href="/">T</Link>
        </h1>
        <div className="hidden items-center gap-3 sm:flex">
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
              {!(isLoading ? null : user?.session) ? (
                <NavigationMenuItem>
                  <Link href="/api/login" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Login to save
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ) : null}
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
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <Sheet>
          <SheetTrigger className="flex sm:hidden" asChild>
            <Button size="icon" variant="ghost">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="max-w-64">
            <NavigationMenu className="mt-4 w-full max-w-full [&_div]:w-full">
              <NavigationMenuList className="w-full flex-col gap-y-1">
                <NavigationMenuItem className="w-full">
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <Home className="mr-2 size-4" />
                      Dasboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/courses" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/courses"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <BookMarked className="mr-2 size-4" />
                      Your courses
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/history" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/history"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <History className="mr-2 size-4" />
                      View history
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/courses/add" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/courses/add"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <Plus className="mr-2 size-4" />
                      Add course
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/courses/edit" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/courses/edit"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit courses
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/logout" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === "/logout"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`}
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
