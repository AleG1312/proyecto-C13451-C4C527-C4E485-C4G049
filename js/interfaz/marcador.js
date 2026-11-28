/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */

// Cada rol muestra sus rondas ganadas debajo de su imagen.
const elementosPuntaje = {
  corredor: document.querySelector("#puntaje-juego-corredor"),
  atrapador: document.querySelector("#puntaje-juego-atrapador"),
};

/**
 * Escribe las rondas ganadas de un rol en su tarjeta.
 * @param {"corredor"|"atrapador"} rol
 * @param {number} puntaje
 */
function mostrarPuntaje(rol, puntaje) {
  const elemento = elementosPuntaje[rol];

  if (!(elemento instanceof HTMLSpanElement)) {
    throw new Error(`No se encontró el puntaje del ${rol}.`);
  }

  elemento.textContent = String(puntaje);
}

/**
 * Muestra en la pantalla de juego las rondas ganadas por cada rol.
 * @param {EstadoPartida} estado
 */
export function actualizarMarcador(estado) {
  mostrarPuntaje("corredor", estado.puntajes.corredor);
  mostrarPuntaje("atrapador", estado.puntajes.atrapador);
}
