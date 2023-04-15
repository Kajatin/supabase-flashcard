import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useSupabase } from "@/app/supabase-provider";

export function useSession() {
  const { supabase } = useSupabase();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log(error);
      } else {
        setSession(session);
      }
    };

    getSession();

    return () => {
      setSession(null);
    };
  }, [supabase]);

  return session;
}
