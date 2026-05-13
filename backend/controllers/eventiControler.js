import { Evento } from "../models/schema.js";

const getEventiByVia = async (idVia) => {
    const eventi = await Evento.find({ via: idVia }).populate("via");
    return eventi;
}

const getEventoById = async (id) => {
    const evento = await Evento.findById(id).populate("via");
    return evento;
}

const createEvento = async (evento) => {
    const newEvento = new Evento(evento);
    await newEvento.save();
    return newEvento;
}

const updateEvento = async (id, evento) => {
    const updatedEvento = await Evento.findByIdAndUpdate(id, evento, { new: true });
    return updatedEvento;
}

export { getEventiByVia, getEventoById, createEvento, updateEvento }