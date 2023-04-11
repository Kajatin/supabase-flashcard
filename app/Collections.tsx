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
      <div className="text-lg font-medium">Collections</div>

      <AnimatePresence>
        {showAddCollection && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-sm font-medium text-neutral-400">
                Title
              </label>
              <input
                className="border rounded w-full py-1 px-1.5 dark:bg-neutral-900 outline-none"
                type="text"
                placeholder="Collection title"
                onChange={(event) => setCollectionTitle(event.target.value)}
                value={collectionTitle}
              />
            </div>

            <div className="flex flex-col items-start gap-2 mb-2">
              <label className="text-sm font-medium text-neutral-400">
                Description
              </label>
              <input
                className="border rounded w-full py-1 px-1.5 dark:bg-neutral-900 outline-none"
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
                setShowAddCollection(false);
              }}
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="text-sm font-medium px-2 py-1 rounded border border-neutral-400 hover:bg-amber-400 hover:text-amber-900"
        onClick={() => {
          if (!showAddCollection) {
            setShowAddCollection(true);
          } else {
            addNewCollection();
            setShowAddCollection(false);
          }
        }}
      >
        {showAddCollection ? "Submit" : "Add new collection"}
      </button>

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
