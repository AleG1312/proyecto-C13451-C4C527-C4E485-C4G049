import { estadoPartida } from "./estado/estadoPartida.js";
import {
  eliminarEstadoPartida,
  restaurarEstadoPartida,
} from "./estado/persistencia.js";

const puntajeCorredor = document.querySelector("#puntaje-corredor");
const puntajeAtrapador = document.querySelector("#puntaje-atrapador");
const ganadorRonda = document.querySelector("#ganador-ronda");
const etiquetaGanador = document.querySelector("#etiqueta-ganador");
const accionFinRonda = document.querySelector("#accion-fin-ronda");

if (!(puntajeCorredor instanceof HTMLSpanElement) ||
    !(puntajeAtrapador instanceof HTMLSpanElement) ||
    !(ganadorRonda instanceof HTMLSpanElement) ||
    !(etiquetaGanador instanceof HTMLElement) ||
    !(accionFinRonda instanceof HTMLAnchorElement)) {
  throw new Error("No se encontraron los datos del resultado de la ronda.");
}

// Recupera los puntos acumulados de todas las rondas anteriores.
if (restaurarEstadoPartida(estadoPartida)) {
  puntajeCorredor.textContent = String(estadoPartida.puntajes.corredor);
  puntajeAtrapador.textContent = String(estadoPartida.puntajes.atrapador);

  if (estadoPartida.finalizacionManual) {
    etiquetaGanador.textContent = "Resultado de la partida:";

    if (estadoPartida.ganadorPartida === null) {
      ganadorRonda.textContent = "Empate";
    } else if (estadoPartida.ganadorPartida === "corredor") {
      ganadorRonda.textContent = "Corredor";
    } else {
      ganadorRonda.textContent = "Atrapador";
    }

    accionFinRonda.textContent = "Menú principal";
    accionFinRonda.href = "index.html";
    eliminarEstadoPartida();
  } else if (estadoPartida.ronda.ganador === "corredor") {
    ganadorRonda.textContent = "Corredor";
  } else if (estadoPartida.ronda.ganador === "atrapador") {
    ganadorRonda.textContent = "Atrapador";
  }
}
