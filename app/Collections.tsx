"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./supabase-provider";
import { Database } from "@/types/supabase";
import moment from "moment";
import { Session } from "@supabase/supabase-js";

type Collections = Database["public"]["Tables"]["collections"]["Row"];

export default function Collections() {
  const { supabase } = useSupabase();

  const [session, setSession] = useState<Session | null>(null);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [collections, setCollections] = useState<Collections[]>([]);

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
        title: "New collection",
        description: "New description",
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

  return (
    <div className="flex flex-col p-2 rounded gap-2">
      <div className="text-lg font-medium">Collections</div>

      {showAddCollection && (
        <div className="flex flex-col gap-2">
          <input
            className="border border-neutral-400 rounded px-2 py-1"
            placeholder="Title"
          />
          <input
            className="border border-neutral-400 rounded px-2 py-1"
            placeholder="Description"
          />
          <button
            className="text-sm font-medium px-2 py-1 rounded border border-neutral-400 hover:bg-amber-400 hover:text-amber-900"
            onClick={() => {
              setShowAddCollection(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}

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

      <div className="flex flex-col divide-y">
        {collections.map((collection) => (
          <div key={collection.id} className="flex flex-col p-2">
            <div className="">{collection.title}</div>
            <div
              key={collection.id}
              className="flex flex-row gap-2 text-sm text-neutral-400"
            >
              <div className="">{collection.description}</div>
              <div className="">
                {moment(collection.updated_at).format("ll")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
