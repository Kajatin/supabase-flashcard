"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSupabase } from "../supabase-provider";
import { AnimatePresence, motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (event: any) => {
    event.preventDefault();

    if (loggingIn) {
      return;
    }

    setLoggingIn(true);
    setPassword("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(true);
    }

    setLoggingIn(false);
    router.replace("/");
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col justify-center items-center text-center border max-w-md rounded border-gray-500 px-6 py-10">
        <div className="text-3xl">Welcome</div>
        <div className="my-8 text-neutral-400">
          Log in to continue learning new languages.
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-neutral-400">
              Email
            </label>
            <input
              className="border rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </div>

          <div className="flex flex-col items-start gap-2 mb-4">
            <label className="text-sm font-medium text-neutral-400">
              Password
            </label>
            <input
              className="border rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
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
                Invalid email or password
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={
              "bg-amber-500 text-white font-medium py-2 px-4 rounded flex justify-center " +
              (loggingIn ? "cursor-not-allowed" : "hover:bg-amber-700")
            }
            onClick={handleLogin}
            disabled={loggingIn}
          >
            {loggingIn ? (
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
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-sm font-medium text-neutral-400">
            Not registered?{" "}
            <Link
              href="/login/signup"
              className="text-amber-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
