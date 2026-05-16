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

        app.post('/api/register', (req, res) => {
        const { email, cap } = req.body;

        // Controllo lato Server
        if (emailExistsInDatabase(email)) {
            return res.status(400).json({ success: false, message: "Email già presente!" });
        }
        
        if (cap.length !== 5) {
            return res.status(400).json({ success: false, message: "CAP non valido!" });
        }

    });

    // Rotta per la pagina Numeri Utili
    app.get('/numeri-utili', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'numeri-utili.html'));
    });

        // Aggiungi questa rotta per servire la pagina HTML
    app.get('/eventi', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'eventi.html'));
    });

    // Database simulato degli Eventi (Mock in linea con il modulo 2.2.3)
    const databaseEventi = [
        {
            id: 1,
            nome: "Mercato Artigianale d'Autunno",
            descrizione: "Esposizione di prodotti fatti a mano dagli artigiani locali del Trentino. Un'occasione per riscoprire le tradizioni del nostro territorio.",
            data: "2026-10-15",
            luogo: "Piazza Duomo",
            circoscrizione: "Centro Storico",
            categoria: "Cultura",
            immagine: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            nome: "Assemblea Pubblica sulla Mobilità",
            descrizione: "Incontro aperto a tutti i cittadini per discutere le nuove piste ciclabili e la viabilità sostenibile del quartiere.",
            data: "2026-06-02",
            luogo: "Sala Circoscrizionale",
            circoscrizione: "Oltrefersina",
            categoria: "Sociale",
            immagine: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            nome: "Corsa Podistica di Primavera",
            descrizione: "Gara non competitiva aperta a famiglie e sportivi. Percorso di 5km attraverso i parchi fluviali della circoscrizione.",
            data: "2026-05-24",
            luogo: "Parco Mattarello",
            circoscrizione: "Mattarello",
            categoria: "Sport",
            immagine: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=500&q=80"
        }
    ];

    // Endpoint API con logica di filtraggio avanzata
    app.get('/api/eventi', (req, res) => {
        const { zona, categoria } = req.query;
        
        let eventiFiltrati = databaseEventi;

        // Filtro per Circoscrizione
        if (zona && zona !== 'all') {
            eventiFiltrati = eventiFiltrati.filter(e => e.circoscrizione === zona);
        }

        // Filtro per Categoria
        if (categoria && categoria !== 'all') {
            eventiFiltrati = eventiFiltrati.filter(e => e.categoria === categoria);
        }

        // Risposta sicura in formato JSON
        res.json(eventiFiltrati);
    });
});