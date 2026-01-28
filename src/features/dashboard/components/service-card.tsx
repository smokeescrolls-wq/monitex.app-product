import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ServiceItem } from "@/features/dashboard/dashboard.data";

function badgeClass(tone: "success" | "warning" | "info" | "neutral") {
  if (tone === "success")
    return "bg-emerald-500/15 text-emerald-200 border-emerald-500/20";
  if (tone === "warning")
    return "bg-amber-500/15 text-amber-200 border-amber-500/20";
  if (tone === "info") return "bg-sky-500/15 text-sky-200 border-sky-500/20";
  return "bg-white/10 text-white/70 border-white/10";
}

export default function ServiceCard({
  item,
  variant,
}: {
  item: ServiceItem;
  variant: "contracted" | "available";
}) {
  const Icon = item.icon;
  const badge = item.badge;

  const cardBase = "border-white/10 bg-black/35 backdrop-blur-xl transition";
  const cardHover = variant === "available" ? "hover:bg-black/45" : "";

  return (
    <Card className={`${cardBase} ${cardHover}`}>
      <CardContent className={variant === "contracted" ? "p-4" : "p-4"}>
        {variant === "contracted" ? (
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Icon className="h-5 w-5 text-white/85" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/90">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {item.description}
                  </p>
                </div>

                {typeof item.progress === "number" ? (
                  <Badge className="rounded-full border-white/10 bg-white/5 text-white/80">
                    {item.progress}%
                  </Badge>
                ) : null}
              </div>

              {typeof item.progress === "number" ? (
                <Progress
                  value={item.progress}
                  className="mt-2 h-2 bg-white/10"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-white/85" />
              </div>

              {badge ? (
                <Badge
                  className={`rounded-full border ${badgeClass(badge.tone)}`}
                >
                  {badge.label}
                </Badge>
              ) : null}
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-white/90">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>

            {typeof item.cost === "number" ? (
              <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                {item.cost} credit
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
