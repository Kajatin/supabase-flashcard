"use client";

import { useEffect, useState } from "react";
import { Collection } from "./Collections";
import { useSupabase } from "./supabase-provider";
import { Database } from "@/types/supabase";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

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

export default function Profile(props: {
  selectedCollection: Collection | null;
}) {
  const { supabase } = useSupabase();
  const { selectedCollection } = props;

  const [cards, setCards] = useState<Card[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newExplanation, setNewExplanation] = useState("");

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
        setCards(data);
      }
    };

    fetchCards();
  }, [selectedCollection]);

  const addNewCard = async () => {
    if (!selectedCollection) {
      return;
    }

    if (!newContent || !newExplanation) {
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert({
        content: newContent,
        explanation: newExplanation,
        collection_id: selectedCollection.id,
        user_id: session?.user.id || "",
      })
      .select("*")
      .single();
    if (error) {
      console.log(error);
    } else {
      setCards([...cards, data]);
    }
  };

  useEffect(() => {
    if (!showAddCard) {
      setNewContent("");
      setNewExplanation("");
    }
  }, [showAddCard]);

  return (
    <>
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            className="absolute top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid place-items-center h-screen">
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-4 w-96">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-xl">New card</div>
                  <button
                    className="text-sm hover:text-amber-500 text-center"
                    onClick={() => setShowAddCard(false)}
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
                <div className="rounded-lg p-0.5 bg-gradient-to-br from-emerald-500 to-amber-500">
                  <div className="flex flex-col gap-2 p-4 bg-neutral-800 rounded-lg">
                    <input
                      className="text-lg font-medium p-1 text-center bg-transparent border rounded border-neutral-500"
                      placeholder="Content"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />
                    <textarea
                      className="text-sm text-neutral-400 text-start h-40 p-2 bg-transparent border rounded border-neutral-500"
                      placeholder="Explanation"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="rounded-lg p-2 bg-gradient-to-br from-emerald-500 to-amber-500 text-neutral-800 font-medium opacity-70 hover:opacity-100"
                  onClick={() => {
                    addNewCard();
                    setShowAddCard(false);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col p-10 gap-4">
        <div className="flex flex-row justify-between">
          <div className="text-lg">{selectedCollection?.title}</div>
          <button
            className="text-sm hover:text-amber-500 text-center"
            onClick={() => {
              setShowAddCard(true);
            }}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row flex-wrap gap-4 justify-between">
          {cards.map((card) => (
            <div key={card.id}>
              <Card card={card} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
