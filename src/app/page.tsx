"use client";
import { Assets } from "./ components/Assets";
import { Boards } from "./ components/Boards";

export default function Home() {
  return (
    <main>
      <Boards />
      <Assets />
    </main>
  );
}
