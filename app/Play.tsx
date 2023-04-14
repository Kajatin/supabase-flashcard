"use client";

import { useEffect, useState } from "react";
import { Collection } from "./Collections";
import { useSupabase } from "./supabase-provider";
import { Database } from "@/types/supabase";
import { Session } from "@supabase/supabase-js";

type Card = Database["public"]["Tables"]["cards"]["Row"];

function Card(props: { card: Card }) {
  const { card } = props;

  return (
    <div className="rounded-lg p-0.5 bg-gradient-to-br from-emerald-500 to-amber-500">
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
    <>
      <div className="flex w-full h-full justify-center">
        <div className="grid place-items-center h-full p-24">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-10 items-center">
              <button
                className="text-sm text-neutral-400 hover:text-neutral-200 text-center"
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
                className="text-sm text-neutral-400 hover:text-neutral-200 text-center"
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

            <div className="flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-emerald-500 to-amber-500 p-4 pt-8 pb-4 rounded-2xl">
              <div className="text-5xl">{cards[cardIdxToShow].content}</div>
              <div
                className="bg-neutral-500 bg-opacity-40 rounded-xl px-4 py-2 cursor-pointer"
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
      </div>
    </>
  );
}
