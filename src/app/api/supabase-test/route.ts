import { NextResponse } from "next/server";
import { supabase } from "@/server/supabase/supabase.client";

export async function GET() {
  const { data, error } = await supabase.from("YOUR_TABLE").select("*").limit(1);

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
