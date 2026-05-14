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

    const popolata = await nuova
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