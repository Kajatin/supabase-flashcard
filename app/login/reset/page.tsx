"use client";

import { useEffect, useState } from "react";

import { useSupabase } from "../../supabase-provider";
import { AnimatePresence, motion } from "framer-motion";

export default function Reset() {
  const { supabase } = useSupabase();

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [error, setError] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handlePasswordReset = async (event: any) => {
    event.preventDefault();

    if (resetting) {
      return;
    }

    if (password !== passwordRepeat) {
      setMismatch(true);
      return;
    }

    setResetting(true);

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(true);
    }

    setResetting(false);
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);

  useEffect(() => {
    if (!mismatch) {
      return;
    }

    setTimeout(() => {
      setMismatch(false);
    }, 3000);
  }, [mismatch]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col min-w-[30%] justify-center items-center text-center border max-w-md rounded border-neutral-400 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-6 py-10">
        <div className="text-3xl">Reset password</div>
        <div className="flex flex-col w-full gap-4">
          <div className="mt-6 flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              New password
            </label>
            <input
              className="border border-neutral-500 dark:border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
              type="password"
              placeholder="New password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </div>

          <div className="flex flex-col items-start gap-2 mb-4">
            <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Repeat new password
            </label>
            <input
              className="border border-neutral-500 dark:border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
              type="password"
              placeholder="New password"
              onChange={(event) => setPasswordRepeat(event.target.value)}
              value={passwordRepeat}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="text-sm font-medium text-red-500"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                Something went wrong... Please try again later
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {mismatch && (
              <motion.div
                className="text-sm font-medium text-red-500"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                Passwords do not match
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={
              "bg-gradient-to-r from-amber-500 to-indigo-500 text-white font-medium py-2 px-4 rounded flex justify-center " +
              (resetting ? "cursor-not-allowed" : "")
            }
            onClick={handlePasswordReset}
            disabled={resetting}
          >
            {resetting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="dark:opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Reset"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
