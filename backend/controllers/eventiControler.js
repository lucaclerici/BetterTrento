import { Evento } from "../models/schema.js";

const getEventiByVia = async (idVia) => {
    if (!idVia) {return { error: "ID della via mancante" };}
    try {
        const eventi = await Evento.find({ via: idVia }).populate("via");
        return eventi;
    } catch (error) {return { error: "Errore durante il recupero degli eventi " + error.message };}
}

const getEventoById = async (id) => {
    if (!id) {return { error: "ID dell'evento mancante" };}
    try {
        const evento = await Evento.findById(id).populate("via");
        return evento;
    } catch (error) {return { error: "Errore durante il recupero dell'evento " };}
}

const createEvento = async (evento) => {
    if (!evento) {return { error: "Dati dell'evento mancanti" };}
    try {
        const newEvento = new Evento(evento);
        await newEvento.save();
        return newEvento;
    } catch (error) {return { error: "Errore durante la creazione dell'evento " + error.message };}
}

const updateEvento = async (id, evento) => {
    if (!id) {return { error: "ID dell'evento mancante" };}
    if (!evento) {return { error: "Dati dell'evento mancanti" };}
    try {
        const updatedEvento = await Evento.findByIdAndUpdate(id, evento, { new: true });
        return updateEvento;
    } catch (error) {return { error: "Errore durante l'aggiornamento dell'evento " + error.message };}
}

export { getEventiByVia, getEventoById, createEvento, updateEvento }