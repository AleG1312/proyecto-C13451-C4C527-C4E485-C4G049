// Clave privada usada para conservar la partida entre páginas.
const CLAVE_ESTADO = "national-campaign:estado-partida";

/**
 * Guarda una copia del estado en la sesión actual del navegador.
 * @param {import("./tipos.js").EstadoPartida} estado
 */
export function guardarEstadoPartida(estado) {
  // Las entradas activas no deben mantenerse al cambiar de pantalla.
  const copia = {
    ...estado,
    entradas: {
      teclasPresionadas: [],
      puntero: { ...estado.entradas.puntero },
      disparoSolicitado: false,
    },
  };

  sessionStorage.setItem(CLAVE_ESTADO, JSON.stringify(copia));
}

/**
 * Recupera el progreso guardado dentro del objeto compartido.
 * @param {import("./tipos.js").EstadoPartida} estado
 * @returns {boolean} Indica si se encontró un estado válido.
 */
export function restaurarEstadoPartida(estado) {
  const contenido = sessionStorage.getItem(CLAVE_ESTADO);

  if (contenido === null) {
    return false;
  }

  try {
    const estadoGuardado = JSON.parse(contenido);

    if (estadoGuardado.jugadores === undefined ||
        estadoGuardado.ronda === undefined) {
      return false;
    }

    Object.assign(estado, estadoGuardado);
    estado.entradas.teclasPresionadas = new Set();
    estado.entradas.disparoSolicitado = false;
    return true;
  } catch {
    // Un estado ilegible se descarta para permitir una partida nueva.
    sessionStorage.removeItem(CLAVE_ESTADO);
    return false;
  }
}
