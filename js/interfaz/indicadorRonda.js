const indicadorRonda = document.querySelector(".canvas-contenedor__titulo");

/**
 * Muestra la ronda actual y la cantidad total configurada.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 */
export function actualizarIndicadorRonda(estado) {
  if (!(indicadorRonda instanceof HTMLLegendElement)) {
    throw new Error("No se encontró el indicador de ronda.");
  }

  indicadorRonda.textContent =
    `Ronda ${estado.ronda.actual} de ${estado.ronda.total}`;
}
