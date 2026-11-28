import { estadoPartida } from "./estado/estadoPartida.js";
import { obtenerConfiguracionPartida } from "./estado/configuracionPartida.js";
import {
  guardarEstadoPartida,
  restaurarEstadoPartida,
} from "./estado/persistencia.js";
import { registrarControles } from "./entrada/controles.js";
import { actualizarTemporizador } from "./interfaz/temporizador.js";
import { actualizarIndicadorRonda } from "./interfaz/indicadorRonda.js";
import { actualizarMarcador } from "./interfaz/marcador.js";
import { crearRenderizadorPartida } from "./interfaz/renderizarPartida.js";
import { configurarMenuPausa } from "./interfaz/menuPausa.js";
import { iniciarCicloJuego } from "./juego/cicloJuego.js";
import { actualizarIndicadoresHabilidades } from "./interfaz/indicadorHabilidades.js";
import { actualizarMovimiento } from "./juego/movimiento.js";
import { actualizarPuertas } from "./juego/puertas.js";
import { actualizarDash } from "./juego/dash.js";
import { actualizarDisparo } from "./juego/disparo.js";
import { limpiarRealimentacion } from "./estado/realimentacion.js";
import { atenderEventosNuevos } from "./interfaz/efectos.js";
import { prepararSonidos } from "./interfaz/sonidos.js";
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
  // El reloj de la ronda se detiene en pausa y reinicia en cada ronda.
  const ahoraMs = estadoPartida.tiempo.transcurridoMs;
  actualizarPuertas(estadoPartida, ahoraMs);
  actualizarDash(estadoPartida, ahoraMs);
  actualizarDisparo(estadoPartida, ahoraMs);
  actualizarMovimiento(estadoPartida, deltaMs);
  actualizarIndicadoresHabilidades(estadoPartida, ahoraMs);
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

/** Guarda el marcador actual y muestra su resultado en fin de ronda. */
function finalizarPartidaDesdePausa() {
  estadoPartida.finalizacionManual = true;
  estadoPartida.fase = "fin-partida";

  if (estadoPartida.puntajes.corredor > estadoPartida.puntajes.atrapador) {
    estadoPartida.ganadorPartida = "corredor";
  } else if (estadoPartida.puntajes.atrapador > estadoPartida.puntajes.corredor) {
    estadoPartida.ganadorPartida = "atrapador";
  } else {
    estadoPartida.ganadorPartida = null;
  }

  guardarEstadoPartida(estadoPartida);
  window.location.assign("fin_de_partida.html");
}

/** Inicia los controles y el ciclo cuando el documento está disponible. */
async function iniciarJuego() {
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

  const menuPausa = configurarMenuPausa(
    estadoPartida,
    finalizarPartidaDesdePausa,
  );
  registrarControles(estadoPartida, canvas, menuPausa.alternar);
  const renderizarCanvas = await crearRenderizadorPartida(canvas, estadoPartida);

  /** Dibuja el canvas y suena los eventos nuevos a partir del estado. */
  function renderizar() {
    renderizarCanvas();
    atenderEventosNuevos(estadoPartida);
  }

  limpiarRealimentacion(estadoPartida);
  prepararSonidos();
  estadoPartida.fase = "jugando";
  actualizarIndicadorRonda(estadoPartida);
  actualizarMarcador(estadoPartida);
  actualizarTemporizador(estadoPartida);
  renderizar();
  iniciarCicloJuego(estadoPartida, actualizarPartida, renderizar);
}

// El módulo se carga al final del documento, cuando el canvas ya existe.
iniciarJuego();
