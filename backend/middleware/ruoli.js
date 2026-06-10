//GESTIONE DEI RUOLI DEGLI UTENTI, 

import mongoose from 'mongoose';

export function autorizzaRuoli(...ruoliPermessi) {//ruoliPermessi contiene il ruolo richiesto per accedere a tale risorsa
  return (req, res, next) => {
    try {
      const ruoloUtente = req.utente.ruolo; //ruolo dell'utente preso dal token (verificato precedentemente da auth)

      if (!ruoliPermessi.includes(ruoloUtente)) {//se il ruolo richiesto non è incluso in quello dell'utente
        return res.status(403).json({ errore: "Accesso negato" });//se non ha il ruolo adatto
      }

      next();//altrimenti vai avanti

    } catch (err) {
      return res.status(500).json({ errore: "Errore del server" });
    }
  };
}

const utenteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    via: { type: String },
    
    ruolo: { type: String, enum: ['user', 'admin'], default: 'user' } 
});
