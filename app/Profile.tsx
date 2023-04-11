"use client";

import { Database } from "@/types/supabase";
import { useSupabase } from "./supabase-provider";
import { useEffect, useState } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Profile() {
  const { supabase } = useSupabase();

  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchCollections = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .single();
    if (error) {
      console.log(error);
    } else {
      setProfile(profiles);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col w-full px-2 py-5 gap-2 border-t border-neutral-400 items-start">
      <div className="text-sm text-neutral-400 font-medium">
        {profile?.username}
      </div>
      <button className="text-sm hover:bg-amber-500 w-full text-start px-1 py-0.5 rounded">
        Settings
      </button>
      <button
        className="text-sm hover:bg-amber-500 w-full text-start px-1 py-0.5 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
