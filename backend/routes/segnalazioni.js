//crea segnalazioni e gestione segnalazioni
import express from "express";
const router = express.Router();

import { getProblematiche, createProblematica, getProblematicaById, updateProblematica } from "../controllers/segnalazioniControler.js";

router.get("/", (req, res) => {
  res.send("Route segnalazioni OK");
});

//get segnalazione by id

//get sagnalazioni by via

//create segnalazione

//update segnalazione

//risolvi segnalazione

//get problematiche
router.get("/problematiche", getProblematiche);

//crea problematica
router.post("/createProbleatica", createProblematica);

//get problematica by id
router.get("/problematica/:id", getProblematicaById);

//update problematica
router.post("/problematica/:id", updateProblematica);

export default router;
