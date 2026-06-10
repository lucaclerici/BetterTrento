async function caricaTutto(via=null) {
    caricaEventi(via);
    caricaSegnalazioni(via);
}

//CARICA GLI EVENTI
async function caricaEventi(via = null) {
    const container = document.getElementById("reports-feed-eventi");
    if (!container) return;
    
    container.innerHTML = `<h2 class="feed-section-title">📅 Eventi in Programma</h2>`;

    if (!via) {
        container.innerHTML += `<div class="info-empty-state"><p>Inserisci e seleziona una via per visualizzare gli eventi.</p></div>`;
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/eventi/via/${via}`);
        const eventi = await res.json();

        if (!eventi || eventi.length === 0) {
            container.innerHTML += `
                <div class="info-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <p>Nessun evento in programma per questa via.</p>
                </div>`;
            return;
        }

        const grid = document.createElement("div");
        grid.classList.add("info-cards-grid");

        eventi.forEach(ev => {
            const card = document.createElement("div");
            card.classList.add("modern-info-card");
            card.innerHTML = `
                <div class="card-badge">Nuovo Evento</div>
                <h3>${ev.nome}</h3>
                <p class="card-desc">${ev.descrizione}</p>
                <div class="card-meta">
                    <span><strong>Data:</strong> ${new Date(ev.data).toLocaleDateString()}</span>
                    <span><strong>Via:</strong> ${ev.via?.strada || "N/D"}</span>
                </div>
            `;
            grid.appendChild(card);
        });
        
        container.appendChild(grid);

    } catch (error) {
        container.innerHTML += `<div class="info-empty-state"><p>Errore nel caricamento degli eventi.</p></div>`;
    }
}


//CARICA LE SEGNALAZIONI
async function caricaSegnalazioni(via = null) {
    const feed = document.getElementById("reports-feed-segnalazioni");
    if (!feed) return;
    
    feed.innerHTML = `<h2 class="feed-section-title">⚠️ Stato Segnalazioni della Via</h2>`;

    if (!via) {
        feed.innerHTML += `<div class="info-empty-state"><p>Inserisci e seleziona una via per visualizzare lo stato delle segnalazioni.</p></div>`;
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/segnalazioni/per-via/${via}`);
        const segnalazioni = await res.json();

        if (!segnalazioni || segnalazioni.length === 0) {
            feed.innerHTML += `
                <div class="info-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Ottimo! Nessuna segnalazione attiva o disservizio in questa via.</p>
                </div>`;
            return;
        }

        const grid = document.createElement("div");
        grid.classList.add("info-cards-grid");

        segnalazioni.forEach(seg => {
            const card = document.createElement("div");
            card.classList.add("modern-info-card");
            
            card.innerHTML = `
                <div class="card-badge-stato stato-aperto">${seg.stato}</div>
                <h3>${seg.nome}</h3>
                <p class="card-desc">${seg.descrizione || "Nessuna descrizione."}</p>
                <div class="card-meta">
                    <span><strong>Problema:</strong> ${seg.problema?.nome || "N/D"}</span>
                    ${seg.immagini ? `<br><img src="${seg.immagini}" class="report-img" style="max-width: 40%; margin-top: 10px; border-radius: 4px;">` : ""}
                </div>
            `;
            grid.appendChild(card);
        });
        
        feed.appendChild(grid);

    } catch (error) {
        feed.innerHTML += `<div class="info-empty-state"><p>Errore nel caricamento delle segnalazioni.</p></div>`;
    }
}


// SE L'UTENTE è LOGGATO ALLORA PRENDE GIA LA VIA SALVATA NEL PROFILO
async function controllaProfiloEVia() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await fetch(`http://localhost:3000/api/utenti/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const utente = await response.json();
                if (utente.via) {
                    const viaId = utente.via;
                    const res = await fetch(`http://localhost:3000/api/vie/via/${viaId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const r = await res.json();
                    const strada = r.strada;
                    
                    const inputVia = document.getElementById('via');
                    if(inputVia) {
                        inputVia.value = strada;
                        inputVia.dataset.viaId = viaId;
                    }
                    
                    caricaEventi(viaId);
                    caricaSegnalazioni(viaId);
                }
            }
        } catch (error) { }
    }
}


window.addEventListener('DOMContentLoaded', () => {
    controllaProfiloEVia();
    setupAutocompleteVie("via-info");

    const bottoneCerca = document.getElementById("btn-cerca");
    if (bottoneCerca) {
        bottoneCerca.addEventListener("click", async () => {
            const viaInput = document.getElementById("via");
            if (!viaInput) return;

            let viaId = viaInput.dataset.viaId;
            const testoScritto = viaInput.value.trim();

            if (!testoScritto) {
                alert("⚠️ Inserisci una via prima di cercare!");
                return;
            }

            caricaEventi(viaId);
            caricaSegnalazioni(viaId);
        });
    }
});