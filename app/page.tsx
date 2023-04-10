"use client";

import Collections from "./Collections";
import Profile from "./Profile";

export default function Home() {
  return (
    <main className="p-4 w-screen h-screen flex flex-row gap-4">
      <div className="flex flex-col justify-between basis-1/5">
        <Collections />
        <Profile />
      </div>
      <div className="flex-1">Stuff</div>
    </main>
  );
}
