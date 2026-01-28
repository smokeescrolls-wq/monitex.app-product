import { Separator } from "@/components/ui/separator";

export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">{title}</h2>
      </div>
      <Separator className="mb-4 bg-white/10" />
      {children}
    </section>
  );
}
