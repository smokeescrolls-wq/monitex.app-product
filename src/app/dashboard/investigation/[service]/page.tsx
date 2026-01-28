import InvestigationClient from "@/features/investigation/pages/investigation.client";

export default function Page({
  params,
  searchParams,
}: {
  params: { service: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const raw = searchParams?.target;
  const target = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  return <InvestigationClient serviceKey={params.service} target={target} />;
}
