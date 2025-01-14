//Api adress
const API_URL = (API_ENDPOINT) => `http://localhost:5678/api/${API_ENDPOINT}`;

// get project home page
(async () => {
  // replace space with dashe
  const formatTitle = (title) => {
    return title.replace(/\s+/g, "-");
  };
  try {
    const response = await fetch(API_URL("works"));
    if (!response.ok) {
      console.log(response);
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const containerCard = document.querySelector(".gallery");
    data.forEach((work) => {
      const formattedTitle = formatTitle(work.title);
      containerCard.innerHTML += `
           <div class="galleryCard">
          <figure>
            <img src= ${work.imageUrl} alt=${formattedTitle}>
            <figcaption>${work.title}</figcaption>
          </figure>
        </div>
        `;
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
})();
