export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "POST") {
    const body = await req.json();
    globalThis.latestData = { ...body, time: new Date().toISOString() };
    return res.status(200).json({ status: "ok" });
  }
  res.status(405).json({ error: "Method not allowed" });
}
