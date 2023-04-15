import { createServerClient } from "@/utils/supabase-server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { id: number };
  }
) {
  const id = params.id;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .select("*");

  if (error) {
    return NextResponse.error();
  }

  return NextResponse.json(data);
}
