"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LEGAL_DOCS, type LegalKind } from "@/features/legal/legal.content";

type Props = {
  kind: LegalKind;
  triggerLabel: string;
};

export function LegalDialog({ kind, triggerLabel }: Props) {
  const doc = useMemo(() => LEGAL_DOCS[kind], [kind]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-white/70 underline underline-offset-4 cursor-pointer">
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="!max-w-[960px] w-full bg-[#0b0b0f] border border-white/10 text-white p-0 overflow-hidden ">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-lg md:text-xl">
              {doc.title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 text-[11px] text-white/60">{doc.updatedAt}</div>

          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hidden">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <pre className="whitespace-pre-wrap text-[12px] text-white/80 leading-relaxed font-sans">
                {doc.content}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
