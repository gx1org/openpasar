export const config = {
  runtime: 'edge',
}

export default async function handler() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'API dummy running from Vercel Edge',
      time: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
