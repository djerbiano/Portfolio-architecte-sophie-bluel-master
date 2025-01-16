import { displayProjects } from "./utils.js";

// Api address
const API_URL = (API_ENDPOINT) => `http://localhost:5678/api/${API_ENDPOINT}`;

// get all projects
let projectsData = [];

// get all projects and create buttons
const generateFilterBtnsAndProjects = async () => {
  const containerFilterBtn = document.querySelector(".filterContainer");

  try {
    const response = await fetch(API_URL("works"));

    if (!response.ok) {
      console.log(response);
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    projectsData = await response.json();

    containerFilterBtn.innerHTML = "";

    // unique categories
    const uniqueCategories = [
      ...new Set(projectsData.map((project) => project.category.name)),
    ];

    // display all projects by default
    displayProjects(projectsData);

    // display buttons
    containerFilterBtn.innerHTML = `<button class="btn">Tous</button>`;
    uniqueCategories.forEach((categoryName) => {
      containerFilterBtn.innerHTML += `
        <button class="btn">${categoryName}</button>
      `;
    });

    // filter projects by category
    const filterBtns = document.querySelectorAll(".btn");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const categoryName = e.target.textContent;
        if (categoryName === "Tous") {
          displayProjects(projectsData);
        } else {
          filterProjects(categoryName);
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
};

generateFilterBtnsAndProjects();

// Filter projects
const filterProjects = (categoryName) => {
  const filteredProjects = projectsData.filter(
    (project) => project.category.name === categoryName
  );
  displayProjects(filteredProjects);
};

// mode login
const token = localStorage.getItem("token");
const elementsToShow = document.querySelectorAll(".login");
const elementsToHide = document.querySelectorAll(".logout");

if (token) {
  elementsToShow.forEach((element) => {
    element.style.display = "flex";
  });
  elementsToHide.forEach((element) => {
    element.style.display = "none";
  });
}

// // logout
const btnLogout = document.querySelector(".toLogout");
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});
