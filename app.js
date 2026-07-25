document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // 1. Poblar el menú desplegable de categorías
      const selectCategoria = document.querySelector("select");
      if (selectCategoria && data.categorias) {
        selectCategoria.innerHTML = '<option value="">Selecciona una categoría...</option>';
        data.categorias.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.nombre;
          selectCategoria.appendChild(option);
        });
      }

      // 2. Poblar las líneas de atención
      // Buscará cualquier párrafo o div que contenga el texto "Cargando"
      const todosLosParrafos = Array.from(document.querySelectorAll("p, div, section"));
      const contenedorLineas = todosLosParrafos.find((el) => 
        el.textContent.includes("Cargando líneas de atención")
      );

      if (contenedorLineas && data.lineasAtencion) {
        contenedorLineas.innerHTML = data.lineasAtencion
          .map((linea) => `<strong>${linea.entidad}:</strong> ${linea.numero}`)
          .join("<br>");
      }
    })
    .catch((error) => console.error("Error cargando los datos:", error));
});
