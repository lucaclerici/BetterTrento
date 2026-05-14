//GESTIONE SEGNALAZIONI
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route segnalazioni OK");
});


router.post("/", auth, creaSegnalazione);//per creare una segnalazione

router.get("/mie", auth, mieSegnalazioni);//per vedere le segnalazioni create di un singolo utente
router.get("/", auth, autorizzaRuoli("AMMINISTRATORE"), tutteSegnalazioni);//per vedere tutte le segnalazioni (solo admin)
router.get("/:id", auth, dettaglioSegnalazione);//per vedere nel dettaglio una segnalazione
router.get("/per-via/:idVia", auth, segnalazioniPerVia);//per vedere tutte le segnalazioni di una data via

router.put("/:id/stato", auth, autorizzaRuoli("AMMINISTRATORE"), aggiornaStato);//per cambiare lo stato di una via (solo admin)

router.delete("/:id", auth, autorizzaRuoli("AMMINISTRATORE"), eliminaSegnalazione);//per eliminare una segnalazione (solo admin)


export default router;