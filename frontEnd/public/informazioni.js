//CARICA GLI EVENTI PER LA VIA INSERITA -> se UTENTE LOGGATO allora si usa la VIA salvata in profilo
async function caricaEventi(via = null) {

    const container = document.getElementById("reports-feed-eventi");
    const viaId = via;
    const res = await fetch(`http://localhost:3000/api/eventi/via/${viaId}`);
    const eventi = await res.json();

    container.innerHTML = "";

    if (!eventi || eventi.length === 0) {
        return;
    }

    eventi.forEach(ev => {
        const card = document.createElement("div");
        card.classList.add("report-card");
        card.style.minWidth = "250px";
        card.style.maxWidth = "25%";
        card.innerHTML = `
            <div class="report-content">
                <h3>Evento: ${ev.nome}</h3>
                <p>${ev.descrizione}</p>
                <p><strong>Data:</strong> ${new Date(ev.data).toLocaleDateString()}</p>
                <p><strong>Via:</strong> ${ev.via?.strada || "N/D"}</p>
            </div>
        `;

        container.appendChild(card);
    });
}


//CARICA LE SEGNALAZIONI PER LA VIA INSERITA -> -> se UTENTE LOGGATO allora si usa la VIA salvata in profilo
async function caricaSegnalazioni(via = null) {
    const feed = document.getElementById("reports-feed-segnalazioni");
    const viaId = via;
    const res = await fetch(`http://localhost:3000/api/segnalazioni/per-via/${viaId}`);
    const segnalazioni = await res.json();

    feed.innerHTML = "";

    if (segnalazioni.length === 0) {
        return;
    }

    segnalazioni.forEach(seg => {
        const card = document.createElement("div");
        card.classList.add("report-card");
        card.style.minWidth = "250px";
        card.style.maxWidth = "25%";
        card.innerHTML = `
            <h3>Segn: ${seg.nome}</h3>
            <p>${seg.descrizione}</p>
            <p><strong>Problema:</strong> ${seg.problema?.nome || "N/D"}</p>
            ${seg.immagini ? `<img src="${seg.immagini}" class="report-img" style="max-width: 20%;">` : ""}
        `;
        feed.appendChild(card);
    });
}


//SE L'UTENTE è LOGGATO ALLORA PRENDE GIA LA VIA SALVATA NEL PROFILO //da valutare se mettere in frontend perchè ridondante -> c'è anche in rifiuti!
async function controllaProfiloEVia() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await fetch(`http://localhost:3000/api/utenti/me`, {//chiedo il profilo con all'interno la via
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const utente = await response.json();
                if (utente.via) {
                    const viaId = utente.via;
                    const res = await fetch(`http://localhost:3000/api/vie/via/${viaId}`, {//chiedo la via dell'utente con all'interno la strada
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const r = await res.json();
                    const strada = r.strada;
                    document.getElementById('via').value = strada;//riempio di base la barra di ricerca della via con la via dell'utente
                    caricaEventi(viaId);
                    caricaSegnalazioni(viaId);
                }
            }
        } catch (error) { }
    }
}

document.getElementById("btn-cerca").addEventListener("click", () => {
    const viaInput = document.getElementById("via");
    const viaId = viaInput.dataset.viaId;

    caricaEventi(viaId);
    caricaSegnalazioni(viaId);
});

window.addEventListener('DOMContentLoaded', () => {
    controllaProfiloEVia();
    setupAutocompleteVie("via");//per autocomplete delle vie
});