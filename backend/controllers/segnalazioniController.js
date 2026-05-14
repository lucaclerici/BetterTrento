import { Segnalazione, Via, Problema } from "../models/schema.js";

//CREA SEGNALAZIONE -> POST /api/segnalazioni
export async function creaSegnalazione(req, res) {
  try {
    const { nome, descrizione, data, via, problema, immagini } = req.body;

    const nuova = await Segnalazione.create({
      nome,
      descrizione,
      data,
      via,        // ObjectId della via
      problema,   // ObjectId del problema
      immagini,
      utente: req.utente.id
    });

    const popolata = await Segnalazione.findById(nuova._id)
      .populate("via")
      .populate("problema")
      .populate("utente", "nome cognome email");

    res.status(201).json(popolata);

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}


//LISTA SEGNALAZIONI CREATE DA UN UTENTE -> GET /api/segnalazioni/mie
export async function mieSegnalazioni(req, res) {
  const lista = await Segnalazione
    .find({ utente: req.utente.id })
    .populate("via")
    .populate("problema");

  res.json(lista);
}


//LISTA TUTTE LE SEGNALAZIONI (per admin) -> GET /api/segnalazioni
export async function tutteSegnalazioni(req, res) {
  const lista = await Segnalazione
    .find()
    .populate("via")
    .populate("problema")
    .populate("utente", "nome cognome email");

  res.json(lista);
}


//VEDI IN DETTAGLIO LA SEGNALAZIONE -> GET /api/segnalazioni/:id
export async function dettaglioSegnalazione(req, res) {
  const seg = await Segnalazione
    .findById(req.params.id)
    .populate("via")
    .populate("problema")
    .populate("utente", "nome cognome email");

  if (!seg)
    return res.status(404).json({ errore: "Segnalazione non trovata" });

  // Utente normale può vedere solo le sue
  if (req.utente.ruolo !== "AMMINISTRATORE" &&
      seg.utente._id.toString() !== req.utente.id) {
    return res.status(403).json({ errore: "Accesso negato" });
  }

  res.json(seg);
}


//AGGIORNAMENTO STATO DELLA SEGNALAZIONE (per admin) -> PUT /api/segnalazioni/:id/stato
export async function aggiornaStato(req, res) {
  const { stato } = req.body;

  const seg = await Segnalazione
    .findByIdAndUpdate(
      req.params.id,
      { stato },
      { new: true }
    )
    .populate("via")
    .populate("problema")
    .populate("utente", "nome cognome email");

  res.json(seg);
}


//ELIMINA SEGNALAZIONE (per admin) -> DELETE /api/segnalazioni/:id
export async function eliminaSegnalazione(req, res) {
  await Segnalazione.findByIdAndDelete(req.params.id);
  res.json({ messaggio: "Segnalazione eliminata" });
}


//VEDERE SEGNALAZIONI PER VIA -> GET /api/segnalazioni/per-via/:idVia
export async function segnalazioniPerVia(req, res) {
  const idVia = req.params.idVia;

  const lista = await Segnalazione
    .find({ via: idVia })
    .populate("via")
    .populate("problema")
    .populate("utente", "nome cognome email");

  res.json(lista);
}