import { estadoPartida } from "./estado/estadoPartida.js";
import { obtenerConfiguracionPartida } from "./estado/configuracionPartida.js";
import {
  guardarEstadoPartida,
  restaurarEstadoPartida,
} from "./estado/persistencia.js";
import { registrarControles } from "./entrada/controles.js";
import { actualizarTemporizador } from "./interfaz/temporizador.js";
import { iniciarCicloJuego } from "./juego/cicloJuego.js";
import {
  evaluarFinDeRonda,
  prepararSiguienteRonda,
} from "./juego/rondas.js";

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
  actualizarTemporizador(estadoPartida);

  const resultado = evaluarFinDeRonda(estadoPartida);

  if (resultado !== null) {
    guardarEstadoPartida(estadoPartida);
    const destino = resultado === "fin-partida"
      ? "fin_de_partida.html"
      : "fin_de_ronda.html";
    window.location.assign(destino);
  }
}

/** Inicia los controles y el ciclo cuando el documento está disponible. */
function iniciarJuego() {
  const canvas = document.querySelector("#juego");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No se encontró el canvas del juego.");
  }

  const habiaPartida = restaurarEstadoPartida(estadoPartida);

  if (!habiaPartida) {
    const configuracion = obtenerConfiguracionPartida();

    if (configuracion !== null) {
      const duracionMs = configuracion.duracionSegundos * 1000;
      estadoPartida.ronda.total = configuracion.totalRondas;
      estadoPartida.tiempo.duracionRondaMs = duracionMs;
      estadoPartida.tiempo.restanteMs = duracionMs;
    }
  }

  if (habiaPartida && estadoPartida.fase === "fin-ronda") {
    prepararSiguienteRonda(estadoPartida);
  }

  registrarControles(estadoPartida, canvas);
  estadoPartida.fase = "jugando";
  actualizarTemporizador(estadoPartida);
  iniciarCicloJuego(estadoPartida, actualizarPartida);
}

// El módulo se carga al final del documento, cuando el canvas ya existe.
iniciarJuego();
