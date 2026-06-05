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

    const nuova = new Segnalazione({//creiamo subito la segnalazione
      nome,
      descrizione,
      via,
      problema,
      utente: req.utente.id,
      immagini: null, // <-- SOLO LINK che punta all'immagine in cloudiary, inizialmente null, perchè non abbiamo ancora il link di cloudiary all'img, una volta che l'img è caricata il link viene aggiornato
    });

    await nuova.save();
    res.json(nuova);

    //immagine caricata in backgorund
    if (req.file) {
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "segnalazioni" },
          async (error, result) => {
            if (error){
              console.log("Errore upload cloudiary in background:", error);
              reject(error);
            }
            else{
              await Segnalazione.findByIdAndUpdate(nuova._id, {
                immagini: result.secure_url //aggiornamo il link all'img sul DB dopo che è stata caricata su cloudiary
              });
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });
    }

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
  try {
    const seg = await Segnalazione.findById(req.params.id);

    if (!seg) {
      return res.status(404).json({ errore: "Segnalazione non trovata" });
    }


    // Normalizzazione
    let immagini = seg.immagini;
    if (Array.isArray(immagini)) immagini = immagini[0];
    if (typeof immagini !== "string") immagini = null;

    // Cancella immagine da Cloudinary
    const publicId = extractPublicId(immagini);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // Cancella segnalazione dal DB
    await Segnalazione.findByIdAndDelete(req.params.id);

    res.json({ messaggio: "Segnalazione eliminata correttamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore server" });
  }
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

//per cancellare la foto della segnalazione in cloudiary
function extractPublicId(url) {

  // Se non è una stringa non possiamo estrarre nulla
  if (!url || typeof url !== "string") return null;

  try {

    const parts = url.split("/");

    // Ultimo elemento: "abc123.jpg"
    const file = parts.pop();

    // Penultimo elemento: "segnalazioni"
    const folder = parts.pop();

    // Public ID: "segnalazioni/abc123"
    const publicId = `${folder}/${file.split(".")[0]}`;

    return publicId;

  } catch (err) {
    console.error("Errore extractPublicId:", err);
    return null;
  }
}
