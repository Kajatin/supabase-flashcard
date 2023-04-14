"use client";

import { Database } from "@/types/supabase";
import { useSupabase } from "../app/supabase-provider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "@supabase/supabase-js";
import Cookies from "js-cookie";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Profile() {
  const { supabase } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [oaAPI, setOaAPI] = useState("");
  const [feedback, setFeedback] = useState("");
  const [language, setLanguage] = useState("Danish");

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
    const lang = localStorage.getItem("language");
    if (lang) {
      setLanguage(lang);
    }
  }, []);

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
  }, []);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const oaAPIKey = Cookies.get("openai-api-key");
    if (oaAPIKey) {
      setOaAPI(oaAPIKey);
    }
  }, []);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <>
      <AnimatePresence>
        {showSettings && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-medium">Settings</div>
                  <button
                    className="text-neutral-400 hover:text-neutral-200"
                    onClick={() => setShowSettings(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-400">
                    OpenAI API Key
                  </label>
                  <input
                    className="border border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
                    placeholder="sk-xxxxxxxxx"
                    value={oaAPI}
                    onChange={(e) => {
                      setOaAPI(e.target.value);
                      Cookies.set("openai-api-key", e.target.value, {
                        expires: 1,
                        path: "/",
                      });
                    }}
                  />
                  <div className="text-sm text-neutral-500 px-2">
                    Set your OpenAI API key to enable the AI to generate
                    description for new words that you add to your collections.
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-400">
                    Language
                  </label>
                  <input
                    className="border border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
                    placeholder="Danish"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      localStorage.setItem("language", e.target.value);
                    }}
                  />
                  <div className="text-sm text-neutral-500 px-2">
                    Set your OpenAI API key to enable the AI to generate
                    description for new words that you add to your collections.
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-400">
                    System
                  </label>
                  <button
                    className="text-base font-medium hover:bg-neutral-600 text-red-500 w-full text-start bg-neutral-700 p-2 rounded"
                    onClick={() => {
                      Cookies.remove("openai-api-key");
                      setOaAPI("");
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
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-medium">Feedback</div>
                  <button
                    className="text-neutral-400 hover:text-neutral-200"
                    onClick={() => setShowFeedback(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <textarea
                  className="text-base text-justify h-56 px-2 py-1 bg-transparent border rounded-lg border-neutral-600 outline-none resize-none"
                  placeholder="Leave me some feedback!"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />

                <button
                  className="text-base font-medium hover:bg-neutral-600 w-full bg-neutral-700 text-center p-2 rounded"
                  onClick={async () => {
                    if (!feedback || !profile) return;

                    const { data, error } = await supabase
                      .from("feedback")
                      .insert([
                        { feedback: feedback, user_id: session?.user.id || "" },
                      ]);

                    if (error) {
                      console.log(error);
                    }

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

      <div className="flex flex-col w-full px-2 py-5 items-start">
        <div className="w-full border-t border-neutral-700 mb-1"></div>
        <div className="text-sm text-neutral-400 font-medium my-1">
          {profile?.username}
        </div>
        <button
          className="text-sm hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <button
          className="text-sm hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded"
          onClick={() => setShowFeedback(true)}
        >
          Feedback
        </button>
        <button
          className="text-sm hover:bg-neutral-800 bg-opacity-70 w-full text-start p-1 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
