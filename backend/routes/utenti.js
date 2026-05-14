//REGISTRAZIONE, LOGIN E GESTIONE UTENTI

import express from "express";
import { registraUtente } from "../controllers/utentiController.js";//per registrazione
import { loginUtente } from "../controllers/utentiController.js"; //per login
import { auth } from "../middleware/auth.js";//per validazione
import { getProfilo } from "../controllers/utentiController.js";//per dare i dati del profilo dell'utente
import { aggiornaProfilo } from "../controllers/utentiController.js";//per modificare il profilo

const router = express.Router();

// POST /api/utenti/registrazione
router.post("/registrazione", registraUtente);
// POST /api/utenti/login
router.post("/login", loginUtente);
//route protetta, ritorna i dati utente
router.get("/me", auth, getProfilo);
//route protetta, per modificare il profilo
router.put("/me", auth, aggiornaProfilo);



export default router;