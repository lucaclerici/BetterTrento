import { Evento } from "../models/schema.js";

async function tuttiEventi(req, res) {
    const lista = await Evento
        .find()
        .populate("nome")
        .populate("data")
        .populate("via")
        .populate("descrizione");

    res.json(lista);
}

async function getEventiByVia(req, res) {
    try {
        const idVia = req.params.via;
        const eventi = await Evento.find({ via: idVia }).populate("via");
        res.json(eventi);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero degli eventi " + error.message });
    }
}

async function getEventoById(req, res) {
    try {
        const id = req.params.id;
        const evento = await Evento.findById(id).populate("via");
        res.json(evento);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero dell'evento " + error.message });
    }
}

async function createEvento(req, res) {
    try {
        const { nome, descrizione, data, via } = req.body;
        if (!nome || !descrizione || !data || !via) {
            return res.status(400).json({ error: "Dati dell'evento mancanti" });
        }

        const newEvento = new Evento({ nome, descrizione, data, via });
        const evento = await newEvento.save();
        res.json(evento);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Errore durante la creazione dell'evento " + error.message });
    }
}

async function updateEvento(req, res) {
    try {
        const id = req.params.id;
        const { nome, descrizione, data, via } = req.body;

        const aggiornamento = {};
        if (nome) aggiornamento.nome = nome;
        if (descrizione) aggiornamento.descrizione = descrizione;
        if (data) aggiornamento.data = data;
        if (via) aggiornamento.via = via;

        const eventoAggiornato = await Evento.findByIdAndUpdate(id, aggiornamento, { new: true });
        if (!eventoAggiornato) {
            return res.status(404).json({ error: "Evento non trovato" });
        }
        res.json(eventoAggiornato);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante l'aggiornamento dell'evento " + error.message });
    }
}

async function eliminaEvento(req, res) {
    try {
        // Cancella segnalazione dal DB
        await Evento.findByIdAndDelete(req.params.id);

        res.json({ messaggio: "Evento eliminato correttamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante l'eliminazione dell'evento " + error.message });
    }
}

export { tuttiEventi, getEventiByVia, getEventoById, createEvento, updateEvento, eliminaEvento }