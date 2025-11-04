// api/update.js
let latestData = {}; // ข้อมูลล่าสุดจะอยู่ใน memory ชั่วคราว

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      latestData = { ...body, time: new Date().toISOString() };
      return res.status(200).json({ status: "ok" });
    } catch (err) {
      return res.status(400).json({ error: "invalid json" });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}

// Export memory (shared state)
export const getData = () => latestData;
