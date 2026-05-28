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

    let lista = document.getElementById("autocomplete-vie");
    if (!lista) {
        lista = document.createElement("div");
        lista.id = "autocomplete-vie";
        lista.classList.add("autocomplete-list");
        input.parentNode.appendChild(lista);
    }

    // QUI SALVEREMO L'ID DELLA VIA
    input.dataset.viaId = "";

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        input.dataset.viaId = ""; // reset ID se l'utente modifica il testo

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

        vie.forEach(v => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = v.strada;

            item.addEventListener("click", () => {
                input.value = v.strada;
                input.dataset.viaId = v._id; // SALVIAMO L'ID QUI
                lista.style.display = "none";
            });

            lista.appendChild(item);
        });
    });

    document.addEventListener("click", (e) => {
        if (!lista.contains(e.target) && e.target !== input) {
            lista.style.display = "none";
        }
    });
}
