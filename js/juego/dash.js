import { CONTROLES } from "../entrada/controles.js";
import { chocaConObstaculo, obtenerRectangulo } from "./colisiones.js";
import { estaDisponible, iniciarRecarga } from "./recargas.js";
import { notificar } from "../estado/realimentacion.js";

/** @typedef {import("../estado/tipos.js").Vector} Vector */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */
/** @typedef {import("../estado/tipos.js").Mapa} Mapa */
/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */

// Distancia total del dash y tamaño de cada paso de comprobación.
const DISTANCIA_DASH_PX = 160;
const PASO_DASH_PX = 8;

/**
 * Calcula la dirección del dash según las teclas activas del corredor.
 * @param {Set<string>} teclas
 * @returns {Vector|null} Dirección normalizada o null si no hay ninguna.
 */
function obtenerDireccionDash(teclas) {
  const { izquierda, derecha, salto, descenso } = CONTROLES.corredor;
  const ejeX = Number(teclas.has(derecha)) - Number(teclas.has(izquierda));
  const ejeY = Number(teclas.has(descenso)) - Number(teclas.has(salto));
  const magnitud = Math.hypot(ejeX, ejeY);

  if (magnitud === 0) {
    return null;
  }

  return { x: ejeX / magnitud, y: ejeY / magnitud };
}

/**
 * Mueve al corredor en un solo eje si no choca con nada.
 * @param {Jugador} corredor
 * @param {"x"|"y"} eje
 * @param {number} paso
 * @param {Mapa} mapa
 * @returns {boolean} Indica si logró moverse.
 */
function avanzarEnEje(corredor, eje, paso, mapa) {
  if (paso === 0) {
    return false;
  }

  const caja = obtenerRectangulo(corredor);
  caja[eje] += paso;

  if (chocaConObstaculo(caja, mapa)) {
    return false;
  }

  corredor.posicion[eje] = caja[eje];
  return true;
}

/**
 * Avanza al corredor por pasos, revisando cada eje por separado para que
 * un choque vertical (como el suelo) no detenga el avance horizontal.
 * @param {Jugador} corredor
 * @param {Vector} direccion
 * @param {Mapa} mapa
 * @returns {boolean} Indica si el corredor se movió.
 */
function desplazarCorredor(corredor, direccion, mapa) {
  let seMovio = false;

  for (let recorrido = 0; recorrido < DISTANCIA_DASH_PX; recorrido += PASO_DASH_PX) {
    const avanzoX = avanzarEnEje(corredor, "x", direccion.x * PASO_DASH_PX, mapa);
    const avanzoY = avanzarEnEje(corredor, "y", direccion.y * PASO_DASH_PX, mapa);
    seMovio = seMovio || avanzoX || avanzoY;
  }

  return seMovio;
}

/**
 * Deja que la gravedad actúe si el dash tuvo componente vertical.
 * @param {Jugador} corredor
 * @param {Vector} direccion
 */
function ajustarEstadoVertical(corredor, direccion) {
  if (direccion.y === 0) {
    return;
  }

  corredor.estaEnSuelo = false;
  corredor.velocidad.y = 0;
}

/**
 * Ejecuta el dash solicitado si la recarga terminó y hay dirección.
 * @param {EstadoPartida} estado
 * @param {number} ahoraMs
 */
export function actualizarDash(estado, ahoraMs) {
  if (!estado.entradas.dashSolicitado) {
    return;
  }

  estado.entradas.dashSolicitado = false;

  const corredor = estado.jugadores.corredor;
  const habilidadDash = corredor.habilidades.dash;
  const direccion = obtenerDireccionDash(estado.entradas.teclasPresionadas);

  if (!estaDisponible(habilidadDash, ahoraMs)) {
    notificar(estado, "dash-recarga");
    return;
  }

  if (direccion === null) {
    notificar(estado, "dash-sin-direccion");
    return;
  }

  const origen = { ...corredor.posicion };

  // Si no pudo moverse (por ejemplo, hacia el suelo) no gasta la recarga.
  if (!desplazarCorredor(corredor, direccion, estado.mapa)) {
    notificar(estado, "dash-bloqueado");
    return;
  }

  ajustarEstadoVertical(corredor, direccion);
  iniciarRecarga(habilidadDash, ahoraMs);
  notificar(estado, "dash", origen);
}
