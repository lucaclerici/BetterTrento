import { Utente } from "../models/schema.js";
import bcrypt from "bcrypt";

// REGISTRAZIONE UTENTE
export async function registraUtente(req, res) {
  try {
    const { email, password, nome, cognome } = req.body;

    // 1. Controllo che i campi ci siano
    if (!email || !password || !nome || !cognome) {
      return res.status(400).json({ errore: "Tutti i campi sono obbligatori" });
    }

    // 2. Controllo se l'email è già registrata
    const esiste = await Utente.findOne({ email });
    if (esiste) {
      return res.status(400).json({ errore: "Email già registrata" });
    }

    // 3. Cripto la password
    const passwordCriptata = await bcrypt.hash(password, 10);

    // 4. Creo l'utente
    const nuovoUtente = new Utente({
      email,
      password: passwordCriptata,
      nome,
      cognome,
      ruolo: "UTENTE"
    });

    await nuovoUtente.save();

    // 5. Risposta finale
    res.status(201).json({ messaggio: "Registrazione completata" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: "Errore del server" });
  }
}
