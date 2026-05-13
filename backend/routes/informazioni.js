//lista di segnalazioni e eventi
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route informazioni OK");
});

export default router;
