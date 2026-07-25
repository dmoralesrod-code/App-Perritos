document.addEventListener("DOMContentLoaded", () => {

    // 1. CARGAR DATOS DESDE EL JSON (fetch)
    fetch("data.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar JSON");
            return response.json();
        })
        .then(data => {
            // Reemplazar texto "Cargando..." buscando directamente por el contenido de texto
            const todosLosElementos = Array.from(document.querySelectorAll("*"));
            const elementoCargando = todosLosElementos.find(el => 
                el.children.length === 0 && el.textContent.includes("Cargando líneas")
            );

            if (elementoCargando && data.lineasAtencion) {
                const contenedor = elementoCargando.parentElement;
                contenedor.innerHTML = data.lineasAtencion
                    .map(l => `<p><strong>${l.nombre}:</strong> ${l.numero}</p>`)
                    .join("");
            }

            // Cargar categorías en el select
            const selectCategoria = document.querySelector("select");
            if (selectCategoria && data.categorias) {
                selectCategoria.innerHTML = '<option value="">Selecciona una categoría...</option>';
                data.categorias.forEach(cat => {
                    const option = document.createElement("option");
                    const valor = typeof cat === "object" ? (cat.nombre || cat.id) : cat;
                    option.value = valor;
                    option.textContent = valor;
                    selectCategoria.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error en fetch:", error));

    // 2. CAPTURAR UBICACIÓN GPS
    const btnUbicacion = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("GPS")) || document.querySelector("button");
    const inputUbicacion = document.querySelector('input[placeholder*="Dirección"]') || document.querySelector("input");

    if (btnUbicacion && inputUbicacion) {
        btnUbicacion.addEventListener("click", (e) => {
            e.preventDefault();
            if (navigator.geolocation) {
                inputUbicacion.value = "Obteniendo ubicación...";
                navigator.geolocation.getCurrentPosition(
                    (posicion) => {
                        const lat = posicion.coords.latitude;
                        const lon = posicion.coords.longitude;
                        inputUbicacion.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                    },
                    (error) => {
                        alert("No se pudo obtener la ubicación automáticamente.");
                        inputUbicacion.value = "";
                    }
                );
            } else {
                alert("Tu navegador no soporta geolocalización.");
            }
        });
    }
});
