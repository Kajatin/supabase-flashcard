"use client";

import { useEffect, useState } from "react";
import { Collection } from "./Collections";
import { useSupabase } from "../app/supabase-provider";
import { Database } from "@/types/supabase";
import { AnimatePresence, motion } from "framer-motion";
import {
  generatePrompt,
  generatePromptV3,
  generateRecommendationPrompt,
} from "@/utils/openai-helpers";
import Masonry from "react-masonry-css";
import { useSession } from "@/utils/use-session";

type Card = Database["public"]["Tables"]["cards"]["Row"];

function Card(props: {
  card: Card;
  setSelectedCard: (c: Card | null) => void;
}) {
  const { card, setSelectedCard } = props;

  return (
    <div className="my-masonry-grid_item" onClick={() => setSelectedCard(card)}>
      <div className="rounded-lg p-0.5 bg-gradient-to-br from-amber-500 to-indigo-500 max-w-md">
        <div className="flex flex-col gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <div className="text-2xl font-medium text-center border bg-neutral-300 dark:bg-neutral-900 bg-opacity-50 rounded-lg border-neutral-600 py-1">
            {card.content}
          </div>
          <div className="text-base text-neutral-500 dark:text-neutral-400 text-justify whitespace-pre-wrap">
            {card.explanation}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cards(props: {
  selectedCollection: Collection | null;
  setGame: (game: boolean) => void;
  removeCollection: (id: number) => void;
}) {
  const { supabase } = useSupabase();
  const { selectedCollection, setGame, removeCollection } = props;

  const [cards, setCards] = useState<Card[]>([]);
  const session = useSession();

  const [showAddCard, setShowAddCard] = useState(false);
  const [showErase, setShowErase] = useState(false);
  const [showModifyCard, setShowModifyCard] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newExplanation, setNewExplanation] = useState("");
  const [language, setLanguage] = useState("Danish");
  const [generating, setGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const maxCards = 20;

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) {
      setLanguage(lang);
    }
  }, []);

  useEffect(() => {
    if (!selectedCollection) {
      setCards([]);
      return;
    }

    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("collection_id", selectedCollection.id);
      if (error) {
        console.error(error);
      } else {
        setCards(data);
      }
    };

    fetchCards();
  }, [selectedCollection, supabase]);

  const addNewCard = async () => {
    if (!selectedCollection) {
      return;
    }

    if (!newContent || !newExplanation) {
      return;
    }

    await fetch("/api/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newContent,
        explanation: newExplanation,
        collection_id: selectedCollection.id,
        user_id: session?.user.id || "",
      }),
    })
      .then((res) => res.json())
      .then((data) => setCards([...cards, data]))
      .catch((err) => console.error(err));
  };

  const eraseCollection = async () => {
    if (!selectedCollection) {
      return;
    }

    await fetch(`/api/collections/${selectedCollection.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => removeCollection(data[0].id))
      .catch((err) => console.error(err));
  };

  const modifyCard = async () => {
    if (!selectedCard) {
      return;
    }

    await fetch(`/api/cards/${selectedCard.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newContent,
        explanation: newExplanation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newCards = cards.map((c) => {
          if (c.id === data[0].id) {
            return data[0];
          }
          return c;
        });
        setCards(newCards);
      })
      .catch((err) => console.error(err));

    setShowModifyCard(false);
    setSelectedCard(null);
  };

  const eraseCard = async () => {
    if (!selectedCard) {
      return;
    }

    await fetch(`/api/cards/${selectedCard.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        const newCards = cards.filter((c) => c.id !== data[0].id);
        setCards(newCards);
      })
      .catch((err) => console.error(err));

    setShowModifyCard(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    if (!showAddCard) {
      setNewContent("");
      setNewExplanation("");
    }
  }, [showAddCard]);

  useEffect(() => {
    if (!selectedCard) {
      setNewContent("");
      setNewExplanation("");
      return;
    }

    setNewContent(selectedCard.content);
    setNewExplanation(selectedCard.explanation);
    setShowModifyCard(true);
  }, [selectedCard]);

  useEffect(() => {
    if (!showModifyCard) {
      setSelectedCard(null);
    }
  }, [showModifyCard]);

  return (
    <>
      <AnimatePresence>
        {showAddCard && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-xl">New card</div>
                  <button
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
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

                <div className="rounded-lg p-0.5 bg-gradient-to-br from-amber-500 to-indigo-500">
                  <button
                    className={
                      "px-2 py-1 bg-neutral-600 bg-opacity-30 dark:bg-opacity-50 rounded-lg m-1 " +
                      (newContent && !generating
                        ? "hover:bg-opacity-50 dark:hover:bg-opacity-70"
                        : "cursor-not-allowed")
                    }
                    disabled={generating || !newContent}
                    onClick={async () => {
                      if (generating) {
                        return;
                      }

                      setGenerating(true);

                      const lang = localStorage.getItem("language");
                      if (lang) {
                        setLanguage(lang);
                      }

                      const prompt = generatePromptV3(newContent, language);
                      const resp = await fetch("/api/openai", {
                        method: "POST",
                        body: JSON.stringify({ prompt }),
                      })
                        .then((res) => res.text())
                        .catch((err) => console.error(err));

                      setGenerating(false);
                      setNewExplanation(resp || "");
                    }}
                  >
                    <div
                      className={
                        "flex flex-row gap-2.5 items-center " +
                        (generating ? "animate-pulse" : "")
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20"
                        fill="currentColor"
                        viewBox="0 96 960 960"
                      >
                        <path d="m812 353-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm-482 0-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm482 482-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75ZM187 964l-95-95q-11-11-12-25.5T92 816l450-450q12-12 29-12t29 12l90 90q12 12 12 29t-12 29L240 964q-12 12-26.5 12T187 964Zm23-57 313-313-62-62-313 313 62 62Z" />
                      </svg>
                      <div>
                        {generating ? "Generating..." : "Generate explanation"}
                      </div>
                    </div>
                  </button>

                  <div className="flex flex-col gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <input
                      className="text-lg font-medium text-center border bg-neutral-300 dark:bg-neutral-900 bg-opacity-50 rounded-lg border-neutral-600 py-1 outline-none"
                      placeholder="Word"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />

                    <textarea
                      className="text-base text-neutral-500 dark:text-neutral-400 text-justify h-56 px-2 py-1 bg-transparent border rounded-lg border-neutral-600 outline-none resize-none whitespace-pre-wrap"
                      placeholder="Explanation"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className={
                    "text-base font-medium w-full text-center bg-neutral-300 dark:bg-neutral-700 p-2 rounded " +
                    (cards.length >= maxCards
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-neutral-400 dark:hover:bg-neutral-600")
                  }
                  disabled={cards.length >= maxCards}
                  onClick={() => {
                    if (cards.length >= maxCards) {
                      return;
                    }

                    addNewCard();
                    setShowAddCard(false);
                  }}
                >
                  {cards.length >= maxCards
                    ? "Max cards reached (" + maxCards + ")"
                    : "Add"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModifyCard && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-xl">Modify card</div>
                  <button
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                    onClick={() => setShowModifyCard(false)}
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

                <div className="rounded-lg p-0.5 bg-gradient-to-br from-amber-500 to-indigo-500">
                  <button
                    className={
                      "px-2 py-1 bg-neutral-600 bg-opacity-30 dark:bg-opacity-50 rounded-lg m-1 " +
                      (newContent && !generating
                        ? "hover:bg-opacity-50 dark:hover:bg-opacity-70"
                        : "cursor-not-allowed")
                    }
                    disabled={generating || !newContent}
                    onClick={async () => {
                      if (generating) {
                        return;
                      }

                      setGenerating(true);

                      const lang = localStorage.getItem("language");
                      if (lang) {
                        setLanguage(lang);
                      }

                      const prompt = generatePrompt(newContent, language);
                      const resp = await fetch("/api/openai", {
                        method: "POST",
                        body: JSON.stringify({ prompt }),
                      })
                        .then((res) => res.text())
                        .catch((err) => console.error(err));

                      setGenerating(false);
                      setNewExplanation(resp || "");
                    }}
                  >
                    <div
                      className={
                        "flex flex-row gap-2.5 items-center " +
                        (generating ? "animate-pulse" : "")
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20"
                        fill="currentColor"
                        viewBox="0 96 960 960"
                      >
                        <path d="m812 353-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm-482 0-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm482 482-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75ZM187 964l-95-95q-11-11-12-25.5T92 816l450-450q12-12 29-12t29 12l90 90q12 12 12 29t-12 29L240 964q-12 12-26.5 12T187 964Zm23-57 313-313-62-62-313 313 62 62Z" />
                      </svg>
                      <div>
                        {generating ? "Generating..." : "Generate explanation"}
                      </div>
                    </div>
                  </button>

                  <div className="flex flex-col gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <input
                      className="text-lg font-medium text-center border bg-neutral-300 dark:bg-neutral-900 bg-opacity-50 rounded-lg border-neutral-600 py-1 outline-none"
                      placeholder="Word"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />

                    <textarea
                      className="text-base text-neutral-500 dark:text-neutral-400 text-justify h-56 px-2 py-1 bg-transparent border rounded-lg border-neutral-600 outline-none resize-none"
                      placeholder="Explanation"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="text-base font-medium w-full text-center bg-neutral-300 dark:bg-neutral-700 p-2 rounded hover:bg-neutral-400 dark:hover:bg-neutral-600"
                    onClick={() => {
                      modifyCard();
                    }}
                  >
                    Modify
                  </button>

                  <button
                    className="text-base font-medium w-full text-center bg-neutral-300 dark:bg-neutral-700 p-2 rounded hover:bg-neutral-400 dark:hover:bg-neutral-600 text-red-500"
                    onClick={() => {
                      eraseCard();
                    }}
                  >
                    Erase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showErase && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-600 dark:bg-neutral-900 bg-opacity-70 dark:bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-xl">Erase collection</div>
                  <button
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                    onClick={() => setShowErase(false)}
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

                <div className="text-lg text-neutral-500 dark:text-neutral-400">
                  Are you sure you want to erase{" "}
                  <span className="font-medium text-amber-500">
                    {selectedCollection?.title}
                  </span>
                  ? All cards for this collection will be removed too.
                </div>
                <div className="flex flex-row items-center gap-2 text-lg text-neutral-500 dark:text-neutral-400 font-medium">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div>This action cannot be undone.</div>
                </div>

                <button
                  className={
                    "text-base font-medium w-full text-center bg-neutral-300 dark:bg-neutral-700 p-2 rounded " +
                    (!selectedCollection
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-neutral-400 dark:hover:bg-neutral-600")
                  }
                  disabled={!selectedCollection}
                  onClick={() => {
                    if (!selectedCollection) {
                      return;
                    }

                    eraseCollection();
                    setShowErase(false);
                  }}
                >
                  Erase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCollection && (
          <motion.div
            className="flex flex-col px-10 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="text-2xl">{selectedCollection.title}</div>
              <div className="flex flex-row gap-2">
                {cards.length >= 5 && (
                  <button
                    className={
                      "text-md text-amber-500 dark:text-amber-500 text-center " +
                      (generating
                        ? "cursor-not-allowed opacity-60"
                        : "hover:text-amber-600 dark:hover:text-amber-400")
                    }
                    disabled={generating}
                    onClick={async () => {
                      if (generating) {
                        return;
                      }

                      setGenerating(true);

                      const lang = localStorage.getItem("language");
                      if (lang) {
                        setLanguage(lang);
                      }

                      const words: string[] = cards.map((c) => c.content);
                      const prompt = generateRecommendationPrompt(
                        words,
                        language,
                        selectedCollection?.title || ""
                      );
                      const resp = await fetch("/api/openai", {
                        method: "POST",
                        body: JSON.stringify({ prompt }),
                      })
                        .then((res) => res.text())
                        .catch((err) => console.error(err));

                      setGenerating(false);

                      if (!resp) {
                        return;
                      }

                      // remove any punctuation from resp
                      const cleanResp = resp.replace(
                        /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
                        ""
                      );

                      setNewContent(cleanResp);
                      setShowAddCard(true);
                    }}
                  >
                    <div className="relative flex h-6 w-6">
                      <div className="animate-ping absolute inline-flex h-full w-full opacity-75">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 96 960 960"
                        >
                          <path d="m812 353-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm-482 0-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm482 482-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75ZM187 964l-95-95q-11-11-12-25.5T92 816l450-450q12-12 29-12t29 12l90 90q12 12 12 29t-12 29L240 964q-12 12-26.5 12T187 964Zm23-57 313-313-62-62-313 313 62 62Z" />
                        </svg>
                      </div>
                      <div className="relative inline-flex h-6 w-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 96 960 960"
                        >
                          <path d="m812 353-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm-482 0-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75Zm482 482-34-75-75-34 75-34 34-75 34 75 75 34-75 34-34 75ZM187 964l-95-95q-11-11-12-25.5T92 816l450-450q12-12 29-12t29 12l90 90q12 12 12 29t-12 29L240 964q-12 12-26.5 12T187 964Zm23-57 313-313-62-62-313 313 62 62Z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                  onClick={() => {
                    setShowErase(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>

                <button
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                  onClick={() => {
                    setGame(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                </button>

                <button
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
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
            </div>

            {cards.length <= 0 && (
              <div className="flex flex-row justify-end gap-1 text-amber-500 items-center px-0.5 animate-bounce">
                <div>Add a card</div>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              </div>
            )}

            <Masonry
              breakpointCols={{
                default: 3,
                1100: 2,
                700: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card card={card} setSelectedCard={setSelectedCard} />
                </motion.div>
              ))}
            </Masonry>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
