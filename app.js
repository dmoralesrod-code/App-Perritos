document.addEventListener("DOMContentLoaded", () => {
    // 1. CARGAR DATOS DESDE EL JSON (fetch)
    fetch("data.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar JSON");
            return response.json();
        })
        .then(data => {
            // Cargar líneas de atención
            const contenedorLineas = document.querySelector("#lineas-atencion") || document.querySelector(".canales-directos") || document.querySelector("div:has(> p)");
            
            // Si tienes un contenedor específico para líneas
            const lineasHTML = data.lineasAtencion
                .map(l => `<p><strong>${l.nombre}:</strong> ${l.numero}</p>`)
                .join("");
            
            // Renderizar en el bloque de canales de ayuda
            const bloqueAyuda = document.querySelector(".Canales") || document.querySelector("section") || document.body;
            const elementoCargando = Array.from(document.querySelectorAll("*")).find(el => el.textContent.includes("Cargando líneas"));
            if (elementoCargando) {
                elementoCargando.parentElement.innerHTML = lineasHTML;
            }

            // Cargar categorías en el select
            const selectCategoria = document.querySelector("select");
            if (selectCategoria && data.categorias) {
                selectCategoria.innerHTML = '<option value="">Selecciona una categoría...</option>';
                data.categorias.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat.id || cat;
                    option.textContent = cat.nombre || cat;
                    selectCategoria.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error en fetch:", error));

    // 2. CAPTURAR UBICACIÓN GPS
    const btnUbicacion = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("GPS")) || document.querySelector("button");
    const inputUbicacion = document.querySelector('input[placeholder*="Dirección"]') || document.querySelectorAll("input")[0];

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
