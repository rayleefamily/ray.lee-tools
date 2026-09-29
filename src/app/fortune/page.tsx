"use client";

import { useState } from "react";
import Link from "next/link";

type LevelName = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶" | "大凶";

interface LevelInfo {
  name: LevelName;
  weight: number;
  gradient: string;
  textColor: string;
  ring: string;
}

const LEVELS: LevelInfo[] = [
  {
    name: "大吉",
    weight: 5,
    gradient: "from-amber-300 to-yellow-500",
    textColor: "text-amber-900",
    ring: "ring-amber-400",
  },
  {
    name: "中吉",
    weight: 10,
    gradient: "from-orange-300 to-orange-500",
    textColor: "text-orange-950",
    ring: "ring-orange-400",
  },
  {
    name: "小吉",
    weight: 14,
    gradient: "from-yellow-200 to-yellow-400",
    textColor: "text-yellow-900",
    ring: "ring-yellow-300",
  },
  {
    name: "吉",
    weight: 20,
    gradient: "from-lime-300 to-green-400",
    textColor: "text-green-950",
    ring: "ring-green-300",
  },
  {
    name: "末吉",
    weight: 14,
    gradient: "from-teal-200 to-sky-400",
    textColor: "text-sky-950",
    ring: "ring-sky-300",
  },
  {
    name: "凶",
    weight: 10,
    gradient: "from-slate-400 to-slate-600",
    textColor: "text-slate-50",
    ring: "ring-slate-400",
  },
  {
    name: "大凶",
    weight: 5,
    gradient: "from-red-900 to-black",
    textColor: "text-red-50",
    ring: "ring-red-700",
  },
];

const POEMS: Record<LevelName, string[]> = {
  大吉: ["萬事亨通，心想事成", "貴人相助，好運連連"],
  中吉: ["諸事順遂，穩中求進", "努力有成，苦盡甘來"],
  小吉: ["小有收穫，步步為營", "平順向前，宜守不宜進"],
  吉: ["平安是福，順其自然", "循序漸進，靜待花開"],
  末吉: ["先苦後甘，耐心等待", "起伏難免，穩住心態"],
  凶: ["諸事不順，宜靜不宜動", "小心謹慎，避免衝突"],
  大凶: ["諸事艱難，凡事三思", "低調行事，靜候時機好轉"],
};

const CATEGORIES: { key: string; icon: string }[] = [
  { key: "事業", icon: "💼" },
  { key: "財運", icon: "💰" },
  { key: "愛情", icon: "💕" },
  { key: "健康", icon: "🍀" },
];

const CATEGORY_REMARKS: Record<LevelName, Record<string, string[]>> = {
  大吉: {
    事業: ["事業如日中天，把握契機大展身手", "主管賞識，晉升機會就在眼前"],
    財運: ["財源廣進，偏財運旺", "投資眼光精準，收穫豐碩"],
    愛情: ["桃花朵朵開，甜蜜升溫", "單身者易遇良緣"],
    健康: ["精神飽滿，活力滿分", "身心平衡，百病不侵"],
  },
  中吉: {
    事業: ["穩紮穩打，工作漸入佳境", "團隊合作順利，成果可期"],
    財運: ["收入穩定，理財有道", "小額進帳，積少成多"],
    愛情: ["感情穩定加溫", "真誠溝通增進默契"],
    健康: ["體力充沛，作息規律更佳", "適度運動效果顯著"],
  },
  小吉: {
    事業: ["按部就班，勿躁進", "小成績值得肯定"],
    財運: ["財務平穩，量入為出", "避免衝動消費"],
    愛情: ["感情緩步升溫", "多些耐心會有進展"],
    健康: ["注意作息，避免熬夜", "小病痛提醒你該休息"],
  },
  吉: {
    事業: ["維持現狀，蓄積實力", "踏實做事，機會自然到來"],
    財運: ["收支平衡，無大起落", "理性消費為上策"],
    愛情: ["關係平穩發展", "多花時間陪伴對方"],
    健康: ["整體平穩，留意小毛病", "規律飲食有助健康"],
  },
  末吉: {
    事業: ["進度稍緩，別灰心", "溝通不順，多點耐心"],
    財運: ["財運起伏，謹慎理財", "避免借貸投資"],
    愛情: ["感情略有波折，多溝通", "單身者宜再觀察"],
    健康: ["容易疲勞，注意休息", "小心腸胃不適"],
  },
  凶: {
    事業: ["計畫易生變，宜多觀察", "與人合作要更謹慎"],
    財運: ["財務吃緊，避免大額支出", "小心破財，遠離賭博投機"],
    愛情: ["感情易生誤會，多包容", "單身者感情運低迷"],
    健康: ["體力下滑，注意保暖", "小心意外受傷"],
  },
  大凶: {
    事業: ["決策宜謹慎，避免衝動行事", "低潮期，先求穩再求進"],
    財運: ["財運低迷，避免任何投資", "嚴守荷包，量入為出"],
    愛情: ["感情波動大，冷靜以對", "單身者暫緩告白"],
    健康: ["健康亮紅燈，務必多休息", "小心交通與意外"],
  },
};

interface FortuneResult {
  level: LevelInfo;
  poem: string;
  remarks: Record<string, string>;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawFortune(): FortuneResult {
  const totalWeight = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let roll = Math.random() * totalWeight;
  let level = LEVELS[LEVELS.length - 1];
  for (const l of LEVELS) {
    if (roll < l.weight) {
      level = l;
      break;
    }
    roll -= l.weight;
  }

  const poem = pickRandom(POEMS[level.name]);
  const remarks: Record<string, string> = {};
  for (const c of CATEGORIES) {
    remarks[c.key] = pickRandom(CATEGORY_REMARKS[level.name][c.key]);
  }

  return { level, poem, remarks };
}

export default function FortunePage() {
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);

  const handleDraw = () => {
    if (drawing) return;
    setDrawing(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(drawFortune());
      setDrawing(false);
    }, 700);
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-gradient-to-b from-red-50 to-white px-6 py-12 dark:from-zinc-950 dark:to-black">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          好運抽籤
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← 回首頁
        </Link>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span
          className={`text-6xl transition-transform ${
            drawing ? "animate-bounce" : ""
          }`}
        >
          🎋
        </span>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          誠心抽籤，看看今日運勢
        </p>
      </div>

      <button
        onClick={handleDraw}
        disabled={drawing}
        className="rounded-full bg-red-700 px-10 py-3 text-lg font-bold text-yellow-100 ring-2 ring-yellow-400 transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {drawing ? "抽籤中..." : result ? "再抽一次" : "抽籤"}
      </button>

      {result && !drawing && (
        <div
          className={`w-full max-w-md rounded-2xl bg-gradient-to-br ${result.level.gradient} p-1 shadow-xl`}
        >
          <div className="rounded-[14px] bg-white/90 p-6 dark:bg-zinc-900/90">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`rounded-full bg-gradient-to-br ${result.level.gradient} px-6 py-2 text-3xl font-black ${result.level.textColor} ring-4 ${result.level.ring}`}
              >
                {result.level.name}
              </span>
              <p className="mt-3 text-center text-base font-medium text-zinc-800 dark:text-zinc-100">
                {result.poem}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <div
                  key={c.key}
                  className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    <span>{c.icon}</span>
                    <span>{c.key}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {result.remarks[c.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
