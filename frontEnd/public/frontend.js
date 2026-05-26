//quando una persona è loggata, nella navbar non ci sarà più ACCEDI, la img profilo e un "Ciao"
const isLogged = localStorage.getItem("isLogged");
const loginArea = document.getElementById("login-area");

if (isLogged === "true") {
    loginArea.innerHTML = `
        <div class="user-box" id="user-box">
            <img src="../image/immagine_ominoProfilo.jpg" class="logo-img">
            <span class="user-greeting">Ciao</span>
        </div>
    `;
}

document.addEventListener("click", (e) => {
    const userBox = document.getElementById("user-box");
    if (userBox && userBox.contains(e.target)) {
        window.location.href = "profilo.html";
    }
});
