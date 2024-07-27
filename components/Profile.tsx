"use client";

import { Database } from "@/types/supabase";
import { useSupabase } from "../app/supabase-provider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/utils/use-session";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Profile() {
  const { supabase } = useSupabase();
  const session = useSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [language, setLanguage] = useState("Danish");
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) {
      setLanguage(lang);
    }
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").single();
      if (error) {
        console.error(error);
      } else {
        setProfile(profiles);
      }
    };

    fetchCollections();
  }, [supabase]);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <>
      <AnimatePresence>
        {showSettings && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-medium">Settings</div>
                  <button className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center" onClick={() => setShowSettings(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Language</label>
                  <input
                    className="border border-neutral-500 dark:border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
                    placeholder="Danish"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      localStorage.setItem("language", e.target.value);
                    }}
                  />
                  <div className="text-sm text-neutral-400 dark:text-neutral-500 px-2">
                    Set the language to enable the AI to generate description for new words that you add to your collections.
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    className={
                      "text-base font-medium w-full text-start bg-neutral-300 dark:bg-neutral-700 p-2 rounded " +
                      (sendingReset || resetSent ? "cursor-not-allowed" : "hover:bg-neutral-400 dark:hover:bg-neutral-600")
                    }
                    disabled={resetSent}
                    onClick={async () => {
                      if (resetSent) {
                        return;
                      }

                      if (!session?.user?.email) {
                        return;
                      }

                      setSendingReset(true);

                      const { data, error } = await supabase.auth.resetPasswordForEmail(session?.user?.email || "");

                      if (error) {
                        console.error(error);
                      } else {
                        setResetSent(true);
                      }

                      setSendingReset(false);
                    }}
                  >
                    <div className={sendingReset ? "animate-pulse" : ""}>{sendingReset ? "Processing request..." : resetSent ? "Password reset email sent" : "Reset password"}</div>
                  </button>
                  <button
                    className="text-base font-medium hover:bg-neutral-400 dark:hover:bg-neutral-600 text-red-500 w-full text-start bg-neutral-300 dark:bg-neutral-700 p-2 rounded"
                    onClick={() => {
                      localStorage.removeItem("language");
                      setLanguage("Danish");
                    }}
                  >
                    Reset settings
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-medium">Feedback</div>
                  <button className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center" onClick={() => setShowFeedback(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center">
                  {Array(5)
                    .fill("")
                    .map((_, i) => (
                      <svg
                        key={i}
                        fill={i < rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-yellow-400 cursor-pointer"
                        onClick={() => setRating(i + 1)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    ))}
                </div>

                <textarea
                  className="text-base text-justify h-56 px-2 py-1 bg-transparent border rounded-lg border-neutral-500 dark:border-neutral-600 outline-none resize-none"
                  placeholder="Leave me some feedback!"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />

                <button
                  className="text-base font-medium hover:bg-neutral-400 dark:hover:bg-neutral-600 w-full bg-neutral-300 dark:bg-neutral-700 text-center p-2 rounded"
                  onClick={async () => {
                    if (!feedback || !profile) return;

                    const { data, error } = await supabase.from("feedback").insert([
                      {
                        rating: rating,
                        feedback: feedback,
                        user_id: session?.user.id || "",
                      },
                    ]);

                    if (error) {
                      console.error(error);
                    }

                    setRating(0);
                    setFeedback("");
                    setShowFeedback(false);
                  }}
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-full pr-2 py-5 items-start">
        <div className="w-full border-t border-neutral-400 dark:border-neutral-700 mb-1"></div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium my-1">{profile?.username}</div>
        <button
          className="text-sm hover:bg-neutral-400 hover:text-neutral-50 dark:hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <button
          className="text-sm hover:bg-neutral-400 hover:text-neutral-50 dark:hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded"
          onClick={() => setShowFeedback(true)}
        >
          Feedback
        </button>
        <button className="text-sm hover:bg-neutral-400 hover:text-neutral-50 dark:hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}
