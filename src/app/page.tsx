import Link from "next/link";

const TOOLS = [
  {
    href: "/lottery",
    icon: "🎡",
    title: "抽獎小工具",
    description: "輸入名單、轉動轉盤，隨機抽出幸運兒。",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    border: "border-emerald-100 dark:border-emerald-900/40",
    linkColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/pomodoro",
    icon: "🍅",
    title: "番茄鐘",
    description: "專注與休息交替計時，提升工作效率。",
    badgeBg: "bg-red-100 dark:bg-red-900/40",
    border: "border-red-100 dark:border-red-900/40",
    linkColor: "text-red-600 dark:text-red-400",
  },
  {
    href: "/fortune",
    icon: "🎋",
    title: "好運抽籤",
    description: "誠心抽籤，隨機看看今天的運勢好不好。",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    border: "border-amber-100 dark:border-amber-900/40",
    linkColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* decorative background blobs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.5) 0%, rgba(52,211,153,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,113,133,0.45) 0%, rgba(251,113,133,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/3 top-96 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0) 70%)",
        }}
      />

      <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-black/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-black dark:text-zinc-50"
          >
            <span className="text-2xl">🧰</span>
            Ray.Lee 的小工具箱
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="transition-colors hover:text-black dark:hover:text-zinc-50"
              >
                {tool.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-[1] flex-1">
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 pb-16 pt-20 text-center">
          <span className="rounded-full bg-zinc-900/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
            TOOLKIT
          </span>
          <h1 className="text-4xl font-black tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Ray.Lee 的小工具箱
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            收集幾個順手好用的小工具，抽獎、計時、抽籤，通通一頁搞定。
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group flex flex-col rounded-2xl border ${tool.border} bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${tool.badgeBg}`}
              >
                {tool.icon}
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {tool.description}
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${tool.linkColor}`}
              >
                前往使用
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </section>
      </main>

      <footer className="relative z-[1] border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        <p>
          © {new Date().getFullYear()} Ray.Lee 的小工具箱．使用 Next.js 與
          Tailwind CSS 打造
        </p>
      </footer>
    </div>
  );
}
