// 1. Carica gli eventi filtrati unicamente per via
async function fetchEventi() {
    const viaIn = document.getElementById("search-via").value;

    try {
        // Rimosso il parametro "nome", passiamo solo la via alla query string
        let url = `http://localhost:3000/api/eventi?via=${encodeURIComponent(viaIn)}`;

        const response = await fetch(url);
        const eventi = await response.json();

        const container = document.getElementById("container-eventi");
        container.innerHTML = "";

        if (!response.ok || eventi.length === 0) {
            container.innerHTML = `<p class="no-events">Nessun evento o servizio trovato per questa via.</p>`;
            return;
        }

        eventi.forEach(evento => {
            const card = document.createElement("div");
            card.className = "event-card reveal";

            const dataFormattata = new Date(evento.data).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            const nomeVia = (evento.via && evento.via.strada) ? evento.via.strada : "Via non specificata";

            card.innerHTML = `
                        <div class="event-card-content">
                            <span class="event-date-tag">${dataFormattata}</span>
                            <h3>${evento.nome}</h3>
                            <p class="event-desc">${evento.descrizione}</p>
                            <div class="event-location">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>${nomeVia}</span>
                            </div>
                        </div>
                    `;
            container.appendChild(card);
        });

        initScrollReveal();

    } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
    }
}

// 2. Carica dinamicamente le vie dal database nel datalist
async function caricaSuggerimentiVie() {
    try {
        const response = await fetch('http://localhost:3000/api/vie');

        if (response.ok) {
            const vie = await response.json();
            const datalist = document.getElementById('vie-suggerite');
            datalist.innerHTML = "";

            vie.forEach(via => {
                if (via.strada) {
                    const option = document.createElement('option');
                    option.value = via.strada;
                    datalist.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error("Errore nel caricamento delle vie per l'autocompletamento:", error);
    }
}

// Event Listeners per il bottone e il tasto Invio
document.getElementById("btn-cerca").addEventListener("click", fetchEventi);
document.getElementById("search-via").addEventListener("keypress", (e) => { if (e.key === 'Enter') fetchEventi(); });

// Animazioni di comparsa card
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Avvio iniziale appena la pagina si è caricata
window.addEventListener('DOMContentLoaded', () => {
    fetchEventi();             // Mostra gli elementi iniziali
    caricaSuggerimentiVie();   // Abilita l'autocompletamento delle vie reali

    // Controllo e inserimento automatico del Tasto Amministratore
    const ruoloGrezzo = localStorage.getItem("ruolo");
    const ruoloUtente = ruoloGrezzo ? ruoloGrezzo.trim().toUpperCase() : "";

});
