"use client";

import { useEffect, useState } from "react";
import { Collection } from "./Collections";
import { useSupabase } from "../app/supabase-provider";
import { Database } from "@/types/supabase";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

type Card = Database["public"]["Tables"]["cards"]["Row"];

function Card(props: { card: Card }) {
  const { card } = props;

  return (
    <div className="rounded-lg p-0.5 bg-gradient-to-br from-amber-500 to-indigo-500">
      <div className="flex flex-col gap-2 p-4 bg-neutral-800 rounded-lg">
        <div className="text-xl font-medium text-center">{card.content}</div>
        <div className="text-sm text-neutral-400 text-center">
          {card.explanation}
        </div>
      </div>
    </div>
  );
}

export default function Play(props: {
  selectedCollection: Collection | null;
  setGame: (game: boolean) => void;
}) {
  const { supabase } = useSupabase();
  const { selectedCollection, setGame } = props;

  const [cards, setCards] = useState<Card[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [cardIdxToShow, setCardIdxToShow] = useState(0);
  const [isBlurred, setIsBlurred] = useState(true);

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
    if (!selectedCollection) {
      return;
    }

    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("collection_id", selectedCollection.id);
      if (error) {
        console.log(error);
      } else {
        // shuffle cards
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }

        setCards(data);
      }
    };

    fetchCards();
  }, [selectedCollection]);

  if (!session || !selectedCollection || !cards.length) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col w-full h-full px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="text-2xl">{selectedCollection.title}</div>
          <button
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
            onClick={() => {
              setGame(false);
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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

        <div className="grid place-items-center h-full p-24">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-10 items-center">
              <button
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                onClick={() => {
                  if (cardIdxToShow === 0) {
                    return;
                  } else {
                    setCardIdxToShow(
                      (cardIdxToShow - 1 + cards.length) % cards.length
                    );
                    setIsBlurred(true);
                  }
                }}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>

              <div className="text-xl font-medium">
                {cardIdxToShow + 1} / {cards.length}
              </div>

              <button
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                onClick={() => {
                  if (cardIdxToShow === cards.length - 1) {
                    return;
                  } else {
                    setCardIdxToShow((cardIdxToShow + 1) % cards.length);
                    setIsBlurred(true);
                  }
                }}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-amber-500 to-indigo-500 p-4 pt-8 pb-4 rounded-2xl">
              <div className="text-5xl font-medium text-center border bg-neutral-300 dark:bg-neutral-900 bg-opacity-50 dark:bg-opacity-50 rounded-lg border-neutral-600 px-3">
                {cards[cardIdxToShow].content}
              </div>
              <div
                className="bg-neutral-100 dark:bg-neutral-500 bg-opacity-40 dark:bg-opacity-40 rounded-xl px-4 py-2 cursor-pointer"
                onClick={() => {
                  setIsBlurred(false);
                }}
              >
                <div
                  className={
                    "text-xl transition-all duration-200 " +
                    (isBlurred ? "blur" : "")
                  }
                >
                  {cards[cardIdxToShow].explanation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
