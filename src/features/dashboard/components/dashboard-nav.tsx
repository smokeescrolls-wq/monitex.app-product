"use client";

import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/features/auth/logout.actions";

export function DashboardNav({ authDisabled }: { authDisabled: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/55"
        >
          <Menu className="h-5 w-5 text-white/80" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col border-white/10 bg-[#0b0b10] p-6 text-white"
      >
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-white">NAVIGATION</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-3">
          <Link
            className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/90 hover:bg-white/10"
            href="/buy-credits"
          >
            Buy credits
          </Link>

          <Link
            className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/90 hover:bg-white/10"
            href="/profile"
          >
            View profile
          </Link>

          <Link
            className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/90 hover:bg-white/10"
            href="/rewards"
          >
            Rewards
          </Link>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="mt-auto pt-2">
          {authDisabled ? (
            <Link
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white hover:bg-violet-500"
              href="/auth/login"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          ) : (
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white hover:bg-violet-500"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
