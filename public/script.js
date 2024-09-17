let competidores = [];
let temporizadores = [null, null, null, null, null];
let tiempos = [0, 0, 0, 0, 0];

const form = document.getElementById('competidorForm');
const iniciarBtn = document.getElementById('iniciarBtn');
const cargarCarreraBtn = document.getElementById('cargarCarreraBtn');
const botonesDetener = [
    document.getElementById('detener1'),
    document.getElementById('detener2'),
    document.getElementById('detener3'),
    document.getElementById('detener4'),
    document.getElementById('detener5')
];

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nadador = document.getElementById('nadador').value;
    const estilo = document.getElementById('estilo').value;
    const distancia = document.getElementById('distancia').value;

    const competidor = { nadador, estilo, distancia, tiempo: null }; // Agregar campo tiempo
    competidores.push(competidor);
    form.reset();

    if (competidores.length === 5) {
        alert('5 competidores registrados. Presiona "Iniciar Temporizadores".');
    }
});

iniciarBtn.addEventListener('click', () => {
    if (competidores.length < 5) {
        alert('Debes registrar 5 competidores antes de iniciar los temporizadores.');
        return;
    }

    for (let i = 0; i < 5; i++) {
        if (temporizadores[i] === null) {
            temporizadores[i] = setInterval(() => {
                tiempos[i]++;
                botonesDetener[i].textContent = `Detener Temporizador ${i + 1}: ${tiempos[i]}s`;
            }, 1000);
        }
    }
});

botonesDetener.forEach((boton, indice) => {
    boton.addEventListener('click', () => detenerTemporizador(indice));
});

function detenerTemporizador(indice) {
    if (temporizadores[indice] !== null) {
        clearInterval(temporizadores[indice]);
        console.log(`Temporizador ${indice + 1} detenido en ${tiempos[indice]} segundos`);

        competidores[indice].tiempo = tiempos[indice];

        temporizadores[indice] = null;

        if (temporizadores.every(timer => timer === null)) {
            guardarEnLocalStorage();
        }
    }
}

function guardarEnLocalStorage() {
    const competidoresJson = {};
    competidores.forEach((competidor, index) => {
        competidoresJson[`competidor ${index + 1}`] = competidor;
    });

    localStorage.setItem('competidores', JSON.stringify(competidoresJson));
    alert('Todos los tiempos han sido registrados y guardados en localStorage.');
    competidores = [];
    tiempos = [0, 0, 0, 0, 0]; // Reiniciar tiempos
}

cargarCarreraBtn.addEventListener('click', async () => {
    const competidoresJson = JSON.parse(localStorage.getItem('competidores'));
    if (!competidoresJson) {
        alert('No hay datos de competidores en localStorage.');
        return;
    }

    try {
        const response = await fetch('/cargar-carrera', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                carrera: competidoresJson,
                fecha: new Date().toISOString()
            })
        });

        if (response.ok) {
            alert('Datos de la carrera cargados correctamente.');
        } else {
            alert('Error al cargar los datos de la carrera.');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al enviar los datos.');
    }
});
