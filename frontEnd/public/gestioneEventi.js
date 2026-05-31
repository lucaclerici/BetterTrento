document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");//si prende il token

    if (!token || localStorage.getItem("isLogged") !== "true") {
        window.location.href = "index.html";
        return;
    }


    //controllo il ruolo per poter accedere alla pagina
    const r = await proteggiPagina();
    console.log("Ruolo fuori: ");
    console.log(r);
    if (r !== "AMMINISTRATORE") {
        alert("Accesso negato. Questa pagina è riservata agli amministratori.");
        //window.location.href = "index.html";
        return;
    }

    //Autocomplete delle vie (del form e del campo ricerca eventi per via)
    setupAutocompleteVie("via");
    setupAutocompleteVie("search-eventi-via");

    //Carica tutti gli eventi presenti nel DB all'avvio
    caricaTuttiEventi();

    //Submit delform (crea o modifica)
    const form = document.getElementById("form-evento");
    form.addEventListener("submit", salvaEvento);

    document.getElementById("btn-vedi-tutti").addEventListener("click", () => {
        caricaTuttiEventi();
        document.getElementById("search-via").value = "";
    });
});

async function proteggiPagina() {//ritorno il ruolo dell'utente
    const token = localStorage.getItem("token");
    //mi prendo il ruolo
    const res = await fetch("http://localhost:3000/api/utenti/me", {
        headers: { "Authorization": "Bearer " + token }
    });

    const user = await res.json();
    console.log("Ruolo dentro proteggi:")
    console.log(user.ruolo);
    return user.ruolo;
}

//CARICA TUTTI GLI EVENTI
async function caricaTuttiEventi() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/eventi", {
        headers: { "Authorization": "Bearer " + token }
    });

    const eventi = await res.json();
    mostraEventi(eventi);
}


//CARICA EVENTI PER VIA
async function caricaEventiPerVia(viaId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/eventi/via/${viaId}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const eventi = await res.json();
    mostraEventi(eventi);
}


//MOSTRA EVENTI NEL DIV "reports-feed"
function mostraEventi(eventi) {
    const container = document.getElementById("reports-feed");
    container.innerHTML = "";

    if (!eventi || eventi.length === 0) {
        container.innerHTML = "<p>Nessun evento trovato.</p>";
        return;
    }

    eventi.forEach(ev => {
        const card = document.createElement("div");
        card.classList.add("report-card");

        card.innerHTML = `
            <div class="report-content">
                <h3>${ev.nome}</h3>
                <p>${ev.descrizione}</p>
                <p><strong>Data:</strong> ${new Date(ev.data).toLocaleDateString()}</p>
                <p><strong>Via:</strong> ${ev.via?.strada || "N/D"}</p>
            </div>
            <div class="report-actions">
                <button class="btn-modifica" data-id="${ev._id}">Modifica</button>
                <button class="btn-elimina" data-id="${ev._id}">Elimina</button>
            </div>
        `;

        container.appendChild(card);
    });

    setupAzioniEventi();
}


//PULSANTI MODIFICA / ELIMINA
function setupAzioniEventi() {
    const token = localStorage.getItem("token");

    // MODIFICA
    document.querySelectorAll(".btn-modifica").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            const res = await fetch(`http://localhost:3000/api/eventi/evento/${id}`, {
                headers: { "Authorization": "Bearer " + token }
            });

            const ev = await res.json();

            document.getElementById("titolo").value = ev.nome;
            document.getElementById("descrizione").value = ev.descrizione;
            document.getElementById("data").value = ev.data.split("T")[0];

            const viaInput = document.getElementById("via");
            viaInput.value = ev.via?.strada || "";
            viaInput.dataset.viaId = ev.via?._id || "";

            // Salviamo l'id evento in un attributo data sul form
            const form = document.getElementById("form-evento");
            form.dataset.eventoId = ev._id;

            const btnSubmit = document.querySelector("#form-evento .btn-submit");
            btnSubmit.textContent = "Modifica Evento";
        });
    });

    // ELIMINA
    document.querySelectorAll(".btn-elimina").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            if (!confirm("Vuoi davvero eliminare questo evento?")) return;

            await fetch(`http://localhost:3000/api/eventi/${id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            caricaTuttiEventi();
        });
    });
}


//CREA O MODIFICA EVENTO
async function salvaEvento(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const form = document.getElementById("form-evento");
    const eventoId = form.dataset.eventoId || null;

    const nome = document.getElementById("titolo").value;
    const descrizione = document.getElementById("descrizione").value;
    const data = document.getElementById("data").value;

    const viaInput = document.getElementById("via");
    const viaId = viaInput.dataset.viaId;

    if (!viaId) {
        alert("Seleziona una via valida dall'autocomplete.");
        return;
    }

    const payload = { nome, descrizione, data, via: viaId };

    const url = eventoId
        ? `http://localhost:3000/api/eventi/update/${eventoId}`
        : `http://localhost:3000/api/eventi/create`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert(eventoId ? "Evento modificato!" : "Evento creato!");

        form.reset();
        delete form.dataset.eventoId;

        const btnSubmit = document.querySelector("#form-evento .btn-submit");
        btnSubmit.textContent = "Crea";

        caricaTuttiEventi();
    } else {
        alert("Errore durante il salvataggio dell'evento.");
    }
}