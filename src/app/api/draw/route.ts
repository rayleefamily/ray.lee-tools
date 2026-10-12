const WIN_RATE = 0.3;

export async function POST() {
  const win = Math.random() < WIN_RATE;
  return Response.json(
    { win, message: win ? "恭喜中獎！" : "很可惜，沒中獎，再試一次吧！" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
