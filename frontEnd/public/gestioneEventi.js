// 1. CARICAMENTO EVENTI PER L'ADMIN
async function fetchEventiAdmin() {
    const grid = document.getElementById('admin-events-grid');
    grid.innerHTML = '<div class="loading">Caricamento pannello di controllo...</div>';

    try {
        // Chiamata al backend per prendere tutti gli eventi
        const response = await fetch('/api/eventi');
        const eventi = await response.json();

        grid.innerHTML = '';

        if (eventi.length === 0) {
            grid.innerHTML = '<div class="no-events">Non ci sono eventi nel database.</div>';
            return;
        }

        eventi.forEach(evento => {
            const card = document.createElement('article');
            // Usiamo la classe 'active' per mostrarle subito senza Intersection Observer complessei
            card.className = 'event-card active';

            const opzioniData = { day: 'numeric', month: 'short' };
            const dataFormattata = new Date(evento.data).toLocaleDateString('it-IT', opzioniData).toUpperCase();

            card.innerHTML = `
                        <div class="card-image-wrapper">
                            <img src="${evento.immagine || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80'}" alt="${evento.nome}">
                            <div class="date-badge">${dataFormattata}</div>
                        </div>
                        <div class="card-content">
                            <span class="category-tag">${evento.categoria}</span>
                            <h3>${evento.nome}</h3>
                            <p class="event-desc">${evento.descrizione}</p>
                            <div class="card-meta">
                                <span>📍 ${evento.luogo} (${evento.circoscrizione})</span>
                            </div>
                            
                            <div class="admin-buttons" style="margin-top: 15px; display: flex; gap: 10px; width: 100%;">
                                <button style="background-color: #2ecc71; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;" onclick="risolviE('${evento._id}')">✅ Risolvi</button>
                                <button style="background-color: #e67e22; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;" onclick="modificaE('${evento._id}')">✏️ Modifica</button>
                            </div>
                        </div>
                    `;
            grid.appendChild(card);
        });

    } catch (error) {
        grid.innerHTML = '<div class="error-msg">Errore nel caricamento dei dati amministratore.</div>';
    }
}



// 2. AZIONE TASTO RISOLVI
async function risolviE(idEvento) {
    const token = localStorage.getItem("token");
    if (!confirm("Sei sicuro di voler segnare questo evento come risolto?")) return;

    try {
        // Inviamo la richiesta PUT protetta dal token
        const response = await fetch(`/api/eventi/${idEvento}/risolvi`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Evento archiviato/risolto con successo!");
            fetchEventiAdmin(); // Ricarica la griglia aggiornata
        } else {
            const data = await response.json();
            alert(data.error || "Errore. Non hai i permessi di amministrazione sul server.");
        }
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore di connessione con il server.");
    }
}


// 3. AZIONE TASTO MODIFICA (Placeholder per il prossimo step)
function modificaE(idEvento) {
    alert("Funzione di modifica per l'evento ID: " + idEvento + ".\nLa implementeremo nel prossimo passaggio!");
}


// Avvia il caricamento quando la pagina è pronta
window.addEventListener('DOMContentLoaded', fetchEventiAdmin);