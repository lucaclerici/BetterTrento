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