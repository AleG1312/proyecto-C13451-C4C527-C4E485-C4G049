import { obtenerRectangulo, seSolapan } from "./colisiones.js";
import { notificar } from "../estado/realimentacion.js";

/** @typedef {import("../estado/tipos.js").Puerta} Puerta */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */
/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */

// Tiempo que el corredor debe permanecer encima y tiempo que dura cerrada.
const PERMANENCIA_PARA_CERRAR_MS = 2000;
const DURACION_CERRADA_MS = 4000;

/**
 * Reabre la puerta cuando vence su tiempo cerrada.
 * @param {Puerta} puerta
 * @param {number} ahoraMs
 */
function reabrirSiCorresponde(puerta, ahoraMs) {
  if (puerta.abreEnMs === null || ahoraMs < puerta.abreEnMs) {
    return;
  }

  puerta.abierta = true;
  puerta.abreEnMs = null;
}

/**
 * Saca al corredor hacia el lado más cercano para que no quede atrapado.
 * @param {Puerta} puerta
 * @param {Jugador} corredor
 */
function expulsarCorredor(puerta, corredor) {
  const centroPuerta = puerta.x + puerta.ancho / 2;
  const centroCorredor = corredor.posicion.x + corredor.ancho / 2;

  corredor.posicion.x = centroCorredor < centroPuerta
    ? puerta.x - corredor.ancho
    : puerta.x + puerta.ancho;
}

/**
 * Cierra la puerta y programa su reapertura automática.
 * @param {Puerta} puerta
 * @param {Jugador} corredor
 * @param {number} ahoraMs
 */
function cerrarPuerta(puerta, corredor, ahoraMs) {
  puerta.abierta = false;
  puerta.cierraEnMs = null;
  puerta.abreEnMs = ahoraMs + DURACION_CERRADA_MS;
  expulsarCorredor(puerta, corredor);
}

/**
 * Cuenta la permanencia del corredor sobre la puerta y la cierra al cumplirse.
 * @param {Puerta} puerta
 * @param {Jugador} corredor
 * @param {number} ahoraMs
 * @returns {boolean} Indica si la puerta se cerró en este cuadro.
 */
function contarPermanencia(puerta, corredor, ahoraMs) {
  if (!seSolapan(obtenerRectangulo(corredor), puerta)) {
    puerta.cierraEnMs = null;
  } else if (puerta.cierraEnMs === null) {
    puerta.cierraEnMs = ahoraMs + PERMANENCIA_PARA_CERRAR_MS;
  } else if (ahoraMs >= puerta.cierraEnMs) {
    cerrarPuerta(puerta, corredor, ahoraMs);
    return true;
  }

  return false;
}

/**
 * Actualiza el estado de todas las puertas del mapa.
 * @param {EstadoPartida} estado
 * @param {number} ahoraMs
 */
export function actualizarPuertas(estado, ahoraMs) {
  const corredor = estado.jugadores.corredor;

  for (const puerta of estado.mapa.puertas) {
    if (puerta.abierta) {
      if (contarPermanencia(puerta, corredor, ahoraMs)) {
        notificar(estado, "puerta-cerrada");
      }
    } else {
      reabrirSiCorresponde(puerta, ahoraMs);
    }
  }
}
