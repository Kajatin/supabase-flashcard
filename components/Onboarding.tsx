"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../app/supabase-provider";
import { Database } from "@/types/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/utils/use-session";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Onboarding() {
  const { supabase } = useSupabase();

  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  const resetOnboarding = async () => {
    if (!profile) return;

    const { data: profiles, error } = await supabase
      .from("profiles")
      .update({ onboarding: false })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      console.error(error);
    } else {
      setProfile(profiles);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      if (error) {
        console.error(error);
      } else {
        setProfile(profiles);
      }
    };

    fetchCollections();
  }, [supabase]);

  if (!session || !profile) {
    return null;
  }

  return (
    <AnimatePresence>
      {profile.onboarding ? (
        <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
          <motion.div
            className="grid place-items-center h-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col text-center gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[40%]">
              <div className="bg-gradient-to-r from-amber-500 to-indigo-500 rounded flex justify-center p-0.5">
                <div className="font-medium text-3xl bg-neutral-100 dark:bg-neutral-800 w-full px-4 py-2">
                  Welcome to Flashcards
                </div>
              </div>
              <div className="text-xl">Thank you for signing up!</div>
              <div className="text-lg">
                In this app you can create collections of flashcards with AI
                assisted explanations of foreign words.
              </div>
              <div className="text-lg">
                To get started, click on the plus sign next to Collections on
                the left to create a new collection. Then you can start adding
                cards to it on the right.
              </div>
              <div className="text-lg">
                If you want to make use of the AI assisted explanations, you
                need to create a free account on{" "}
                <a
                  href="https://platform.openai.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  OpenAI
                </a>{" "}
                and paste your API key in the settings.
              </div>

              <button
                className="bg-gradient-to-r from-amber-500 to-indigo-500 text-white font-medium py-2 px-2 text-lg rounded flex justify-center"
                onClick={resetOnboarding}
              >
                {"Let's go!"}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
