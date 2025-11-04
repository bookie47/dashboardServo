// api/data.js
import { getData } from "./update.js";

export default function handler(req, res) {
  res.status(200).json(getData());
}
