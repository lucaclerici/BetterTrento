//login, logout e gestione profilo
import express from "express";
import { registraUtente } from "../controllers/utentiController.js";

const router = express.Router();

// POST /api/utenti/registrazione
router.post("/registrazione", registraUtente);

export default router;

