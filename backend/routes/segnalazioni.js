//GESTIONE SEGNALAZIONI
import express from "express";
import { auth } from "../middleware/auth.js";//per validazione
import { autorizzaRuoli } from "../middleware/ruoli.js";
import { creaSegnalazione } from "../controllers/segnalazioniController.js";
import { mieSegnalazioni } from "../controllers/segnalazioniController.js"; 
import { dettaglioSegnalazione } from "../controllers/segnalazioniController.js";
import { tutteSegnalazioni } from "../controllers/segnalazioniController.js"; 
import { segnalazioniPerVia } from "../controllers/segnalazioniController.js";
import { aggiornaStato } from "../controllers/segnalazioniController.js"; 
import { eliminaSegnalazione } from "../controllers/segnalazioniController.js"; 
import { getProblemi } from "../controllers/segnalazioniController.js"; 
import upload from "../middleware/upload.js";//per caricare la foto della segnalazione
import cloudinary from "../config/cloudinary.js";//per salvare la foto in cloud



const router = express.Router();

router.post("/", auth, upload.single("immagini"), creaSegnalazione);//per creare una segnalazione

router.get("/mie", auth, mieSegnalazioni);//per vedere le segnalazioni create di un singolo utente
router.get("/", auth, autorizzaRuoli("AMMINISTRATORE"), tutteSegnalazioni);//per vedere tutte le segnalazioni (solo admin)

router.get("/problemi", auth, getProblemi);//restituisce i problemi della categoria presenti nel DB, serve per creazione di una segnalazione

router.get("/:id", auth, dettaglioSegnalazione);//per vedere nel dettaglio una segnalazione
router.get("/per-via/:idVia", segnalazioniPerVia);//per vedere tutte le segnalazioni di una data via -> accessibile a tutti

router.put("/:id/stato", auth, autorizzaRuoli("AMMINISTRATORE"), aggiornaStato);//per cambiare lo stato di una via (solo admin)

router.delete("/:id", auth, autorizzaRuoli("AMMINISTRATORE"), eliminaSegnalazione);//per eliminare una segnalazione (solo admin)


export default router;