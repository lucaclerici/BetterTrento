//crea segnalazioni e gestione segnalazioni
import express from "express";
const router = express.Router();

import { getProblematiche, createProblematica, getProblematicaById, updateProblematica } from "../controllers/segnalazioniControler.js";

router.get("/", (req, res) => {
  res.send("Route segnalazioni OK");
});

//testing middleware ruoli per segnalazioni
import { auth } from "../middleware/auth.js";
import { autorizzaRuoli } from "../middleware/ruoli.js";

router.get("/solo-admin", auth, autorizzaRuoli("AMMINISTRATORE"), (req, res) => {
  res.json({ messaggio: "Accesso consentito: sei admin" });
});

export default router;
