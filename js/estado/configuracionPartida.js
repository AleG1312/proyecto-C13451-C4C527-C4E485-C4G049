// Clave usada para conservar las opciones elegidas antes de jugar.
const CLAVE_CONFIGURACION = "national-campaign:configuracion-partida";
const RONDAS_VALIDAS = new Set([1, 3, 5, 7]);
const DURACIONES_VALIDAS = new Set([60, 90, 120]);

/**
 * Valida y guarda la cantidad de rondas y su duración.
 * @param {number} totalRondas
 * @param {number} duracionSegundos
 * @returns {boolean} Indica si la configuración era válida.
 */
export function guardarConfiguracionPartida(totalRondas, duracionSegundos) {
  if (!RONDAS_VALIDAS.has(totalRondas) ||
      !DURACIONES_VALIDAS.has(duracionSegundos)) {
    return false;
  }

  sessionStorage.setItem(CLAVE_CONFIGURACION, JSON.stringify({
    totalRondas,
    duracionSegundos,
  }));
  return true;
}

/** Recupera las opciones guardadas para una partida nueva. */
export function obtenerConfiguracionPartida() {
  const contenido = sessionStorage.getItem(CLAVE_CONFIGURACION);

  if (contenido === null) {
    return null;
  }

  try {
    return JSON.parse(contenido);
  } catch {
    sessionStorage.removeItem(CLAVE_CONFIGURACION);
    return null;
  }
}
