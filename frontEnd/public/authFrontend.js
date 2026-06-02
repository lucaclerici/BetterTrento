//GESTIONE SCAMBIO FORM DI LOGIN E REGISTRAZIONE
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTitle = document.getElementById('auth-title');
const showRegister = document.getElementById('show-register');

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



//GESTIONE DELL'INVIO (Submit) DEL FORM DI LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Chiama l'API del backend per effettuare il login
        const response = await fetch('http://localhost:3000/api/utenti/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.errore || "Credenziali non valide");
            return;
        }

        // Salviamo il token JWT
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLogged", "true");

        // Reindirizzamento alla homepage
        window.location.href = "index.html";

    } catch (error) {//in caso di login fallito:
        console.error("Errore durante il login:", error);
    }
});