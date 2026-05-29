
document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");//si prende il token salvato sul browser
    if (!token || localStorage.getItem("isLogged") !== "true") {
        window.location.href = "index.html";
        return;
    }



    //CARICA I DATI DELL'UTENTE: email - nome - cognome - via
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

            //Popoliamo i campi
            document.getElementById("profile-email").value = data.email || "";
            document.getElementById("profile-nome").value = data.nome || "";
            document.getElementById("profile-cognome").value = data.cognome || "";
            
            const viaId = data.via;
            console.log(data.via);
            const res = await fetch(`http://localhost:3000/api/via/${viaId}`, {//chiedo dal backend la via tramite ID
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            console.log(result);
            document.getElementById("profile-via").value = result.strada || "";

            if (data.nome) {
                document.getElementById("profile-title").innerText = `Ciao, ${data.nome.split(' ')[0]}`;
            }
        }
    } catch (error) {
        console.error("Errore nel caricamento del profilo:", error);
    }



    //SALVATAGGIO DELLE MODIFICHE
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



    //LOGOUT
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.setItem("isLogged", "false");
            window.location.href = "index.html";//Reindirizziamo alla Homepage
        });
    }

});