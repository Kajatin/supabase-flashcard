"use client";

import { useEffect, useState } from "react";
import Collections, { Collection } from "../components/Collections";
import Profile from "../components/Profile";
import Cards from "../components/Cards";
import Play from "../components/Play";

export default function Home() {
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [game, setGame] = useState(false);

  useEffect(() => {
    setGame(false);
  }, [selectedCollection]);

  return (
    <main className="w-screen h-screen flex flex-row gap-2 p-2">
      <div className="flex flex-col justify-between basis-1/5 border-r border-neutral-700">
        <Collections
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        <Profile />
      </div>
      <div className="flex-1 overflow-y-auto">
        {game ? (
          <Play selectedCollection={selectedCollection} setGame={setGame} />
        ) : (
          <Cards selectedCollection={selectedCollection} setGame={setGame} />
        )}
      </div>
    </main>
  );
}
