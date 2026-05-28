const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTitle = document.getElementById('auth-title');
const showRegister = document.getElementById('show-register');

// Gestione dello scambio tra form di Login e form di Registrazione
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.innerText = 'Accedi a BetterTrento';
        showRegister.innerText = 'Registrati qui';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.innerText = 'Crea il tuo profilo';
        showRegister.innerText = 'Accedi qui';
    }
});

// Gestione dell'invio (Submit) del form di login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Chiamata all'API di backend per effettuare il login
        const response = await fetch('http://localhost:3000/api/utenti/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Usa data.errore in linea con la risposta del backend
            alert(data.errore || "Credenziali non valide");
            return;
        }

        // Salviamo in modo sicuro le informazioni nel LocalStorage del browser
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("ruolo", data.ruolo); // Memorizza "AMMINISTRATORE" o "UTENTE"

        // Reindirizzamento diretto a eventi.html così verifichiamo subito il tasto!
        window.location.href = "eventi.html";

    } catch (error) {
        console.error("Errore durante il login:", error);
        alert("Impossibile connettersi al server. Verifica che il backend sia avviato.");
    }
});