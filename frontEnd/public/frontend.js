//MODIFICA DELLA NAVBAR:
// - UTENTE LOGGATO -> vede logo utente e un "Ciao" al posto di ACCEDI
// - UTENTE NON LOGGATO -> vede ACCEDI
const isLogged = localStorage.getItem("isLogged");
const loginArea = document.getElementById("login-area");
const linkAccesso = document.getElementById("accesso-personale");

if (loginArea && isLogged === "true") {
    linkAccesso.href = "profilo.html";
    loginArea.innerHTML = `
        <div class="user-box" id="user-box">
            <img src="<img src="../image/immagine_ominoProfilo.jpg" class="user-icon">
            <span class="user-greeting">Ciao</span>
        </div>
    `;
}

document.addEventListener("click", (e) => {
    const userBox = document.getElementById("user-box");
    if (userBox && userBox.contains(e.target)) {
        window.location.href = "profilo.html";
    }
});



/*AUTOCOMPLETE SCRITTURA DELLE VIE*/
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
        
        //chiediamo al backend tutte le vie che iniziano con quella stringa
        const res = await fetch(`https://bettertrento.onrender.com/api/vie/search?query=${encodeURIComponent(query)}`);
        const vie = await res.json();

        lista.innerHTML = "";
        lista.style.display = "block";

        //per motivi di CSS
        if (inputId === "search-via") {
            lista.style.marginTop = "10px";
        }

        //per ogni via
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

                //per informazioni
                if(inputId === "via-info" && typeof caricaTutto ==="function"){
                    caricaTutto(via._id);
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

    const res = await fetch("https://bettertrento.onrender.com/api/utenti/me", {//richiesta profilo per vedere il ruolo
        headers: { "Authorization": "Bearer " + token }
    });

    const user = await res.json();

    //Mostra il link solo agli admin
    if (user.ruolo === "AMMINISTRATORE") {
        document.getElementById("nav-gestione-eventi").style.display = "block";
    }
}



//GESTIONE DEL MENù A TENDINA MOBILE
document.addEventListener("DOMContentLoaded", () => {
    aggiornaNavbarRuolo();
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});