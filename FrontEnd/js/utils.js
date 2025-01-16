
// replace space with dash
export const formatTitle = (title) => {
    return title.replace(/\s+/g, "-");
  };

// Function to display projects (default and filtered)
export const displayProjects = (projects) => {
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
    