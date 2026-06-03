document.addEventListener("DOMContentLoaded", aggiornaNavbarRuolo);

//MODIFICA DELLA NAVBAR:
// - UTENTE LOGGATO -> vede logo utente e un "Ciao" al posto di ACCEDI
// - UTENTE NON LOGGATO -> vede ACCEDI
const isLogged = localStorage.getItem("isLogged");
const loginArea = document.getElementById("login-area");

if (loginArea && isLogged === "true") {
    loginArea.innerHTML = `
        <div class="user-box" id="user-box">
            <img src="/frontEnd/image/immagine_ominoProfilo.jpg" class="user-icon">
            <span class="user-greeting">Ciao</span>
        </div>
    `;
}

document.addEventListener("click", (e) => {
    const userBox = document.getElementById("user-box");
    if (userBox && userBox.contains(e.target)) {
        window.location.href = "/frontEnd/public/profilo.html";
    }
});



/*AUTOCOMPLETE SCRITTURA DELLE VIE (CORRETTO)*/
function setupAutocompleteVie(inputId = "via") {
    const input = document.getElementById(inputId);
    if (!input) return;

    let lista = document.getElementById("autocomplete-vie-" + inputId);
    if (!lista) {
        lista = document.createElement("div");
        lista.id = "autocomplete-vie-" + inputId;
        lista.classList.add("autocomplete-list");
        input.parentNode.appendChild(lista);
    }

    input.dataset.viaId = "";

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        input.dataset.viaId = "";

        if (query.length < 2) {
            lista.style.display = "none";
            return;
        }

        /*const token = localStorage.getItem("token");
        
        // Chiama l'API del backend
        const res = await fetch(`http://localhost:3000/api/vie/search?query=${encodeURIComponent(query)}`, {
            headers: { "Authorization": "Bearer " + token }
        });*/
        
        const res = await fetch(`http://localhost:3000/api/vie/search?query=${encodeURIComponent(query)}`);
        const vie = await res.json();

        lista.innerHTML = "";
        lista.style.display = "block";
        if (inputId === "search-via" || inputId === "search-eventi-via") {
            lista.style.marginTop = "10px";
        }

        // ✨ CORRETTO: Usiamo 'via' coerentemente ovunque nel ciclo
        vie.forEach(via => {
            if (!via || !via.strada) return;

            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = via.strada;

            item.addEventListener("click", () => {
                input.value = via.strada;
                input.dataset.viaId = via._id;
                lista.style.display = "none";

                // Carica il calendario in pagina rifiuti
                if (inputId === "via" && typeof cercaCalendario === "function") {
                    cercaCalendario(via.strada);
                }

                // Chiama il caricamento delle segnalazioni da segnalazioniFronend.js
                if (inputId === "search-via" && typeof caricaSegnalazioniPerVia === "function") {
                    caricaSegnalazioniPerVia(via._id);
                }

                // Filtro eventi admin in pagina gestione eventi
                if (inputId === "search-eventi-via" && typeof caricaEventiPerVia === "function") {
                    caricaEventiPerVia(via._id);
                }
            });

            lista.appendChild(item);
        });
    });
}



//RITORNA IL RUOLO UTENTE
function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return "utente";

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.ruolo || "utente";
}



//AGGIORNA LA NAVBAR
async function aggiornaNavbarRuolo() {
    const token = localStorage.getItem("token");

    if (!token || localStorage.getItem("isLogged") !== "true") return;

    const res = await fetch("http://localhost:3000/api/utenti/me", {
        headers: { "Authorization": "Bearer " + token }
    });

    const user = await res.json();

    //Mostra il link solo agli admin
    if (user.ruolo === "AMMINISTRATORE") {
        document.getElementById("nav-gestione-eventi").style.display = "block";
    }
}

// Gestione globale del menù a tendina mobile per tutte le pagine
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});