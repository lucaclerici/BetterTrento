import { Utente, Via, Evento, Problema, Segnalazione } from "./schema.js";

const via1 = await Via.create({
    strada: "Via Roma",
    citta: "Trento",
    codicePostale: "38100",
    provincia: "TN",
    nazione: "Italia"
});

const via2 = await Via.create({
    strada: "Via Dante",
    citta: "Trento",
    codicePostale: "38100",
    provincia: "TN",
    nazione: "Italia"
});

const utente1 = await Utente.create({
    email: "utente1@example.com",
    password: "password1",
    nome: "Mario",
    cognome: "Rossi",
    via: via1._id,
    ruolo: "UTENTE"
});

const utente2 = await Utente.create({
    email: "utente2@example.com",
    password: "password2",
    nome: "Maria",
    cognome: "Verdi",
    via: via2._id,
    ruolo: "UTENTE"
});

const evento1 = await Evento.create({
    nome: "Festa di Primavera",
    descrizione: "Una festa per celebrare l'arrivo della primavera",
    data: new Date("2024-04-21"),
    via: via1._id
});

const evento2 = await Evento.create({
    nome: "Ciao",
    descrizione: "Ciao",
    data: new Date("2024-05-01"),
    via: via2._id
});

const problema1 = await Problema.create({
    nome: "Buche stradali"
});

const problema2 = await Problema.create({
    nome: "Illuminazione insufficiente"
});

const segnalazione1 = await Segnalazione.create({
    nome: "Buche in Via Roma",
    descrizione: "Ci sono molte buche in Via Roma che rendono difficile la guida",
    data: new Date("2024-04-22"),
    via: via1._id,
    immagini: ["https://example.com/buche1.jpg", "https://example.com/buche2.jpg"],
    utente: utente1._id,
    problema: problema1._id
});

const segnalazione2 = await Segnalazione.create({
    nome: "Illuminazione in Via Dante",
    descrizione: "L'illuminazione in Via Dante è insufficiente, soprattutto di notte",
    data: new Date("2024-04-22"),
    via: via2._id,
    immagini: ["https://example.com/illuminazione1.jpg", "https://example.com/illuminazione2.jpg"],
    utente: utente2._id,
    problema: problema2._id
});