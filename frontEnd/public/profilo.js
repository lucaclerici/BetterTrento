/*document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLogged", "false");
    window.location.href = "index.html";
});*/

document.addEventListener("DOMContentLoaded", async () => {
    
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("isLogged") !== "true") {
        window.location.href = "index.html";
        return;
    }

    // ==========================================
    // 1. CARICA I DATI DELL'UTENTE (INCLUSA LA VIA)
    // ==========================================
    try {
        const response = await fetch('http://localhost:3000/api/utenti/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Popoliamo i campi (Ora c'è anche la via!)
            document.getElementById("profile-email").value = data.email || "";
            document.getElementById("profile-nome").value = data.nome || "";
            document.getElementById("profile-via").value = data.via || "";
            
            if (data.nome) {
                document.getElementById("profile-title").innerText = `Ciao, ${data.nome.split(' ')[0]}`;
            }
        }
    } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
    }

    // ==========================================
    // 2. AUTOCOMPLETAMENTO VIE DAL DATABASE
    // ==========================================
    try {
        // Chiama la rotta che hai già in app.js!
        const vieResponse = await fetch('http://localhost:3000/api/vie');
        if (vieResponse.ok) {
            const vieDalDB = await vieResponse.json(); // Supponiamo ritorni un array di vie
            const datalist = document.getElementById("lista-vie");
            
            // Per ogni via nel database, crea una <option> nei suggerimenti
            vieDalDB.forEach(via => {
                const option = document.createElement('option');
                option.value = via.strada;
                datalist.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Errore nel caricamento delle vie:", error);
    }

    // ==========================================
    // 3. SALVATAGGIO DELLE MODIFICHE
    // ==========================================
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("profile-nome").value;
            const via = document.getElementById("profile-via").value;

            try {
                const response = await fetch('http://localhost:3000/api/utenti/me', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, via })
                });

                if (response.ok) {
                    alert("Profilo aggiornato con successo!");
                    window.location.reload(); // Ricarica la pagina per mostrare i dati nuovi
                } else {
                    alert("Errore durante il salvataggio.");
                }
            } catch (error) {
                console.error("Errore di connessione:", error);
            }
        });
    }

    // ==========================================
    // 4. LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.setItem("isLogged", "false");
            window.location.href = "index.html";
        });
    }
});