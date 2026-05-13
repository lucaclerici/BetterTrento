//REGISTRAZIONE, LOGIN E GESTIONE UTENTI

import express from "express";
import { registraUtente } from "../controllers/utentiController.js";//per registrazione
import { loginUtente } from "../controllers/utentiController.js"; //per login

const router = express.Router();

// POST /api/utenti/registrazione
router.post("/registrazione", registraUtente);
// POST /api/utenti/login
router.post("/login", loginUtente);

//TEST per validazione token
import { auth } from "../middleware/auth.js";

router.get("/me", auth, (req, res) => {
  res.json({ utente: req.utente });
});

export default router;