// Api address
const API_URL = (API_ENDPOINT) => `http://localhost:5678/api/${API_ENDPOINT}`;

const loginBtn = document.querySelector("#login");
const formContainer = document.querySelector(".login");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const modal = document.querySelector(".modalMessage");
const modalContent = document.querySelector(".modalMessage p");
const btnCloseModalError = document.querySelector(".closeModal");

const showModalError = (textContent) => {
  formContainer.style.filter = "blur(5px)";
  modal.classList.add("show");
  modalContent.textContent = textContent;
};

btnCloseModalError.addEventListener("click", () => {
  modal.classList.remove("show");
  formContainer.style.filter = "none";
  document.querySelector("#email").value = "";
  document.querySelector("#password").value = "";
});

const checkInputValue = () => {
  if (inputEmail.value.trim() === "" || inputPassword.value.trim() === "") {
    showModalError("Veuillez remplir tous les champs");
    return false;
  }
  return true;
};

const login = () => {
  loginBtn.addEventListener("click", async () => {
    // Vérifier les champs avant d'envoyer la requête
    if (!checkInputValue()) return;
    try {
      const response = await fetch(API_URL("users/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail.value,
          password: inputPassword.value,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // -----------------
        //en cas de mot de passe non valide, le back ne renvoie pas de message ! response = {"error":{}}. adaptation avec showModalError("Email ou mot de passe incorrect");
        // ------------------
        if (data.error) {
          showModalError("Email ou mot de passe incorrect");
        } else {
          showModalError(data.message);
        }

        throw new Error(
          `Erreur HTTP! Statut : ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  });
};

login();
