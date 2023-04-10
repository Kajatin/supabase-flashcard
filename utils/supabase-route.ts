import { headers, cookies } from "next/headers";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export const createRouteHandler = () =>
  createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
