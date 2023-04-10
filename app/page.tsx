"use client";

import { useSupabase } from "./supabase-provider";

export default function Home() {
  const { supabase } = useSupabase();

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <main>
      <div>Hello World</div>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
