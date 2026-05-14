import { Utente } from "../models/schema.js";
import bcrypt from "bcrypt";//per criptare la psw
import jwt from "jsonwebtoken";//per token di autenticazione
import dotenv from "dotenv";//serve per leggere la chiave per i token e indirizzo del DB scritti nel file .env
dotenv.config();           //cosi evitiamo di scrivere nel codice l'indirizzo del DB in chiaro contenente username psw

const JWT_SECRET = process.env.JWT_SECRET;//va a prendersi nel file .env il codice segreto

//MODIFICA PROFILO
export async function aggiornaProfilo(req, res) {
  try {
    const idUtente = req.utente.id; // preso dal token

    const { nome, cognome, via } = req.body;

    const aggiornamenti = {};

    if (nome) aggiornamenti.nome = nome;
    if (cognome) aggiornamenti.cognome = cognome;
    if (via) aggiornamenti.via = via;

    const utenteAggiornato = await Utente.findByIdAndUpdate(
      idUtente,
      aggiornamenti,
      { new: true }
    ).select("-password");

    res.json(utenteAggiornato);

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}


//GETPROFILO
export async function getProfilo(req, res) {
  try {
    const idUtente = req.utente.id; // preso dal token

    const utente = await Utente.findById(idUtente).select("-password");

    if (!utente) {
      return res.status(404).json({ errore: "Utente non trovato" });
    }

    res.json(utente);

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}


//LOGIN UTENTE
export async function loginUtente(req, res) {
  try {
    const { email, password } = req.body;

    //Controllo campi
    if (!email || !password) {
      return res.status(400).json({ errore: "Email e password sono obbligatorie" });
    }

    //Cerco l'utente
    const utente = await Utente.findOne({ email });
    if (!utente) {
      return res.status(400).json({ errore: "Credenziali non valide" });
    }

    //Confronto password
    const passwordCorretta = await bcrypt.compare(password, utente.password);
    if (!passwordCorretta) {
      return res.status(400).json({ errore: "Credenziali non valide" });
    }

    //Genero token JWT
    const token = jwt.sign(
      {
        id: utente._id,
        ruolo: utente.ruolo
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    //Risposta
    res.json({
      messaggio: "Login effettuato",
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}


// REGISTRAZIONE UTENTE
export async function registraUtente(req, res) {
  try {
    const { email, password, nome, cognome } = req.body;

    //Controllo che i campi ci siano
    if (!email || !password || !nome || !cognome) {
      return res.status(400).json({ errore: "Tutti i campi sono obbligatori" });
    }

    //se l'email è già registrata
    const esiste = await Utente.findOne({ email });
    if (esiste) {
      return res.status(400).json({ errore: "Email già registrata" });
    }

    //Cripto la password
    const passwordCriptata = await bcrypt.hash(password, 10);

    //Creo l'utente
    const nuovoUtente = new Utente({
      email,
      password: passwordCriptata,
      nome,
      cognome,
      ruolo: "UTENTE"
    });

    await nuovoUtente.save();

    //Risposta finale
    res.status(201).json({ messaggio: "Registrazione completata" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}