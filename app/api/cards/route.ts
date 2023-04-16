import { createServerClient } from "@/utils/supabase-server";

export async function POST(request: Request) {
  const supabase = createServerClient();

  const card = await request.json();

  if (!card) {
    return new Response("No body provided", { status: 400 });
  }

  const { count } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("collection_id", card.collection_id);

  if ((count || 0) >= 20) {
    return new Response("You have reached the maximum number of collections", {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("cards")
    .insert(card)
    .select("*")
    .single();

  if (error) {
    return new Response("Error adding new card", { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
