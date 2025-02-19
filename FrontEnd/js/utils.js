// replace space with dash
export const formatTitle = (title) => {
  return title.replace(/\s+/g, "-");
};

// Function to display projects (default and filtered)
export const displayProjects = (projects) => {
  const containerCard = document.querySelector(".gallery");
  containerCard.innerHTML = "";
  if (projects.length < 1) {
    containerCard.innerHTML = `<p class="noProject"> Aucun projet disponible </p>`;
    return;
  }
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

 