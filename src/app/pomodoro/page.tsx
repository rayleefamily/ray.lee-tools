"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Mode = "work" | "break" | "longBreak";

const SESSIONS_BEFORE_LONG_BREAK = 4;
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODE_META: Record<
  Mode,
  { label: string; ring: string; accent: string }
> = {
  work: { label: "專注時間 🍅", ring: "#ef4444", accent: "text-red-600 dark:text-red-400" },
  break: { label: "短休息 ☕", ring: "#10b981", accent: "text-emerald-600 dark:text-emerald-400" },
  longBreak: { label: "長休息 🌿", ring: "#0ea5e9", accent: "text-sky-600 dark:text-sky-400" },
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const longBreakMinutes = breakMinutes * 3;

  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsInCycle, setSessionsInCycle] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const durationFor = (m: Mode) =>
    m === "work"
      ? workMinutes * 60
      : m === "break"
      ? breakMinutes * 60
      : longBreakMinutes * 60;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;

    if (mode === "work") {
      const nextSessions = sessionsInCycle + 1;
      const isLongBreak = nextSessions >= SESSIONS_BEFORE_LONG_BREAK;
      setTotalCompleted((c) => c + 1);
      setSessionsInCycle(isLongBreak ? 0 : nextSessions);
      const nextMode: Mode = isLongBreak ? "longBreak" : "break";
      setMode(nextMode);
      setSecondsLeft(durationFor(nextMode));
    } else {
      setMode("work");
      setSecondsLeft(durationFor("work"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleWorkMinutesChange = (value: number) => {
    const clamped = Math.min(120, Math.max(1, value));
    setWorkMinutes(clamped);
    if (mode === "work" && !isRunning) setSecondsLeft(clamped * 60);
  };

  const handleBreakMinutesChange = (value: number) => {
    const clamped = Math.min(60, Math.max(1, value));
    setBreakMinutes(clamped);
    if (!isRunning) {
      if (mode === "break") setSecondsLeft(clamped * 60);
      if (mode === "longBreak") setSecondsLeft(clamped * 3 * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setSessionsInCycle(0);
    setSecondsLeft(workMinutes * 60);
  };

  const meta = MODE_META[mode];
  const fraction = secondsLeft / durationFor(mode);
  const dashoffset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className="flex flex-1 flex-col items-center gap-10 bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          番茄鐘
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← 回首頁
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6">
        <span className={`text-lg font-semibold ${meta.accent}`}>
          {meta.label}
        </span>

        <div className="relative flex h-64 w-64 items-center justify-center">
          <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
            <circle
              cx="120"
              cy="120"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <circle
              cx="120"
              cy="120"
              r={RADIUS}
              fill="none"
              stroke={meta.ring}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="absolute text-5xl font-bold tabular-nums text-black dark:text-zinc-50">
            {formatTime(secondsLeft)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }, (_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i < sessionsInCycle
                  ? "bg-red-500"
                  : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning((r) => !r)}
            className="rounded-full bg-foreground px-8 py-3 text-base font-semibold text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {isRunning ? "暫停" : "開始"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-full border border-zinc-300 px-8 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            重置
          </button>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          已完成 {totalCompleted} 個番茄鐘
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="workMinutes"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            專注時長（分鐘）
          </label>
          <input
            id="workMinutes"
            type="number"
            min={1}
            max={120}
            value={workMinutes}
            disabled={isRunning}
            onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
            className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-right text-sm text-black outline-none focus:border-red-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="breakMinutes"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            短休息時長（分鐘）
          </label>
          <input
            id="breakMinutes"
            type="number"
            min={1}
            max={60}
            value={breakMinutes}
            disabled={isRunning}
            onChange={(e) => handleBreakMinutesChange(Number(e.target.value))}
            className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-right text-sm text-black outline-none focus:border-emerald-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          每完成 {SESSIONS_BEFORE_LONG_BREAK} 個專注時段，會自動進入
          {longBreakMinutes} 分鐘的長休息。
        </p>
      </div>
    </div>
  );
}
