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
});//da commento modifica della navbar a qui, si può inserire nella funzione aggiorna navbarRuolo...a fine file



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

        const token = localStorage.getItem("token");

        //chiama l'API del backend
        const res = await fetch(`http://localhost:3000/api/vie/search?query=${encodeURIComponent(query)}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        const vie = await res.json();

        lista.innerHTML = "";
        lista.style.display = "block";
        if (inputId === "search-via") {//per questioni di stile CSS
            lista.style.marginTop = "10px";
        }
        if (inputId === "search-eventi-via") {//per questioni di stile CSS
            lista.style.marginTop = "10px";
        }

        vie.forEach(v => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = v.strada;

            item.addEventListener("click", () => {
                input.value = v.strada;
                input.dataset.viaId = v._id;
                lista.style.display = "none";

                //Chiama il caricamento delle segnalazioni da segnalazioniFronend.js
                if (inputId === "search-via") {
                    caricaSegnalazioniPerVia(v._id);
                }

                // filtro eventi admin
                if (inputId === "search-eventi-via") {
                    caricaEventiPerVia(v._id);
                }
            });

            lista.appendChild(item);
        });
    });
}



//RITORNA IL RUOLO UTENTE
function getUserRole() {
    const token = localStorage.getItem("token");//prende il token
    if (!token) return "utente";//se il token è vuoto

    const payload = JSON.parse(atob(token.split(".")[1]));//dal token si prende il ruolo
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

    // 🔵 Mostra il link solo agli admin
    if (user.ruolo === "AMMINISTRATORE") {
        document.getElementById("nav-gestione-eventi").style.display = "block";
    }
}
