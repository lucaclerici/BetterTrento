import express, { json } from "express";
import mongoose from "mongoose";
import path from "path";
import utentiRoutes from "./routes/utenti.js";
import segnalazioniRoutes from "./routes/segnalazioni.js";
import eventiRoutes from "./routes/eventi.js";
import vieRoutes from "./routes/vie.js";
import cors from "cors";
import dotenv from "dotenv";//serve per leggere la chiave per i token e indirizzo del DB scritti nel file .env
dotenv.config();           //cosi evitiamo di scrivere nel codice l'indirizzo del DB in chiaro contenente username psw


const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/frontEnd", express.static(path.resolve("../frontEnd")));


// Route di test
app.get('/', (req, res) => {
  //res.send('API BetterTrento attiva!');
  res.redirect("/frontEnd/public");
});

// Connessione al DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch(err => console.error("Errore connessione MongoDB:", err));


// ROUTES
app.use("/api/utenti", utentiRoutes);
app.use("/api/segnalazioni", segnalazioniRoutes);
app.use("/api/eventi", eventiRoutes);
app.use("/api/vie", vieRoutes);

// Avvio server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

