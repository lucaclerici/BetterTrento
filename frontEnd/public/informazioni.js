//CARICA GLI EVENTI PER LA VIA INSERITA -> se UTENTE LOGGATO allora si usa la VIA salvata in profilo
async function caricaEventi(via = null) {

}


//CARICA LE SEGNALAZIONI PER LA VIA INSERITA -> -> se UTENTE LOGGATO allora si usa la VIA salvata in profilo
async function caricaSegnalazioni(via = null) {
    const feed = document.getElementById("reports-feed");

    const token = localStorage.getItem("token");
    if(token){

    }
    const res = await fetch(`http://localhost:3000/api/segnalazioni/per-via/${idVia}`);
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
                    console.log(strada);
                    document.getElementById('via').value = strada;//riempio di base la barra di ricerca della via con la via dell'utente
                    caricaSegnalazioni(viaId);
                    caricaEventi(viaId);
                }
            }
        } catch (error) { }
    }
}


window.addEventListener('DOMContentLoaded', () => {
    controllaProfiloEVia();
    setupAutocompleteVie("via");//per autocomplete delle vie
});