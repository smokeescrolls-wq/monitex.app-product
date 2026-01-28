import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function WelcomeBanner({
  data,
}: {
  data: {
    name: string;
    credits: number;
    level: { label: string; subtitle: string };
    xp: { current: number; total: number };
  };
}) {
  const pct = Math.round((data.xp.current / data.xp.total) * 100);

  return (
    <Card className="border-white/10 bg-violet-600/30 backdrop-blur-xl">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-white/80">✨ Welcome!</p>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Hello, {data.name}! 👋
            </h1>
            <p className="text-xs text-white/70">
              Choose a service and start your analysis.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Badge className="rounded-xl border-white/10 bg-white/10 text-white">
              {data.level.label}
              <span className="ml-2 text-white/70">{data.level.subtitle}</span>
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/70">Credit</p>
            <p className="mt-1 text-2xl font-bold text-white">{data.credits}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/70">XP</p>
              <p className="text-xs text-white/70">
                {data.xp.current}/{data.xp.total}
              </p>
            </div>
            <Progress value={pct} className="mt-2 h-2 bg-white/10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
