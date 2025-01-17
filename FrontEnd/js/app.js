import { displayProjects, formatTitle } from "./utils.js";

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

// Display or hide elements based on login status
const token = sessionStorage.getItem("token");
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
// -----------------
//start open modal to edit project
// ------------------
const btnUpdateProject = document.querySelector(".editProject");
const modalEditProject = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".closeIcon");
const barModeUpdate = document.querySelector(".barModeUpdate");

btnUpdateProject.addEventListener("click", () => {
  // modalEditProject.style.display = "flex";
  modalEditProject.classList.add("show");
  window.addEventListener("click", handleClickOutsideModal);
  displayProjectInModal();
});

// close modal edit project
const closeModal = () => {
  modalEditProject.classList.remove("show");
  window.removeEventListener("click", handleClickOutsideModal);
};
const handleClickOutsideModal = (e) => {
  if (
    e.target === modalEditProject ||
    e.target === btnCloseModal ||
    barModeUpdate.contains(e.target)
  ) {
    closeModal();
  }
};

// display project in modal
const displayProjectInModal = () => {
  const projectImgContainer = document.querySelector(".projectImgContainer");
  projectImgContainer.innerHTML = "";
  projectsData.forEach((project) => {
    const formattedTitle = formatTitle(project.title);
    projectImgContainer.innerHTML += `
        <div class="project">
          <img src="${project.imageUrl}" alt="${formattedTitle}"/>
          <span class="material-symbols-outlined deleteIcon" data-id="${project.id}"> delete </span>
          </div>
          `;
  });
  handleDeleteProject();
};

// delete project
const handleDeleteProject = () => {
  const deleteIcon = document.querySelectorAll(".deleteIcon ");
  const infoModal = document.querySelector(".infoModal");
  const infoModalContent = document.querySelector(".infoModal p");
  deleteIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      const dataId = icon.getAttribute("data-id");
      // open modal info
      infoModal.classList.add("showInfo");
      infoModalContent.textContent = ` Votre projet n° ${dataId} a bien été supprimé !`;
    });
  });
  // close info modal
  const btnCloseModalInfo = document.querySelector(".closeInfoModal");
  btnCloseModalInfo.addEventListener("click", () => {
    infoModal.classList.remove("showInfo");
  });
};
// -----------------
// end open modal to edit project
// ------------------

// logout
const btnLogout = document.querySelector(".toLogout");
btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
});
