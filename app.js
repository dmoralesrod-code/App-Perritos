// Obtener el botón y el input de ubicación
const btnUbicacion = document.querySelector('button'); // O el id/clase de tu botón
const inputUbicacion = document.querySelector('input[placeholder*="Dirección"]');

btnUbicacion.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que se recargue el formulario

    if (navigator.geolocation) {
        inputUbicacion.value = "Obteniendo ubicación...";
        
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                const lat = posicion.coords.latitude;
                const lon = posicion.coords.longitude;
                inputUbicacion.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
            },
            (error) => {
                alert("No se pudo obtener la ubicación. Por favor escríbela manualmente.");
                inputUbicacion.value = "";
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
});
