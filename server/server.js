// server.js
import express from "express";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🌐 Proxy route สำหรับรับค่าจาก ESP32
app.post("/api/update", async (req, res) => {
  console.log("📩 Data from ESP32:", req.body);

  // ส่งต่อไปยัง dashboard บน Vercel
  try {
    const r = await fetch("https://dashboard-servo.vercel.app/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await r.text();
    res.status(200).send(data);
  } catch (e) {
    console.error("❌ Forward error:", e);
    res.status(500).send(e.toString());
  }
});

// 🖥️ Serve dashboard static files (optional)
app.use(express.static("public"));

// 🚀 Start HTTP + WebSocket server
const server = app.listen(3000, () => console.log("✅ Proxy + WS running on port 3000"));

// 🔄 WebSocket broadcast
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("🌐 Dashboard connected");
  ws.on("message", (msg) => {
    console.log("From ESP32:", msg.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) client.send(msg.toString());
    });
  });
});
