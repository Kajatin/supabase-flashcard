"use client";

import { useEffect, useState } from "react";
import Collections, { Collection } from "./Collections";
import Profile from "./Profile";
import Cards from "./Cards";
import Play from "./Play";

export default function Home() {
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [game, setGame] = useState(false);

  useEffect(() => {
    setGame(false);
  }, [selectedCollection]);

  return (
    <main className="w-screen h-screen flex flex-row gap-2 p-2">
      <div className="flex flex-col justify-between basis-1/5 overflow-auto overflow-y-auto">
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
