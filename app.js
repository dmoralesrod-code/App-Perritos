document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // 1. Cargar Categorías en el select
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

      // 2. Cargar Líneas de Atención
      const contenedorLineas = document.querySelector(".card p, #lineas-atencion");
      if (contenedorLineas && data.lineasAtencion) {
        contenedorLineas.innerHTML = data.lineasAtencion
          .map((linea) => `<strong>${linea.entidad}:</strong> ${linea.numero}`)
          .join("<br>");
      }
    })
    .catch((error) => console.error("Error al cargar data.json:", error));
});
