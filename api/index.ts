// api/index.ts
export default async function handler(req: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Dummy adapter aktif. Tidak konek ke Hono atau DB.",
      time: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
