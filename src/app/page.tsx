"use client";
import { Assets } from "./ components/Assets";
import { Boards } from "./ components/Boards";

export default function Home() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <Boards />
      <Assets />
    </main>
  );
}
