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

// Rotta per visualizzare la pagina di login/registrazione
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Endpoint Registrazione (Modulo 2.2.1)
app.post('/api/register', (req, res) => {
    const { nome, cognome, email, password, indirizzo, cap } = req.body;
    
    // Nelle specifiche OCL: il nome e cognome non possono essere vuoti [cite: 237]
    if (!nome || !cognome) {
        return res.status(400).json({ error: "Nome e cognome obbligatori" });
    }

    console.log(`Registrazione nuovo utente: ${email}`);
    // Qui verrebbe invocata la classe GestoreUtenti per il salvataggio [cite: 199]
    res.json({ success: true, message: "Utente registrato con successo!" });
});

// Endpoint Login (Modulo 2.2.1)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Nelle specifiche: verifica credenziali e generazione token [cite: 52, 207]
    if (email === "admin@trento.it") {
        res.json({ success: true, token: "ADMIN-TOKEN", role: "ADMIN" });
    } else {
        res.json({ success: true, token: "USER-TOKEN", role: "REGISTRATO" });
    }
});