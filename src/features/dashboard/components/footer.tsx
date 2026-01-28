import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function DashboardFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-10", className)}>
      <Separator className="bg-white/10" />
      <div className="mx-auto flex w-full max-w-[1060px] flex-col items-center gap-6 px-4 py-10 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <Image
              src="/assets/logo-vert-transparente.png"
              alt="Monitex"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-xs font-semibold tracking-[0.18em] text-white/70">
            MONITEX.APP
          </span>
        </div>

        <div className="space-y-2 text-xs text-white/50">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300/70" />
              SSL Certified
            </span>
            <Badge className="border-white/10 bg-white/5 text-white/70">
              Secure environment
            </Badge>
          </div>
          <p>© 2026 Monitex — All rights reserved.</p>
        </div>

        <div className="grid w-full max-w-[760px] grid-cols-1 gap-6 text-left sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-white/70">Services</p>
            <ul className="space-y-1 text-xs text-white/50">
              <li>Instagram</li>
              <li>WhatsApp</li>
              <li>Facebook</li>
              <li>Location</li>
              <li>Camera</li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-white/70">
              Information
            </p>
            <ul className="space-y-1 text-xs text-white/50">
              <li>
                <Link className="hover:text-white/70" href="/legal/terms">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link className="hover:text-white/70" href="/legal/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-white/70" href="/support">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
