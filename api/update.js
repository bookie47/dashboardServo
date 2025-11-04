let latestData = {};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // ✅ อ่าน raw body แล้วแปลงเป็น JSON
      let data = "";
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => {
        try {
          const json = JSON.parse(data);
          latestData = { ...json, time: new Date().toISOString() };
          res.status(200).json({ status: "ok" });
        } catch (err) {
          res.status(400).json({ error: "invalid json" });
        }
      });
    } catch (err) {
      res.status(400).json({ error: "invalid json" });
    }
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
}

// แชร์ข้อมูลให้ /api/data.js ใช้
export const getData = () => latestData;
