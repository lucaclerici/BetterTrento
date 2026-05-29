import { Segnalazione, Via, Problema } from "../models/schema.js";
import cloudinary from "../config/cloudinary.js";//import cloudinary per salvataggio foto



//CREA SEGNALAZIONE -> POST /api/segnalazioni
export async function creaSegnalazione(req, res) {
  try {
    const nome = req.body.nome;
    const descrizione = req.body.descrizione;
    const via = req.body.via;
    const problema = req.body.problema;

    if (!nome || !descrizione || !via || !problema) {
      return res.status(400).json({ errore: "Dati mancanti" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "segnalazioni" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const nuova = new Segnalazione({
      nome,
      descrizione,
      via,
      problema,
      utente: req.utente.id,
      immagini: imageUrl, // <-- SOLO LINK che punta all'immagine
    });

    await nuova.save();
    res.json(nuova);

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore interno del server" });
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


//RESTITUISCE LE PROBLEMATICHE, che "categorizzano" una segnalazione
//serve per creare una segnalazione, l'utente sceglie una categoria, e il frontend inserisce il suo ID nella segnalazione
export async function getProblemi(req, res) {
  try {
    const problemi = await Problema.find();
    res.json(problemi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il recupero delle problematiche" });
  }
}