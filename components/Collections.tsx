"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../app/supabase-provider";
import { Database } from "@/types/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/utils/use-session";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default function Collections(props: {
  collections: Collection[];
  setCollections: (c: Collection[]) => void;
  selectedCollection: Collection | null;
  setSelectedCollection: (c: Collection | null) => void;
}) {
  const {
    collections,
    setCollections,
    selectedCollection,
    setSelectedCollection,
  } = props;

  const { supabase } = useSupabase();

  const [collectionTitle, setCollectionTitle] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  const session = useSession();
  const [showAddCollection, setShowAddCollection] = useState(false);

  const maxCollections = 3;

  const addNewCollection = async () => {
    await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: collectionTitle,
        description: collectionDescription,
        user_id: session?.user.id || "",
      }),
    })
      .then((res) => res.json())
      .then((data) => setCollections([...collections, data]))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase.from("collections").select("*");
      if (error) {
        console.log(error);
      } else {
        setCollections(data);
      }
    };

    fetchCollections();
  }, [supabase, setCollections]);

  useEffect(() => {
    setCollectionTitle("");
    setCollectionDescription("");
  }, [showAddCollection]);

  return (
    <div className="flex flex-col p-2 rounded gap-2 overflow-auto overflow-y-auto ">
      <div className="flex flex-row justify-between">
        <div className="text-lg font-medium">Collections</div>
        <button
          className="text-sm text-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          onClick={() => setShowAddCollection(true)}
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

      <AnimatePresence>
        {showAddCollection && (
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
                  <div className="font-medium text-xl">New collection</div>
                  <button
                    className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-center"
                    onClick={() => setShowAddCollection(false)}
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

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col items-start gap-1 mb-2">
                    <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Title
                    </label>
                    <input
                      className="border border-neutral-500 dark:border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
                      type="text"
                      placeholder="Collection title"
                      onChange={(event) =>
                        setCollectionTitle(event.target.value)
                      }
                      value={collectionTitle}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-1 mb-2">
                    <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Description
                    </label>
                    <input
                      className="border border-neutral-500 dark:border-neutral-600 rounded w-full py-2 px-3 dark:bg-neutral-900 outline-none"
                      type="text"
                      placeholder="Collection description"
                      onChange={(event) =>
                        setCollectionDescription(event.target.value)
                      }
                      value={collectionDescription}
                    />
                  </div>

                  <button
                    className={
                      "text-base font-medium w-full text-center bg-neutral-300 dark:bg-neutral-700 p-2 rounded " +
                      (collections.length >= maxCollections
                        ? "cursor-not-allowed opacity-60"
                        : "hover:bg-neutral-400 dark:hover:bg-neutral-600")
                    }
                    disabled={collections.length >= maxCollections}
                    onClick={() => {
                      if (collections.length >= maxCollections) {
                        return;
                      }

                      addNewCollection();
                      setShowAddCollection(false);
                    }}
                  >
                    {collections.length >= maxCollections
                      ? "Max collections reached (" + maxCollections + ")"
                      : "Add"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className={
              "flex flex-col p-1 hover:translate-x-1.5 hover:bg-neutral-400 hover:bg-opacity-30 dark:hover:bg-opacity-100 dark:hover:bg-neutral-800 bg-opacity-70 dark:bg-opacity-70 transition-all rounded " +
              (selectedCollection === collection
                ? "bg-neutral-400 bg-opacity-20 dark:bg-neutral-800"
                : "")
            }
            onClick={() => {
              if (selectedCollection === collection) {
                setSelectedCollection(null);
              } else {
                setSelectedCollection(collection);
              }
            }}
          >
            <div className="">{collection.title}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {collection.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
