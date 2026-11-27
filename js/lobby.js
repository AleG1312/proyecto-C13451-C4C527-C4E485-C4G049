import { guardarConfiguracionPartida } from "./estado/configuracionPartida.js";
import { eliminarEstadoPartida } from "./estado/persistencia.js";

// Duración de la espera antes de iniciar la partida automáticamente.
const DURACION_ESPERA_MS = 30000;
const INTERVALO_ACTUALIZACION_MS = 250;

const contador = document.querySelector(".cuenta-regresiva__tiempo");
const textoContador = contador?.querySelector("span");
const botonInicio = document.querySelector(".cuenta-regresiva__inicio");
const botonVolver = document.querySelector(".lobby-encabezado__volver");

if (!(contador instanceof HTMLTimeElement) ||
    !(textoContador instanceof HTMLSpanElement) ||
    !(botonInicio instanceof HTMLAnchorElement) ||
    !(botonVolver instanceof HTMLAnchorElement)) {
  throw new Error("No se encontraron los controles de la sala de espera.");
}

const instanteFinalMs = Date.now() + DURACION_ESPERA_MS;
let partidaIniciada = false;
let intervaloCuentaRegresiva;

// Conserva las opciones recibidas desde la configuración de sala.
const parametros = new URLSearchParams(window.location.search);
const configuracionValida = guardarConfiguracionPartida(
  Number(parametros.get("rondas")),
  Number(parametros.get("duracion")),
);

if (configuracionValida) {
  eliminarEstadoPartida();
}

/** Abre la pantalla de partida una sola vez. */
function iniciarPartida() {
  if (partidaIniciada) {
    return;
  }

  partidaIniciada = true;
  window.clearInterval(intervaloCuentaRegresiva);
  window.location.assign("game.html");
}

/** Actualiza el texto del contador según el tiempo restante. */
function actualizarCuentaRegresiva() {
  const restanteMs = Math.max(0, instanteFinalMs - Date.now());
  const segundos = Math.ceil(restanteMs / 1000);

  textoContador.textContent = `0:${String(segundos).padStart(2, "0")}`;
  contador.dateTime = `PT${segundos}S`;

  if (restanteMs === 0) {
    iniciarPartida();
  }
}

botonInicio.addEventListener("click", (evento) => {
  evento.preventDefault();
  iniciarPartida();
});

botonVolver.addEventListener("click", (evento) => {
  evento.preventDefault();

  // Regresa al origen real y usa el inicio si no existe historial previo.
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.assign("index.html");
  }
});

// Muestra 0:30 de inmediato y mantiene el conteo sincronizado.
actualizarCuentaRegresiva();
intervaloCuentaRegresiva = window.setInterval(
  actualizarCuentaRegresiva,
  INTERVALO_ACTUALIZACION_MS,
);
