//CALENDARIO RIFIUTI DOLOMITI
const calendariDolomiti = {
    "CENTRO": [
        { giorno: "Lunedì", tipo: "Organico" },
        { giorno: "Lunedì", tipo: "Residuo" },
        { giorno: "Mercoledì", tipo: "Carta e Cartone" },
        { giorno: "Giovedì", tipo: "Organico" },
        { giorno: "Venerdì", tipo: "Imballaggi Leggeri" }
    ],
    "QUARTIERI": [
        { giorno: "Martedì", tipo: "Organico" },
        { giorno: "Mercoledì", tipo: "Residuo" },
        { giorno: "Giovedì", tipo: "Carta e Cartone" },
        { giorno: "Venerdì", tipo: "Organico" },
        { giorno: "Sabato", tipo: "Imballaggi Leggeri" }
    ]
};


//RITORNA UN JSON DEL CALENDARIO DEI RIFIUTI
async function getCalendarioRifiuti(viaTrovata = null) {
    // Determina la zona in base al nome della strada recuperata
    const nomeStrada = typeof viaTrovata === 'object' && viaTrovata !== null ? viaTrovata.strada : viaTrovata;
    const stradaLower = nomeStrada.toLowerCase();

    let zonaSelezionata = "QUARTIERI";

    if (stradaLower.includes("belenzani") || stradaLower.includes("duomo") || stradaLower.includes("manci") || stradaLower.includes("roma")) {
        zonaSelezionata = "CENTRO";
    }

    const calendarioSelezionato = calendariDolomiti[zonaSelezionata];

    // Calcolo del prossimo ritiro
    const giorniSettimana = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const oggiIndex = new Date().getDay();

    let prossimoRitiro = null;
    let minDistanza = 8;

    calendarioSelezionato.forEach(item => {
        const itemIndex = giorniSettimana.indexOf(item.giorno);
        let distanza = itemIndex - oggiIndex;
        if (distanza <= 0) distanza += 7;

        if (distanza < minDistanza) {
            minDistanza = distanza;
            prossimoRitiro = item;
        }
    });

    if (!prossimoRitiro) prossimoRitiro = calendarioSelezionato[0];

    // Ritorna un JSON
    return {
        via: nomeStrada,
        zona: zonaSelezionata === "CENTRO" ? "Zona A - Centro Storico" : "Zona B - Quartieri Residenziali",
        prossimoRitiro: prossimoRitiro,
        calendario: calendarioSelezionato
    };
}



async function cercaCalendario(viaSpecificata = null) {
    // Estrae il valore corrente nella barra di ricerca della via
    const viaInput = viaSpecificata || document.getElementById('via').value.trim();
    const risultatiSezione = document.getElementById('risultati-calendario');
    const placeholderMsg = document.getElementById('placeholder-msg');

    if (!viaInput || viaInput.length < 3) {
        risultatiSezione.style.display = 'none';
        placeholderMsg.style.display = 'block';
        placeholderMsg.innerHTML = '<p>🔍 Scrivi almeno 3 caratteri per la ricerca...</p>';
        return;
    }

    try {
        const response = await getCalendarioRifiuti(viaInput);

        placeholderMsg.style.display = 'none';
        risultatiSezione.style.display = 'block';

        // Aggiorna l'intestazione testuale principale
        document.getElementById('nome-via-rilevata').textContent = `RACCOLTA PER: ${response.via.toUpperCase()}`;
        if (!viaSpecificata) document.getElementById('via').value = response.via;

        document.getElementById('next-waste-type').textContent = response.prossimoRitiro.tipo;
        document.getElementById('next-waste-day').textContent = `Il prossimo ritiro sarà di ${response.prossimoRitiro.giorno}`;
        document.getElementById('widget-color-block').style.backgroundColor = getColoreRifiuto(response.prossimoRitiro.tipo);

        // SVUOTAMENTO COMPLETO E SICURO DELLE VECCHIE SCHEDE DEI GIORNI (Risolve il bug del blocco)
        const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        giorni.forEach(g => {
            const lista = document.querySelector(`#day-${g} .rifiuti-list`);
            if (lista) {
                lista.innerHTML = '<span style="color:#bdc3c7; font-size:14px;" class="nessun-ritiro">Nessun ritiro</span>';
            }
        });

        // Inserimento dei nuovi tag allineati alla via cercata
        response.calendario.forEach(item => {
            const giornoContainer = document.querySelector(`#day-${item.giorno} .rifiuti-list`);
            if (giornoContainer) {
                const noDataSpan = giornoContainer.querySelector('.nessun-ritiro');
                if (noDataSpan) giornoContainer.innerHTML = ''; // Rimuove definitivamente la scritta provvisoria

                const tag = document.createElement('span');
                tag.style.cssText = "display:block; margin:6px 0; padding:6px 10px; border-radius:4px; color:#fff; font-weight:bold; font-size:13px; text-align:center;";
                tag.style.backgroundColor = getColoreRifiuto(item.tipo);
                tag.textContent = item.tipo;

                giornoContainer.appendChild(tag);
            }
        });

    } catch (error) {
        risultatiSezione.style.display = 'none';
        placeholderMsg.style.display = 'block';
        placeholderMsg.innerHTML = '<p>❌ Nessun calendario trovato per la selezione corrente.</p>';
    }
}


//SE L'UTENTE è LOGGATO ALLORA PRENDE GIA LA VIA SALVATA NEL PROFILO
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
                    cercaCalendario(strada);//cerco il calendario per la via dell'utente
                }
            }
        } catch (error) { }
    }
}


//RITORNA IL COLORE IN BASE AL RIFIUTO
function getColoreRifiuto(tipo) {
    switch (tipo.toLowerCase()) {
        case 'organico': return '#5d4037';
        case 'carta e cartone': return '#0288d1';
        case 'imballaggi leggeri': return '#fbc02d';
        case 'residuo': return '#78909c';
        default: return '#cccccc';
    }
}


document.getElementById('btn-cerca').addEventListener('click', () => cercaCalendario());
document.getElementById('via').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cercaCalendario();
});

window.addEventListener('DOMContentLoaded', () => {
    controllaProfiloEVia();
    setupAutocompleteVie("via");
});