"use client";

import { useState } from "react";
import Link from "next/link";

interface DrawResponse {
  win: boolean;
  message: string;
}

export default function PrizePage() {
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<DrawResponse | null>(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, wins: 0 });

  const handleDraw = async () => {
    if (drawing) return;
    setDrawing(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/draw", { method: "POST" });
      if (!res.ok) throw new Error();
      const data: DrawResponse = await res.json();
      setResult(data);
      setStats((s) => ({
        total: s.total + 1,
        wins: s.wins + (data.win ? 1 : 0),
      }));
    } catch {
      setError("無法連線到伺服器，請稍後再試");
    } finally {
      setDrawing(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-gradient-to-b from-violet-50 to-white px-6 py-12 dark:from-zinc-950 dark:to-black">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          幸運抽獎
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← 回首頁
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className={`text-6xl ${drawing ? "animate-bounce" : ""}`}>🎁</span>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          每次抽獎有 30% 的機率中獎
        </p>
      </div>

      <button
        onClick={handleDraw}
        disabled={drawing}
        className="rounded-full bg-violet-600 px-10 py-3 text-lg font-bold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {drawing ? "抽獎中..." : result ? "再抽一次" : "抽獎"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && !drawing && (
        <div
          className={`w-full max-w-md rounded-2xl p-6 text-center shadow-xl ${
            result.win
              ? "bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-950"
              : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          <div className="text-5xl">{result.win ? "🎉" : "😢"}</div>
          <p className="mt-3 text-2xl font-black">
            {result.win ? "中獎" : "未中獎"}
          </p>
          <p className="mt-1 text-sm">{result.message}</p>
        </div>
      )}

      {stats.total > 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          已抽 {stats.total} 次，中獎 {stats.wins} 次
        </p>
      )}
    </div>
  );
}
