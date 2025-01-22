import { displayProjects, formatTitle } from "./utils.js";
const token = sessionStorage.getItem("token");
const modeLoginElementsToShow = document.querySelectorAll(".login");
const modeLoginElementsToHide = document.querySelectorAll(".logout");
const barModeUpdate = document.querySelector(".barModeUpdate");
const btnUpdateProject = document.querySelector(".editProject");
const modalEditProject = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".closeIcon");
const btnCloseModalAddPhoto = document.querySelector(".closeIconAddPhoto");
const ContainerProjectInModalToUpdate = document.querySelector(
  ".projectImgContainer"
);
const infoModal = document.querySelector(".infoModal");
const infoModalContent = document.querySelector(".infoModal p");
const btnCloseInfoModal = document.querySelector(".closeInfoModal");
const btnLogout = document.querySelector(".toLogout");
const modalAddPhoto = document.querySelector(".modalPhoto");
const modalDeletePhoto = document.querySelector(".showData");
const btnAddPhoto = document.querySelector(".btnAddPhoto");
const backIconModalPhoto = document.querySelector(".backIcon");
const ContainerCategoryToAddPhoto = document.querySelector("#category");
// show photo before upload
const btnUploadPhoto = document.querySelector(".photoUpload button");
const inputFile = document.querySelector(".inputFile");
const previewImage = document.querySelector("#previewImage");
const showErrorMessage = document.querySelector(".errorMessage");
const btnSendNewProject = document.querySelector(".addPhoto");

// Api address
const API_URL = (API_ENDPOINT) => `http://localhost:5678/api/${API_ENDPOINT}`;

// get all projects
let projectsData = [];
let uniqueCategories = [];

// get all projects
const getProjects = async () => {
  try {
    const response = await fetch(API_URL("works"));

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    projectsData = await response.json();

    // display all projects by default
    displayProjects(projectsData);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
};

getProjects();

const generateCategoryButton = async () => {
  const containerFilterBtn = document.querySelector(".filterContainer");
  try {
    const response = await fetch(API_URL("categories"));

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    uniqueCategories = await response.json();
    containerFilterBtn.innerHTML = "";

    // display buttons
    containerFilterBtn.innerHTML = `<button class="btn" data-categoryId="Tous">Tous</button>`;
    uniqueCategories.forEach((categoryName) => {
      containerFilterBtn.innerHTML += `
        <button class="btn" data-categoryId="${categoryName.id}">${categoryName.name}</button>
      `;
    });
    filteredProjects();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
};

generateCategoryButton();

const handleFilterProjects = (categoryId) => {
  const filteredProjects = projectsData.filter(
    (project) => project.category.id === categoryId
  );
  displayProjects(filteredProjects);
};

// filteredProjects
const filteredProjects = () => {
  // filter projects by categoryId
  const filterBtns = document.querySelectorAll(".btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const categoryId =
        e.target.textContent === "Tous"
          ? "Tous"
          : Number(e.target.getAttribute("data-categoryId"));
      if (categoryId == "Tous") {
        displayProjects(projectsData);
      } else {
        handleFilterProjects(categoryId);
      }
    });
  });
};

// Display or hide elements based on login status
if (token) {
  modeLoginElementsToShow.forEach((element) => {
    element.style.display = "flex";
  });
  modeLoginElementsToHide.forEach((element) => {
    element.style.display = "none";
  });
}

// desactivate elements when modal info is open
const desactivateElements = () => {
  const desactivateElements = document.querySelectorAll(
    ".modalPhoto input, .modalPhoto button, .modalPhoto select"
  );

  if (infoModal.classList.contains("showInfo")) {
    desactivateElements.forEach((element) => {
      element.disabled = true;
    });
  }
};
const cleanFieldsInModalAddPhoto = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#category").value = "";
  previewImage.src = "";
  previewImage.style.display = "none";
  btnUploadPhoto.style.opacity = 1;
  inputFile.value = "";
};

const showApiResponse = (message) => {
  infoModal.classList.add("showInfo");
  infoModalContent.textContent = message;
};
// open modal to edit project
btnUpdateProject.addEventListener("click", () => {
  modalEditProject.classList.add("show");
  window.addEventListener("click", handleClickOutsideModal);
  btnAddPhoto.addEventListener("click", handleOpenPhotoModal);
  backIconModalPhoto.addEventListener("click", handleClosePhotoModal);
  inputFile.addEventListener("change", showPhotoBeforeUpload);
  btnSendNewProject.addEventListener("click", createProject);
  displayProjectInModal();

  // clean input fields
  cleanFieldsInModalAddPhoto();
});

// close modal edit project and remove all eventListener
const closeModal = () => {
  modalEditProject.classList.remove("show");
  window.removeEventListener("click", handleClickOutsideModal);
  ContainerProjectInModalToUpdate.removeEventListener(
    "click",
    handleDeleteProject
  );
  btnCloseInfoModal.removeEventListener("click", handleCloseInfoModal);
  btnAddPhoto.removeEventListener("click", handleOpenPhotoModal);
  backIconModalPhoto.removeEventListener("click", handleClosePhotoModal);
  inputFile.removeEventListener("change", showPhotoBeforeUpload);
  btnSendNewProject.removeEventListener("click", createProject);
};

// close modal when click outside or on close icon or bar mode update
const handleClickOutsideModal = (e) => {
  // verify that info modal is not open
  if (infoModal.classList.contains("showInfo")) {
    return;
  }
  if (
    e.target === modalEditProject ||
    e.target === btnCloseModal ||
    barModeUpdate.contains(e.target) ||
    e.target === btnCloseModalAddPhoto
  ) {
    closeModal();
    modalAddPhoto.style.display = "none";
    modalDeletePhoto.style.display = "flex";
  }
};

const displayProjectInModal = () => {
  ContainerProjectInModalToUpdate.innerHTML = "";
  if (projectsData.length < 1) {
    ContainerProjectInModalToUpdate.innerHTML = `<p class="noProject"> Aucun projet disponible </p>`;
    return;
  }
  projectsData.forEach((project) => {
    const formattedTitle = formatTitle(project.title);
    ContainerProjectInModalToUpdate.innerHTML += `
        <div class="project">
          <img src="${project.imageUrl}" alt="${formattedTitle}"/>
          <span class="material-symbols-outlined deleteIcon" data-id="${project.id}"> delete </span>
          </div>
          `;
  });

  // delete project from modal
  ContainerProjectInModalToUpdate.addEventListener(
    "click",
    handleDeleteProject
  );
};

// get id to delete project
const handleDeleteProject = (e) => {
  if (e.target.classList.contains("deleteIcon")) {
    const dataId = e.target.getAttribute("data-id");
    deleteProject(dataId);
  }
};

// delete project
const deleteProject = async (id) => {
  // verify that info modal is not open
  if (infoModal.classList.contains("showInfo")) {
    return;
  }

  try {
    const response = await fetch(API_URL(`works/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // open modal and display message
    showApiResponse(`Votre projet n° ${id} a bien été supprimé !`);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
  }
  // close info modal
  btnCloseInfoModal.addEventListener("click", handleCloseInfoModal);

  // display new list projects without refresh page
  // await getProjects();

  const index = projectsData.findIndex((project) => project.id === Number(id));

  projectsData.splice(index, 1);

  displayProjects(projectsData);
  displayProjectInModal();
};

const handleCloseInfoModal = () => {
  const desactivateElements = document.querySelectorAll(
    ".modalPhoto input, .modalPhoto button, .modalPhoto select"
  );
  infoModal.classList.remove("showInfo");

  desactivateElements.forEach((element) => {
    element.disabled = false;
  });
};

// open modal to add photo
const handleOpenPhotoModal = () => {
  modalAddPhoto.style.display = "flex";
  modalDeletePhoto.style.display = "none";
  generateCategoryToAddPhoto();
};

const handleClosePhotoModal = () => {
  // verify that info modal is not open
  if (infoModal.classList.contains("showInfo")) {
    return;
  }
  modalAddPhoto.style.display = "none";
  modalDeletePhoto.style.display = "flex";
};

const generateCategoryToAddPhoto = () => {
  ContainerCategoryToAddPhoto.innerHTML = ``;
  ContainerCategoryToAddPhoto.innerHTML += `<option value="">Choisir une catégorie</option>`;
  uniqueCategories.forEach((category) => {
    ContainerCategoryToAddPhoto.innerHTML += `<option value="${category.id}">${category.name}</option>`;
  });
};

const showPhotoBeforeUpload = () => {
  if (inputFile.files[0]) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      previewImage.src = reader.result;
      previewImage.style.display = "block";
      previewImage.alt = inputFile.files[0].name;
    });
    reader.readAsDataURL(inputFile.files[0]);
    btnUploadPhoto.style.opacity = 0;
  }
};

// add new project
const createProject = async () => {
  const title = document.querySelector("#title").value.trim();
  const categoryId = document.querySelector("#category").value;
  showErrorMessage.textContent = "";

  // verify data befor upload
  if (!title) {
    showErrorMessage.textContent = "Veuillez choisir du titre";
    return;
  } else if (!inputFile.files[0]) {
    showErrorMessage.textContent = "Veuillez sélectionner une photo";
    return;
  } else if (inputFile.files[0].size > 4000000) {
    showErrorMessage.textContent = "Veuillez choisir une photo de moins de 4Mo";
    return;
  } else if (!categoryId) {
    showErrorMessage.textContent = "Veuillez choisir une catégorie";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", inputFile.files[0]);
  formData.append("category", categoryId);

  try {
    const response = await fetch(API_URL("works"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.status !== 201) {
      throw new Error(`Erreur HTTP ! Statut : ${response}`);
    }

    const data = await response.json();

    // add new project to array in memory

    projectsData.push(data);

    // open modal and display message
    showApiResponse(`Votre projet ${data.title} a bien été ajouté !`);

    // clean input fields after upload
    cleanFieldsInModalAddPhoto();
    desactivateElements();

    // display new list projects without refresh page
    // await getProjects();
    displayProjects(projectsData);
    displayProjectInModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet :", error);
  }

  // close info modal
  btnCloseInfoModal.addEventListener("click", handleCloseInfoModal);
};

// logout
btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
});
