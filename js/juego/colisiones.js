/** @typedef {import("../estado/tipos.js").Rectangulo} Rectangulo */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */
/** @typedef {import("../estado/tipos.js").Mapa} Mapa */

// Coordenada mínima del área jugable en ambos ejes.
const LIMITE_INICIAL_MAPA = 0;

/**
 * Convierte la zona de colisión de un jugador en un rectángulo.
 * @param {Jugador} jugador
 * @returns {Rectangulo}
 */
export function obtenerRectangulo(jugador) {
  return {
    x: jugador.posicion.x,
    y: jugador.posicion.y,
    ancho: jugador.ancho,
    alto: jugador.alto,
  };
}

/**
 * Indica si dos rectángulos se superponen.
 * @param {Rectangulo} primero
 * @param {Rectangulo} segundo
 * @returns {boolean}
 */
export function seSolapan(primero, segundo) {
  return primero.x < segundo.x + segundo.ancho &&
    primero.x + primero.ancho > segundo.x &&
    primero.y < segundo.y + segundo.alto &&
    primero.y + primero.alto > segundo.y;
}

/**
 * Elementos que bloquean el paso: paredes y puertas cerradas.
 * @param {Mapa} mapa
 * @returns {Rectangulo[]}
 */
export function obtenerObstaculos(mapa) {
  return [
    ...mapa.paredes,
    ...mapa.puertas.filter((puerta) => !puerta.abierta),
  ];
}

/**
 * Indica si un rectángulo sale del mapa o toca un obstáculo.
 * @param {Rectangulo} rectangulo
 * @param {Mapa} mapa
 * @returns {boolean}
 */
export function chocaConObstaculo(rectangulo, mapa) {
  const fueraDelMapa =
    rectangulo.x < LIMITE_INICIAL_MAPA ||
    rectangulo.y < LIMITE_INICIAL_MAPA ||
    rectangulo.x + rectangulo.ancho > mapa.ancho ||
    rectangulo.y + rectangulo.alto > mapa.alto;

  if (fueraDelMapa) {
    return true;
  }

  return obtenerObstaculos(mapa).some((obstaculo) =>
    seSolapan(rectangulo, obstaculo),
  );
}