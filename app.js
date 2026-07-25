document.addEventListener("DOMContentLoaded", () => {
    // 1. CARGAR DATOS DESDE EL JSON (fetch)
    fetch("data.json")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar JSON");
            return response.json();
        })
        .then(data => {
            // Cargar líneas de atención de forma segura
            if (data.lineasAtencion) {
                const elementos = Array.from(document.querySelectorAll("*"));
                const elementoCargando = elementos.find(el => el.children.length === 0 && el.textContent.includes("Cargando líneas"));
                
                if (elementoCargando) {
                    const textoLineas = data.lineasAtencion
                        .map(l => {
                            // Detecta el nombre de la propiedad sin importar cómo se llame en el JSON
                            const titulo = l.nombre || l.titulo || l.tipo || l.name || "Línea";
                            const numero = l.numero || l.telefono || l.number || l;
                            return `<strong>${titulo}:</strong> ${numero}`;
                        })
                        .join("<br>");
                    
                    elementoCargando.parentElement.innerHTML = textoLineas;
                }
            }

            // Cargar categorías en el select
            const selectCategoria = document.querySelector("select");
            if (selectCategoria && data.categorias) {
                selectCategoria.innerHTML = '<option value="">Selecciona una categoría...</option>';
                data.categorias.forEach(cat => {
                    const option = document.createElement("option");
                    const valor = typeof cat === "object" ? (cat.nombre || cat.titulo || cat.name || cat.id) : cat;
                    option.value = valor;
                    option.textContent = valor;
                    selectCategoria.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error en fetch:", error));

    // 2. CAPTURAR UBICACIÓN GPS
    const botones = Array.from(document.querySelectorAll("button"));
    const btnUbicacion = botones.find(b => b.textContent.includes("GPS")) || botones[0];
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
