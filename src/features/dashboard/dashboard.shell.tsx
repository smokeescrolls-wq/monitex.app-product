"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70 mask-[radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0))]">
        <MatrixCanvas
          className="absolute inset-0 h-full w-full"
          opacity={0.2}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.16),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.14),transparent_48%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[1060px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="border-white/10 bg-[#0b0b10]"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-2">
                  <Link
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                    href="/"
                  >
                    Home
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative h-6 w-6">
                <Image
                  src="/assets/logo-vert-transparente.png"
                  alt="Monitex"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <span className="text-sm font-semibold tracking-[0.18em] text-white/85">
                MONITEX<span className="text-violet-300">.APP</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 hover:bg-white/10">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm text-white/85 sm:block">
                    Account
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 border-white/10 bg-[#0b0b10] text-white"
              >
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <Separator className="my-1 bg-white/10" />
                <DropdownMenuItem className="cursor-pointer text-red-200">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
