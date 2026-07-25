document.addEventListener('DOMContentLoaded', () => {
    const selectTipo = document.getElementById('select-tipo');
    const statusMsg = document.getElementById('geo-status');
    const btnGeo = document.getElementById('btn-geolocalizar');
    const inputUbicacion = document.getElementById('ubicacion');

    // Cargar los datos desde data.json
    fetch('./data.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar data.json');
            return response.json();
        })
        .then(data => {
            // Rellenar las categorías en el <select>
            if (data.categorias && selectTipo) {
                data.categorias.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id || cat;
                    option.textContent = cat.nombre || cat;
                    selectTipo.appendChild(option);
                });
            }

            // Rellenar las líneas de atención / canales de ayuda
            const canalesContainer = document.querySelector('.card p');
            if (data.lineasAtencion && canalesContainer) {
                const lista = document.createElement('ul');
                lista.style.listStyle = 'none';
                lista.style.padding = '0';
                lista.style.marginTop = '10px';

                data.lineasAtencion.forEach(linea => {
                    const item = document.createElement('li');
                    item.style.marginBottom = '8px';
                    item.innerHTML = `<strong>${linea.nombre || linea.entidad}:</strong> ${linea.telefono || linea.numero}`;
                    lista.appendChild(item);
                });

                // Reemplazar el texto "Cargando líneas de atención..."
                canalesContainer.parentNode.replaceChild(lista, canalesContainer);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Geolocalización (si el botón existe)
    if (btnGeo && inputUbicacion) {
        btnGeo.addEventListener('click', () => {
            if (navigator.geolocation) {
                if (statusMsg) statusMsg.textContent = 'Obteniendo ubicación...';
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        inputUbicacion.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                        if (statusMsg) statusMsg.textContent = '¡Ubicación obtenida!';
                    },
                    () => {
                        if (statusMsg) statusMsg.textContent = 'No se pudo obtener la ubicación.';
                    }
                );
            } else {
                if (statusMsg) statusMsg.textContent = 'Geolocalización no soportada.';
            }
        });
    }
});
