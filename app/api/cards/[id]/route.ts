import { createServerClient } from "@/utils/supabase-server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { id: number };
  }
) {
  const id = params.id;

  const { content, explanation } = await request.json();

  if (!content || !explanation) {
    return NextResponse.error();
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("cards")
    .update({ content, explanation })
    .eq("id", id)
    .select("*");

  if (error) {
    return NextResponse.error();
  }

  return NextResponse.json(data);
}

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
    .from("cards")
    .delete()
    .eq("id", id)
    .select("*");

  if (error) {
    return NextResponse.error();
  }

  return NextResponse.json(data);
}
