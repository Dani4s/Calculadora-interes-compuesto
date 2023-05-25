let chart = null;

function resizeCanvas() {
const canvas = document.getElementById("graficaInversion");
const aspectRatioDesktop = 0.75; // Proporción de altura a anchura en pantallas de escritorio (por ejemplo, 0.75 = 3:4)
const aspectRatioMobile = 1.5; // Proporción de altura a anchura en dispositivos móviles (por ejemplo, 1.5 = 3:2)
const maxWidthDesktop = 1000; // Ancho máximo en pantallas de escritorio
const maxWidthMobile = window.innerWidth * 0.9; // Ancho máximo en dispositivos móviles (90% del ancho de la ventana)

if (window.innerWidth >= 600) {
  canvas.width = Math.min(maxWidthDesktop, maxWidthMobile);
  canvas.height = canvas.width * aspectRatioDesktop;
} else {
  canvas.width = Math.min(maxWidthMobile, window.innerWidth);
  canvas.height = canvas.width * aspectRatioMobile;
}
}

function calcularInversion() {
// Obtener los valores introducidos por el usuario
const ahorroInicial = parseFloat(
  document.getElementById("ahorroInicial").value
);
const añosDeInversion = parseInt(
  document.getElementById("añosDeInversion").value
);
const rendimientoAnual = parseFloat(
  document.getElementById("rendimientoAnual").value
) / 100;
const aportacionesAnuales = parseFloat(
  document.getElementById("aportacionesAnuales").value
);

// Iniciamos las constantes que nos servirán para calcular el rendimiento total de una inversión.
const tabla = document.getElementById("tablaInversion");
const lienzo = document
  .getElementById("graficaInversion")
  .getContext("2d");

// Creamos los arrays para almacenar los datos de la gráfica
const labels = [];
const ganancias = [];
const aportacionesAcumuladas = [];
const ahorrosTotales = [];

// Mostramos cuanto ganamos si no invertimos el dinero.
console.log(
  "Si no invierte, al terminar " +
  añosDeInversion +
  " años usted tendría " +
  ahorroInicial
);

// Creamos la función con la que vamos a calcular nuestro rendimiento
function rendimientoDeInversion(
  ahorro,
  años,
  rendimiento,
  aportaciones
) {
  let dineroGanadoAlAño = 0;
  let dineroGanadoAcumulado = 0;
  let aportacionesTotales = 0;

  // Limpiamos la tabla y la gráfica antes de crear nuevas
  while (tabla.rows.length > 0) {
    tabla.deleteRow(0);
  }
  if (chart) chart.destroy();

  // Agregamos la fila de encabezado de la tabla
  const filaEncabezado = tabla.insertRow();
  filaEncabezado.innerHTML =
    "<th>Año</th><th>Dinero ganado al año</th><th>Ahorro total</th>";

  for (let i = 1; i <= años; i++) {
    dineroGanadoAlAño = ahorro * rendimiento;
    dineroGanadoAcumulado += dineroGanadoAlAño;
    aportacionesTotales += aportaciones;
    ahorro += dineroGanadoAlAño + aportaciones;
    console.log(
      "Gano en el año " +
      i +
      " unos " +
      dineroGanadoAlAño.toFixed(2) +
      " pesos mexicanos"
    );

    // Agregamos los datos a los arrays de la gráfica
    labels.push("Año " + i);
    ganancias.push(dineroGanadoAcumulado);
    aportacionesAcumuladas.push(aportacionesTotales);
    ahorrosTotales.push(ahorro);

    // Creamos una nueva fila en la tabla para mostrar los datos
    const fila = tabla.insertRow();
    const celdaAnio = fila.insertCell();
    const celdaGanancia = fila.insertCell();
    const celdaAhorro = fila.insertCell();
    celdaAnio.textContent = i;
    celdaGanancia.textContent =
      dineroGanadoAlAño.toFixed(2) + " pesos mexicanos";
    celdaAhorro.textContent = ahorro.toFixed(2) + " pesos mexicanos";
  }
  console.log(
    "Su dinero al finalizar la inversión será de: " +
    ahorro.toFixed(2) +
    " pesos mexicanos"
  );

  // Creamos la gráfica de líneas
  chart = new Chart(lienzo, {
    type: "bar", // Cambiamos el tipo de gráfica a barras
    data: {
      labels: labels,
      datasets: [
        {
          label: "Ahorro inicial",
          data: Array(años).fill(ahorroInicial),
          backgroundColor: "rgba(0, 0, 255, 0.5)", // Azul transparente
          borderColor: "rgba(0, 0, 255, 1)", // Azul
          borderWidth: 1,
        },
        {
          label: "Aportaciones anuales acumuladas",
          data: aportacionesAcumuladas,
          backgroundColor: "rgba(34,113,179,0.5)", // Azul celeste trasparente
          borderColor: "rgba(34,113,179,1)", // Azul celeste
          borderWidth: 1,
        },
        {
          label: "Dinero ganado acumulado",
          data: ganancias,
          backgroundColor: "rgba(0, 255, 0, 0.5)", // Verde claro trasparente
          borderColor: "rgba(0, 255, 0, 1)", // Verde claro
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
        x: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

rendimientoDeInversion(
  ahorroInicial,
  añosDeInversion,
  rendimientoAnual,
  aportacionesAnuales
);
}