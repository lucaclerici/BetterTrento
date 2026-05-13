//crea segnalazioni e gestione segnalazioni
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route segnalazioni OK");
});

export default router;
