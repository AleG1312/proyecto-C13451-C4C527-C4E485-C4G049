import { estadoPartida } from "./estado/estadoPartida.js";
import { registrarControles } from "./entrada/controles.js";
import { iniciarCicloJuego } from "./juego/cicloJuego.js";

/**
 * Actualiza los datos generales que avanzan con el tiempo.
 * Las mecánicas se conectarán aquí mediante sus propios módulos.
 * @param {number} deltaMs
 */
function actualizarPartida(deltaMs) {
  estadoPartida.tiempo.transcurridoMs += deltaMs;
  estadoPartida.tiempo.restanteMs = Math.max(
    0,
    estadoPartida.tiempo.restanteMs - deltaMs,
  );
}

/** Inicia los controles y el ciclo cuando el documento está disponible. */
function iniciarJuego() {
  const canvas = document.querySelector("#juego");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No se encontró el canvas del juego.");
  }

  registrarControles(estadoPartida, canvas);
  estadoPartida.fase = "jugando";
  iniciarCicloJuego(estadoPartida, actualizarPartida);
}

// El módulo se carga al final del documento, cuando el canvas ya existe.
iniciarJuego();
