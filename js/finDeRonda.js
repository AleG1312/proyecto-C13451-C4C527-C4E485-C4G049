import { estadoPartida } from "./estado/estadoPartida.js";
import { restaurarEstadoPartida } from "./estado/persistencia.js";

const puntajeCorredor = document.querySelector("#puntaje-corredor");
const puntajeAtrapador = document.querySelector("#puntaje-atrapador");
const ganadorRonda = document.querySelector("#ganador-ronda");

if (!(puntajeCorredor instanceof HTMLSpanElement) ||
    !(puntajeAtrapador instanceof HTMLSpanElement) ||
    !(ganadorRonda instanceof HTMLSpanElement)) {
  throw new Error("No se encontraron los datos del resultado de la ronda.");
}

// Recupera los puntos acumulados de todas las rondas anteriores.
if (restaurarEstadoPartida(estadoPartida)) {
  puntajeCorredor.textContent = String(estadoPartida.puntajes.corredor);
  puntajeAtrapador.textContent = String(estadoPartida.puntajes.atrapador);

  if (estadoPartida.ronda.ganador === "corredor") {
    ganadorRonda.textContent = "Corredor";
  } else if (estadoPartida.ronda.ganador === "atrapador") {
    ganadorRonda.textContent = "Atrapador";
  }
}
