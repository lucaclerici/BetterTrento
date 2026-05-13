import express from "express";
import mongoose from "mongoose";
import utentiRoutes from "./routes/utenti.js";
import segnalazioniRoutes from "./routes/segnalazioni.js";
import eventiRoutes from "./routes/eventi.js";
import informazioniRoutes from "./routes/informazioni.js";

const app = express();
app.use(express.json());

// Route di test
app.get('/', (req, res) => {
  res.send('API BetterTrento attiva!');
});

// Connessione al DB
mongoose.connect("mongodb+srv://user_betterTrento:BetterTrento1@cluster0.rgtitef.mongodb.net/")
  .then(() => console.log("MongoDB connesso"))
  .catch(err => console.error(err));


// ROUTES
app.use("/api/utenti", utentiRoutes);
app.use("/api/segnalazioni", segnalazioniRoutes);
app.use("/api/eventi", eventiRoutes);
app.use("/api/informazioni", informazioniRoutes);

// Avvio server
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
