"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./supabase-provider";
import { Database } from "@/types/supabase";
import moment from "moment";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default function Collections(props: {
  selectedCollection: Collection | null;
  setSelectedCollection: (c: Collection | null) => void;
}) {
  const { selectedCollection, setSelectedCollection } = props;

  const { supabase } = useSupabase();

  const [collectionTitle, setCollectionTitle] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  const [session, setSession] = useState<Session | null>(null);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

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

  const fetchCollections = async () => {
    const { data, error } = await supabase.from("collections").select("*");
    if (error) {
      console.log(error);
    } else {
      setCollections(data);
    }
  };

  const addNewCollection = async () => {
    const { data, error } = await supabase
      .from("collections")
      .insert({
        title: collectionTitle,
        description: collectionDescription,
        user_id: session?.user.id || "",
      })
      .select("*")
      .single();
    if (error) {
      console.log(error);
    } else {
      setCollections([...collections, data]);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    setCollectionTitle("");
    setCollectionDescription("");
  }, [showAddCollection]);

  return (
    <div className="flex flex-col p-2 rounded gap-2">
      <div className="flex flex-row justify-between">
        <div className="text-lg font-medium">Collections</div>
        <button
          className="text-sm text-center text-neutral-400 hover:text-neutral-200"
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
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-xl">New collection</div>
                  <button
                    className="text-sm text-neutral-400 hover:text-neutral-200 text-center"
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

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-start gap-2 mb-2">
                    <label className="text-sm font-medium text-neutral-400">
                      Title
                    </label>
                    <input
                      className="font-medium px-1.5 py-1 bg-transparent border rounded border-neutral-500 w-full"
                      type="text"
                      placeholder="Collection title"
                      onChange={(event) =>
                        setCollectionTitle(event.target.value)
                      }
                      value={collectionTitle}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2 mb-2">
                    <label className="text-sm font-medium text-neutral-400">
                      Description
                    </label>
                    <input
                      className="font-medium px-1.5 py-1 bg-transparent border rounded border-neutral-500 w-full"
                      type="text"
                      placeholder="Collection description"
                      onChange={(event) =>
                        setCollectionDescription(event.target.value)
                      }
                      value={collectionDescription}
                    />
                  </div>

                  <button
                    className="text-sm font-medium px-2 py-1 rounded border border-neutral-400 hover:bg-amber-400 hover:text-amber-900"
                    onClick={() => {
                      addNewCollection();
                      setShowAddCollection(false);
                    }}
                  >
                    Add
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
              "flex flex-col p-1 hover:bg-neutral-600 rounded " +
              (selectedCollection === collection ? "bg-neutral-700" : "")
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
            <div
              key={collection.id}
              className="flex flex-row gap-2 text-sm text-neutral-400 justify-between"
            >
              <div className="truncate basis-3/5">{collection.description}</div>
              <div className="basis-2/5">
                {moment(collection.updated_at).format("ll")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
