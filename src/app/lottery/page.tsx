"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const WHEEL_COLORS = ["#0f766e", "#14b8a6"];

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;
const HUB_RADIUS = 44;
const BULB_COUNT = 14;
const SPIN_DURATION_MS = 4200;

function polarPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

const bulbs = Array.from({ length: BULB_COUNT }, (_, i) =>
  polarPoint((360 / BULB_COUNT) * i, RADIUS + 10)
);

export default function LotteryPage() {
  const [rawInput, setRawInput] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const segmentAngle = names.length > 0 ? 360 / names.length : 0;

  const applyNames = () => {
    const parsed = rawInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setNames(parsed);
    setWinner(null);
  };

  const slices = useMemo(() => {
    if (names.length === 0) return [];
    return names.map((name, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      const p1 = polarPoint(startAngle, RADIUS);
      const p2 = polarPoint(endAngle, RADIUS);
      const largeArc = segmentAngle > 180 ? 1 : 0;
      const path =
        names.length === 1
          ? `M ${CENTER} ${CENTER - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER - 0.01} ${CENTER - RADIUS} Z`
          : `M ${CENTER} ${CENTER} L ${p1.x} ${p1.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;

      const midAngle = startAngle + segmentAngle / 2;
      const labelPos = polarPoint(midAngle, RADIUS * 0.6);

      return {
        path,
        color: WHEEL_COLORS[i % WHEEL_COLORS.length],
        name,
        midAngle,
        labelPos,
      };
    });
  }, [names, segmentAngle]);

  const handleSpin = () => {
    if (spinning || names.length < 2) return;

    const winnerIndex = Math.floor(Math.random() * names.length);
    const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetMod = (360 - winnerCenterAngle) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((targetMod - currentMod) + 360) % 360;
    const extraSpins = 5;
    const newRotation = rotation + extraSpins * 360 + delta;

    setWinner(null);
    setSpinning(true);
    setRotation(newRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setWinner(names[winnerIndex]);
    }, SPIN_DURATION_MS);
  };

  const canSpin = names.length >= 2 && !spinning;

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-emerald-800 via-teal-900 to-emerald-950 px-6 py-8">
      {/* sparkle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* soft glow behind wheel */}
      <div
        className="pointer-events-none absolute left-1/2 top-44 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(110,231,183,0.45) 0%, rgba(110,231,183,0) 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md items-center justify-between">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          ←
        </Link>
        <span className="text-xs tracking-widest text-white/60">
          抽獎小工具
        </span>
      </div>

      <div className="relative z-10 mt-3 flex flex-col items-center">
        <h1
          className="text-4xl font-black tracking-wide"
          style={{
            color: "#a3e635",
            WebkitTextStroke: "1.5px #14532d",
            textShadow: "0 3px 0 #14532d, 0 6px 10px rgba(0,0,0,0.4)",
          }}
        >
          幸運大轉盤
        </h1>
        <p className="mt-2 text-sm font-medium text-white/90">
          {names.length > 0
            ? `抽獎名單共 ${names.length} 人`
            : "尚未設定抽獎名單"}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {/* static rim bulbs */}
          {bulbs.map((b, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-emerald-100 shadow-[0_0_6px_2px_rgba(167,243,208,0.8)]"
              style={{ left: b.x, top: b.y, transform: "translate(-50%, -50%)" }}
            />
          ))}

          {/* pointer */}
          <div
            className="absolute left-1/2 z-20 h-5 w-5 -translate-x-1/2 rotate-45 rounded-sm bg-gradient-to-br from-emerald-100 to-emerald-400 shadow-md ring-2 ring-emerald-800"
            style={{ top: -6 }}
          />

          {/* wheel */}
          <div
            className="h-full w-full rounded-full ring-4 ring-emerald-300 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                : "none",
            }}
          >
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
              {slices.length === 0 ? (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#134e4a" />
              ) : (
                slices.map((slice, i) => (
                  <g key={i}>
                    <path
                      d={slice.path}
                      fill={slice.color}
                      stroke="#052e28"
                      strokeWidth="1"
                    />
                    <text
                      x={slice.labelPos.x}
                      y={slice.labelPos.y}
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${slice.midAngle}, ${slice.labelPos.x}, ${slice.labelPos.y})`}
                    >
                      {slice.name}
                    </text>
                  </g>
                ))
              )}
            </svg>
          </div>

          {/* center hub / spin button */}
          <button
            onClick={handleSpin}
            disabled={!canSpin}
            className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-b from-emerald-100 to-emerald-300 font-black text-emerald-900 ring-4 ring-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ width: HUB_RADIUS * 2, height: HUB_RADIUS * 2 }}
          >
            <span className="text-sm leading-tight">
              {spinning ? "抽獎中" : "開始"}
            </span>
            <span className="text-sm leading-tight">
              {spinning ? "" : "抽獎"}
            </span>
          </button>
        </div>
      </div>

      {winner && !spinning && (
        <div className="relative z-10 mt-8 rounded-full bg-emerald-100 px-6 py-2 text-lg font-bold text-emerald-900 shadow-lg ring-2 ring-emerald-300">
          🎉 中獎者：{winner}
        </div>
      )}

      {!canSpin && names.length < 2 && (
        <p className="relative z-10 mt-6 text-sm text-white/80">
          請先在下方輸入至少 2 位名單
        </p>
      )}

      <div className="relative z-10 mt-8 w-full max-w-md rounded-2xl bg-white/95 p-5 shadow-xl dark:bg-zinc-900/95">
        <label
          htmlFor="names"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          輸入名單（每行一位，至少 2 位）
        </label>
        <textarea
          id="names"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={6}
          placeholder={"小明\n小華\n小美"}
          className="mt-2 w-full resize-none rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm text-black outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          onClick={applyNames}
          className="mt-3 w-full rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          更新名單
        </button>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          目前名單：{names.length > 0 ? names.join("、") : "尚未設定"}
        </p>
      </div>
    </div>
  );
}
