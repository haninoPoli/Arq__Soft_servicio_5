function formatDate(dateString) {
    // Separar el año, mes y día
    var parts = dateString.split('-');
    // Crear un nuevo formato con el año-mes-día
    return parts[0] + '-' + parts[1] + '-' + parts[2];
}

    function crearReservacion() {
        // Obtener los valores de fecha de inicio y fin
        var fechaInicio = document.getElementById('fecha_inicio').value;
        var fechaFin = document.getElementById('fecha_fin').value;
        
        // Formatear las fechas al formato esperado (YYYY-MM-DD)
        var fechaInicioFormatted = formatDate(fechaInicio);
        var fechaFinFormatted = formatDate(fechaFin);
    
        const nombre = document.getElementById('nombre').value;
        const habitacion = document.getElementById('habitacion').value;
    
        // Datos de la reserva
        const data = {
            nombre: nombre,
            fecha_inicio: fechaInicioFormatted,
            fecha_fin: fechaFinFormatted,
            habitacion: habitacion
        };
    
        console.log("Datos a enviar:", data); // Agregar este mensaje para verificar los datos antes de enviarlos
    
        fetch('/api/reservaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert('Reservación creada correctamente');
                obtenerReservaciones();
            } else {
                alert('Error al crear la reservación');
            }
        });
    }

    function obtenerReservaciones() {
        fetch('/api/reservaciones')
            .then(response => response.json())
            .then(data => {
                const listaReservaciones = document.getElementById('listaReservaciones');
                listaReservaciones.innerHTML = ''; // Limpiar la lista antes de agregar nuevas reservaciones
                
                // Crear una fila de encabezado
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                // Agregar títulos a cada columna
                headerRow.innerHTML = `<th>Nombre</th><th>Fecha de Inicio</th><th>Fecha de Fin</th><th>Habitación</th>`;
                thead.appendChild(headerRow);
                listaReservaciones.appendChild(thead);
                
                // Crear las filas para cada reserva
                data.forEach(reservacion => {
                    const tr = document.createElement('tr');
                    // Formatear las fechas de inicio y fin
                    const fechaInicio = new Date(reservacion.fecha_inicio).toLocaleDateString('es-ES');
                    const fechaFin = new Date(reservacion.fecha_fin).toLocaleDateString('es-ES');
                    // Agregar cada detalle de la reserva como una celda en la fila
                    tr.innerHTML = `<td class="nombre">${reservacion.nombre}</td><td>${fechaInicio}</td><td>${fechaFin}</td><td>${reservacion.habitacion}</td>`;
                    listaReservaciones.appendChild(tr);
                });
            });
    }

    window.onload = () => {
        obtenerReservaciones();
    };
