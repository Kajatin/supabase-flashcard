"use client";

import { useState } from "react";
import Collections, { Collection } from "./Collections";
import Profile from "./Profile";
import Cards from "./Cards";

export default function Home() {
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  return (
    <main className="w-screen h-screen flex flex-row gap-2 p-2">
      <div className="flex flex-col justify-between basis-1/5 overflow-auto">
        <Collections
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        <Profile />
      </div>
      <div className="flex-1">
        <Cards selectedCollection={selectedCollection} />
      </div>
    </main>
  );
}
