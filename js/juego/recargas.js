/** @typedef {import("../estado/tipos.js").Habilidad} Habilidad */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */

// Proporción de velocidad que conserva un jugador ralentizado.
const FACTOR_VELOCIDAD_NORMAL = 1;
const FACTOR_VELOCIDAD_RALENTIZADA = 0.1;
const PORCENTAJE_COMPLETO = 100;

/**
 * Indica si una habilidad ya cumplió su tiempo de recarga.
 * @param {Habilidad} habilidad
 * @param {number} ahoraMs
 * @returns {boolean}
 */
export function estaDisponible(habilidad, ahoraMs) {
  return ahoraMs >= habilidad.disponibleDesdeMs;
}

/**
 * Inicia la recarga de la habilidad a partir del instante actual.
 * @param {Habilidad} habilidad
 * @param {number} ahoraMs
 */
export function iniciarRecarga(habilidad, ahoraMs) {
  habilidad.disponibleDesdeMs = ahoraMs + habilidad.recargaMs;
}

/**
 * Calcula el porcentaje de recarga (0 a 100) para las barras de la interfaz.
 * @param {Habilidad} habilidad
 * @param {number} ahoraMs
 * @returns {number}
 */
export function obtenerProgresoRecarga(habilidad, ahoraMs) {
  if (habilidad.recargaMs <= 0) {
    return PORCENTAJE_COMPLETO;
  }

  const restanteMs = Math.max(0, habilidad.disponibleDesdeMs - ahoraMs);
  const progreso = (1 - restanteMs / habilidad.recargaMs) * PORCENTAJE_COMPLETO;

  return Math.min(PORCENTAJE_COMPLETO, Math.max(0, progreso));
}

/**
 * Ralentiza al jugador durante el tiempo indicado.
 * @param {Jugador} jugador
 * @param {number} ahoraMs
 * @param {number} duracionMs
 */
export function ralentizar(jugador, ahoraMs, duracionMs) {
  jugador.ralentizadoHastaMs = ahoraMs + Math.max(0, duracionMs);
}

/**
 * Devuelve el multiplicador de velocidad actual del jugador.
 * @param {Jugador} jugador
 * @param {number} ahoraMs
 * @returns {number}
 */
export function obtenerFactorVelocidad(jugador, ahoraMs) {
  return estaRalentizado(jugador, ahoraMs)
    ? FACTOR_VELOCIDAD_RALENTIZADA
    : FACTOR_VELOCIDAD_NORMAL;
}

/**
 * Indica si el efecto de ralentización sigue activo.
 * @param {Jugador} jugador
 * @param {number} ahoraMs
 * @returns {boolean}
 */
export function estaRalentizado(jugador, ahoraMs) {
  return ahoraMs < jugador.ralentizadoHastaMs;
}
