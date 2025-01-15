// Api address
const API_URL = (API_ENDPOINT) => `http://localhost:5678/api/${API_ENDPOINT}`;

// get all projects
let projectsData = [];

// replace space with dash
const formatTitle = (title) => {
  return title.replace(/\s+/g, "-");
};

// Function to display projects
const displayProjects = (projects) => {
  const containerCard = document.querySelector(".gallery");
  containerCard.innerHTML = "";
  projects.forEach((work) => {
    const formattedTitle = formatTitle(work.title);
    containerCard.innerHTML += `
      <div class="galleryCard">
        <figure>
          <img src="${work.imageUrl}" alt="${formattedTitle}">
          <figcaption>${work.title}</figcaption>
        </figure>
      </div>
    `;
  });
};

// get all projects and create buttons
const getAllProjectWithBtn = async () => {
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

getAllProjectWithBtn();

// Filter projects
const filterProjects = (categoryName) => {
  const filteredProjects = projectsData.filter(
    (project) => project.category.name === categoryName
  );
  displayProjects(filteredProjects);
};
