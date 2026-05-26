import express from "express";
import mongoose from "mongoose";
import utentiRoutes from "./routes/utenti.js";
import segnalazioniRoutes from "./routes/segnalazioni.js";
import eventiRoutes from "./routes/eventi.js";
import informazioniRoutes from "./routes/informazioni.js";
import vieRoutes from "./routes/vie.js";
import cors from "cors";
import dotenv from "dotenv";//serve per leggere la chiave per i token e indirizzo del DB scritti nel file .env
dotenv.config();           //cosi evitiamo di scrivere nel codice l'indirizzo del DB in chiaro contenente username psw

const app = express();
app.use(cors());
app.use(express.json());


// Route di test
app.get('/', (req, res) => {
  res.send('API BetterTrento attiva!');
});

// Connessione al DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch(err => console.error("Errore connessione MongoDB:", err));


// ROUTES
app.use("/api/utenti", utentiRoutes);
app.use("/api/segnalazioni", segnalazioniRoutes);
app.use("/api/eventi", eventiRoutes);
app.use("/api/informazioni", informazioniRoutes);
app.use("/api/vie", vieRoutes);

// Avvio server
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
