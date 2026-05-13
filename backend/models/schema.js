import mongoose from "mongoose";
const { Schema , SchemaTypes } = mongoose;

const userSchema = new Schema({
    email : {type: String, required: true},
    password : {type: String, required: true},
    nome: {type: String, required: true},
    cognome: {type: String, required: true},
    via: {type: SchemaTypes.ObjectId, ref: "Via"},
    ruolo: {type: String, enum: ["UTENTE", "AMMINISTRATORE"], required: true},
    bloccato: {type: Boolean, default: false}
})
const Utente = mongoose.model("Utente", userSchema);

const viaSchema = new Schema({
    strada: {type: String, required: true},
    citta: {type: String, required: true},
    codicePostale: {type: String, required: true},
    provincia: {type: String, required: true},
    nazione: {type: String, required: true}
})
const Via = mongoose.model("Via", viaSchema);

const eventoSchema = new Schema({
    nome: {type: String, required: true},
    descrizione: {type: String, required: true},
    data: {type: Date, required: true},
    via: {type: SchemaTypes.ObjectId, ref: "Via"},
})
const Evento = mongoose.model("Evento", eventoSchema);

const segnalazioneSchema = new Schema({
    nome: {type: String, required: true},
    descrizione: {type: String, required: true},
    data: {type: Date, required: true},
    via: {type: SchemaTypes.ObjectId, ref: "Via"},
    immagini: [{type: String}],
    utente: {type: SchemaTypes.ObjectId, ref: "Utente"},
    stato : {type: String, enum: ["APERTA", "INCARICO", "RISOLTA","RESPINTA"], default: "APERTA"},
    problema: {type: SchemaTypes.ObjectId, ref: "Problema"}
})
const Segnalazione = mongoose.model("Segnalazione", segnalazioneSchema);

const problemaSchema = new Schema({
    nome: {type: String, required: true},
})
const Problema = mongoose.model("Problema", problemaSchema);

export { Utente, Via, Evento, Segnalazione, Problema }