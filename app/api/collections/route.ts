import { createServerClient } from "@/utils/supabase-server";

export async function POST(request: Request) {
  const supabase = createServerClient();

  const collection = await request.json();

  if (!collection) {
    return new Response("No body provided", { status: 400 });
  }

  const { count } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true });

  if ((count || 0) >= 3) {
    return new Response("You have reached the maximum number of collections", {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("collections")
    .insert(collection)
    .select("*")
    .single();

  if (error) {
    return new Response("Error adding new collection", { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
