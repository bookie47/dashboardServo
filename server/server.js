// server.js
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = app.listen(3000, () => console.log("HTTP + WS running"));

// Serve dashboard files
app.use(express.static("public"));

const wss = new WebSocketServer("https://dashboard-servo.vercel.app/:3000");
ws.onmessage = (e) => updateServo(JSON.parse(e.data));

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (msg) => {
    console.log("From ESP32:", msg.toString());
    // ส่งต่อให้ dashboard ทุกคน
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) client.send(msg.toString());
    });
  });
});
