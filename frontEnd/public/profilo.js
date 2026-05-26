document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.setItem("isLogged", "false");
    window.location.href = "index.html";
});
