import { Problema } from "../models/schema.js";

async function getProblematiche(req, res){
    try {
        const problema = await Problema.find();
        res.json(problema);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero delle problematiche " + error.message });
    }
}

async function createProblematica(req, res){
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ error: "Nome della problematica mancante" });
        }
        const nuovaProblematica = new Problema({ nome });
        const problema = await nuovaProblematica.save();
        res.json(problema);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante la creazione della problematica " + error.message });
    }
}

async function getProblematicaById(req, res){
    try {
        const id = req.params.id;
        const problema = await Problema.findById(id);
        if (!problema) {
            return res.status(404).json({ error: "Problematica non trovata" });
        }
        res.json(problema);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante il recupero della problematica " + error.message });
    }
}

async function updateProblematica(req, res){
    try {
        const id = req.params.id;
        const { nome } = req.body;

        const aggiornamento = {};
        if (nome) aggiornamento.nome = nome;

        const problemaAggiornato = await Problema.findByIdAndUpdate(id, aggiornamento, { new: true });
        if (!problemaAggiornato) {
            return res.status(404).json({ error: "Problematica non trovata" });
        }
        res.json(problemaAggiornato);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Errore durante l'aggiornamento della problematica " + error.message });
    }
}

export { getProblematiche, createProblematica, getProblematicaById, updateProblematica }