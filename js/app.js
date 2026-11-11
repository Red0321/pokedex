/*
    AGREGA TUS POKÉMON AQUÍ.
    Guarda las imágenes en una carpeta llamada "images".
    Ejemplo: images/001-bulbasaur.png
    Puedes añadir más imágenes en "gallery".
    verified: true  = Pokémon oficial cuya imagen/diseño has confirmado.
    verified: false = Pokémon original creado para tu proyecto (sin sello).
    En la ficha personal, el estado aparece debajo de la imagen principal.
  */
  const pokemon = [
    { number: 1, name: "Bulbasaur", region: "Kanto", image: "images/001-bulbasaur.png", gallery: [], verified: true, description: "Añade aquí la descripción de Bulbasaur." },
    { number: 2, name: "Ivysaur", region: "Kanto", image: "images/002-ivysaur.png", gallery: [], verified: true, description: "Añade aquí la descripción de Ivysaur." },
    { number: 3, name: "Venusaur", region: "Kanto", image: "images/003-venusaur.png", gallery: [], verified: true, description: "Añade aquí la descripción de Venusaur." },
    { number: 4, name: "Charmander", region: "Kanto", image: "images/004-charmander.png", gallery: [], verified: true, description: "Añade aquí la descripción de Charmander." },
    { number: 5, name: "Charmeleon", region: "Kanto", image: "images/005-charmeleon.png", gallery: [], verified: true, description: "Añade aquí la descripción de Charmeleon." },
    { number: 6, name: "Charizard", region: "Kanto", image: "images/006-charizard.png", gallery: [], verified: true, description: "Añade aquí la descripción de Charizard." },
    { number: 152, name: "Chikorita", region: "Johto", image: "images/152-chikorita.png", gallery: [], verified: true, description: "Añade aquí la descripción de Chikorita." },
    { number: 155, name: "Cyndaquil", region: "Johto", image: "images/155-cyndaquil.png", gallery: [], verified: true, description: "Añade aquí la descripción de Cyndaquil." }
  ];

  const grid = document.getElementById("pokemon-grid");
  const search = document.getElementById("search");
  let selectedRegion = "Kanto";

  function padNumber(number) { return String(number).padStart(4, "0"); }

  function imageMarkup(src, alt, className = "", verified = false) {
    const seal = verified ? '<span class="verified-seal"><span class="check">✓</span> OFICIAL</span>' : '';
    return `${seal}<img class="${className}" src="${src}" alt="${alt}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
            <div class="placeholder" style="display:none">Imagen pendiente<br><span>${alt}</span></div>`;
  }

  function renderGrid() {
    const term = search.value.trim().toLowerCase();
    const filtered = pokemon.filter(p => {
      const matchesRegion = selectedRegion === "Todas" || p.region === selectedRegion;
      const matchesSearch = p.name.toLowerCase().includes(term) || padNumber(p.number).includes(term) || String(p.number).includes(term);
      return matchesRegion && matchesSearch;
    });

    document.getElementById("count").textContent = `${filtered.length} Pokémon`;
    grid.innerHTML = filtered.map(p => `
      <article class="pokemon-card">
        <a class="card-link" href="#pokemon/${p.number}" onclick="openPokemon(${p.number}); return false;">
          <div class="art">${imageMarkup(p.image, p.name, "", p.verified === true)}</div>
          <div class="pokemon-name">${p.name}</div>
          <div class="pokemon-number">N.º ${padNumber(p.number)}</div>
          <div class="stars">☆☆☆☆☆ <span class="rating-note">Sin valoraciones</span></div>
        </a>
      </article>`).join("");

    if (!filtered.length) grid.innerHTML = '<p>No se encontraron Pokémon con esos criterios.</p>';
  }

  function openPokemon(number) {
    const p = pokemon.find(item => item.number === number);
    if (!p) return;
    document.getElementById("home").classList.add("hidden");
    document.getElementById("detail").classList.add("active");
    document.getElementById("detail-region").textContent = p.region;
    document.getElementById("detail-name").textContent = p.name;
    document.getElementById("detail-number").textContent = `N.º ${padNumber(p.number)}`;
    document.getElementById("detail-description").textContent = p.description;
    document.getElementById("detail-art").innerHTML = imageMarkup(p.image, p.name);
    let verificationLabel = '<span class="verified-seal detail-seal" style="position:static;"><span class="check">✓</span> OFICIAL</span>';
    if (p.verified !== true) {
      verificationLabel = '<span class="small">Pokémon original</span>';
    }
    document.getElementById("detail-verification").innerHTML = verificationLabel;
    document.getElementById("detail-region").textContent = p.region;
    const images = [p.image, ...(p.gallery || [])];
    document.getElementById("detail-gallery").innerHTML = images.map((src, i) =>
      `<div class="art">${imageMarkup(src, `${p.name} imagen ${i + 1}`)}</div>`).join("");
    document.querySelectorAll("#rating-picker button").forEach(btn => btn.classList.remove("selected"));
    window.location.hash = `pokemon/${p.number}`;
    window.scrollTo(0, 0);
  }

  function goHome() {
    document.getElementById("detail").classList.remove("active");
    document.getElementById("home").classList.remove("hidden");
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
  }

  function signInToRate() {
    alert("El inicio de sesión con Google requiere configurar un proyecto Firebase. Esta demostración todavía no envía ni guarda valoraciones.");
  }

  function requestVerificationReview(vote) {
    const choice = vote === "real" ? "Es real" : "Es falsa";
    document.getElementById("verification-vote-status").textContent =
      `Has seleccionado «${choice}». Para registrar el voto de forma segura se debe conectar el inicio de sesión con Google y Firebase. La decisión final seguirá siendo del administrador.`;
    alert("La votación comunitaria es todavía una maqueta. Para guardar votos reales debemos conectar Firebase y el inicio de sesión con Google.");
  }

  document.querySelectorAll("#rating-picker button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rating-picker button").forEach(b => b.classList.toggle("selected", Number(b.dataset.value) <= Number(btn.dataset.value)));
      signInToRate();
    });
  });

  search.addEventListener("input", renderGrid);
  function selectRegion(regionName) {
    selectedRegion = regionName;
    document.getElementById("btn-kanto").classList.toggle("active", regionName === "Kanto");
    document.getElementById("btn-johto").classList.toggle("active", regionName === "Johto");
    document.getElementById("region-label").textContent = `Región: ${regionName}`;
    renderGrid();
  }

  selectRegion("Kanto");

  // Permite abrir directamente una ficha mediante una dirección como #pokemon/1.
  const match = window.location.hash.match(/^#pokemon\/(\d+)$/);
  if (match) openPokemon(Number(match[1]));
