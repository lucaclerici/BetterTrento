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
const string = "mongodb://user_betterTrento:BetterTrento1@ac-aekufuj-shard-00-00.rgtitef.mongodb.net:27017,ac-aekufuj-shard-00-01.rgtitef.mongodb.net:27017,ac-aekufuj-shard-00-02.rgtitef.mongodb.net:27017/?ssl=true&replicaSet=atlas-fq8b44-shard-0&authSource=admin&appName=Cluster0";

const string2 = "mongodb://user_betterTrento:BetterTrento1@cluster0.rgtitef.mongodb.net/";

mongoose.connect(string)
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
