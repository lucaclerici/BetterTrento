//PROTEGGE LA PAGINA, cosi facendo ci possono accedere solamente utenti registrati
async function proteggiPagina() {
    const token = localStorage.getItem("token");

    // Se non c’è token → popup + redirect
    if (!token) {
        alert("Bisogna essere loggati per accedere alla sezione Segnalazioni");
        window.location.href = "auth.html";
        return;
    }

    // Verifica token col backend
    const res = await fetch("http://localhost:3000/api/utenti/verificaToken", {
        headers: { "Authorization": "Bearer " + token }
    });

    // Se token invalido → popup + logout + redirect
    if (!res.ok) {
        alert("La sessione è scaduta. Effettua di nuovo il login.");
        localStorage.removeItem("token");
        window.location.href = "auth.html";
    }

    // Token valido → mostra la pagina
    document.body.style.visibility = "visible";

}
proteggiPagina();

document.addEventListener("DOMContentLoaded", () => {
    setupAutocompleteVie("via");
    setupAutocompleteVie("search-via"); // ricerca segnalazioni
});

//CARICA I PROBLEMI DAL DB DENTRO LA CATEGORIA (nella creazione della segnalazione)
async function caricaProblemi() {
  const problemi = await fetch("http://localhost:3000/api/segnalazioni/problemi", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }).then(r => r.json());

  const select = document.getElementById("categoria");

  problemi.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p._id;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
}
caricaProblemi();



// Mostra il nome del file quando viene selezionata una foto
document.getElementById('foto').addEventListener('change', function (e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : "Nessun file selezionato";
    document.getElementById('file-name').textContent = fileName;
});



// INVIO DELLA SEGNALAZIONE AL BACKEND
document.getElementById("form-segnalazione").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // ID VIA (dall'autocomplete)
    const viaInput = document.getElementById("via");
    const viaId = viaInput.dataset.viaId;

    if (!viaId) {
        alert("Seleziona una via valida dall'elenco.");
        return;
    }

    // ID PROBLEMA/CATEGORIA
    const problemaId = document.getElementById("categoria").value;

    if (!problemaId) {
        alert("Seleziona una categoria valida.");
        return;
    }

    // PREPARA I DATI DA INVIARE
    const formData = new FormData();
    formData.append("nome", document.getElementById("titolo").value);
    formData.append("descrizione", document.getElementById("descrizione").value);
    formData.append("via", viaId);          // <-- ID VIA
    formData.append("problema", problemaId); // <-- ID PROBLEMA

    const foto = document.getElementById("foto").files[0];
    if (foto) formData.append("immagini", foto);

    // INVIO AL BACKEND
    const res = await fetch("http://localhost:3000/api/segnalazioni/", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    if (res.ok) {
        alert("Segnalazione inviata con successo!");
        document.getElementById("form-segnalazione").reset();
        viaInput.dataset.viaId = ""; // reset ID via
        fetchSegnalazioni(); // aggiorna lista
    } else {
        alert("Errore durante l'invio della segnalazione.");
    }
});



//CARICA LE SEGNALAZIONI DATA UNA VIA
async function caricaSegnalazioniPerVia(idVia) {
    const feed = document.getElementById("reports-feed");

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/segnalazioni/per-via/${idVia}`, {
            headers: { "Authorization": "Bearer " + token }
    });
    const segnalazioni = await res.json();

    feed.innerHTML = "";

    const ruolo = getUserRole();//prende il ruolo dalla funzione in frontend.js

    if (segnalazioni.length === 0) {
        feed.innerHTML = "<p>Nessuna segnalazione trovata per questa via.</p>";
        return;
    }

    segnalazioni.forEach(seg => {
        const card = document.createElement("div");
        card.classList.add("report-card");

        card.innerHTML = `
            <h3>${seg.nome}</h3>
            <p>${seg.descrizione}</p>
            <p><strong>Problema:</strong> ${seg.problema?.nome || "N/D"}</p>
            ${seg.immagini ? `<img src="${seg.immagini}" class="report-img" style="max-width: 20%;">` : ""}
        `;

        //SE ADMIN → AGGIUNGI I PULSANTI
        if (ruolo === "AMMINISTRATORE") {
            const adminControls = document.createElement("div");
            adminControls.classList.add("admin-controls");

            adminControls.innerHTML = `
                <button class="btn-elimina" data-id="${seg._id}">🗑 Elimina</button>

                <select class="select-stato" data-id="${seg._id}">
                    <option value="APERTA">Aperta</option>
                    <option value="INCARICO">In carico</option>
                    <option value="RISOLTA">Risolta</option>
                    <option value="RESPINTA">Respinta</option>
                </select>
            `;

            card.appendChild(adminControls);
        }

        feed.appendChild(card);
    });

    if (ruolo === "AMMINISTRATORE") {
        setupAdminActions();
    }
}

//OPERAZIONI PER ADMIN
function setupAdminActions() {
    const token = localStorage.getItem("token");

    // ELIMINA
    document.querySelectorAll(".btn-elimina").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            if (!confirm("Vuoi davvero eliminare questa segnalazione?")) return;

            await fetch(`http://localhost:3000/api/segnalazioni/${id}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            btn.closest(".report-card").remove();
        });
    });

    // CAMBIO STATO
    document.querySelectorAll(".select-stato").forEach(sel => {
        sel.addEventListener("change", async () => {
            const id = sel.dataset.id;
            const nuovoStato = sel.value;

            await fetch(`http://localhost:3000/api/segnalazioni/${id}/stato`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ stato: nuovoStato })
            });

            alert("Stato aggiornato");
        });
    });
}
