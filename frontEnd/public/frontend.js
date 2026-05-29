//quando una persona è loggata, nella navbar non ci sarà più ACCEDI, la img profilo e un "Ciao"
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


/*per autocomplete nella scrittura delle vie*/
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

        const res = await fetch(`http://localhost:3000/api/vie/search?query=${encodeURIComponent(query)}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        const vie = await res.json();

        lista.innerHTML = "";
        lista.style.display = "block";
        if (inputId === "search-via") {//per questioni di stile CSS
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

                // AGGIUNTA Che chiama il caricamento delle segnalazioni
                if (inputId === "search-via") {
                    caricaSegnalazioniPerVia(v._id);
                }
            });

            lista.appendChild(item);
        });
    });
}


//da il ruolo dell'utente
function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return "utente";

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.ruolo || "utente";
}
