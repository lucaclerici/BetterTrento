import { Via } from "../models/schema.js";
//Via : {strada, citta, codicePostale, provincia, nazione}

async function getVie(req, res){
    try {
        const vie = await Via.find();
        res.json(vie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero delle vie " + error.message });
    }
}

async function getVieByString(req, res){
    try {
        const string = req.params.string;
        const vie = await Via.find({ nome: { $regex: string, $options: "i" } });
        res.json(vie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero delle vie " + error.message });
    }
}

async function getViaById(req, res){
    try {
        const id = req.params.id;
        const via = await Via.findById(id);
        res.json(via);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero della via " + error.message });
    }
}

//per l'autocomplete, quando c'è l'inserimento da parte dell'utente della via
async function cercaVie(req, res) {
  try {
    const query = req.query.query;

    if (!query) {
      return res.json([]);
    }

    //Usiamo 'strada' (che è il campo reale del DB) al posto di 'nome'
    // E usiamo $options: "i" per ignorare maiuscole e minuscole
    const vie = await Via.find({ 
      strada: { $regex: query, $options: "i" } 
    }).limit(20); // Alzato a 20 per darti molte più vie simultanee nella tendina

    res.json(vie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Errore durante la ricerca delle vie: " + error.message });
  }
}


export { getVie, getVieByString, getViaById, cercaVie}