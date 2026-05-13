const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve i file statici (HTML, CSS)
app.use(express.static('public'));
app.use(express.json());

// Mock delle API basate sulle specifiche D2
app.post('/api/login', (req, res) => {
    // Implementazione del Modulo Autenticazione (Diagramma 2.2.1)
    const { email, password } = req.body;
    console.log(`Tentativo di login per: ${email}`);
    res.json({ success: true, token: "JWT-SIMULATO-BETTERTRENTO", role: "REGISTRATO" });
});

app.get('/api/eventi', (req, res) => {
    // Mock del Gestore Eventi (Diagramma 2.2.3)
    res.json([
        { id: 1, nome: "Mercato cittadino", data: "2026-05-20", luogo: "Piazza Duomo" },
        { id: 2, nome: "Concerto Live", data: "2026-05-22", luogo: "Parco delle Albere" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server BetterTrento avviato su http://localhost:${PORT}`);
});