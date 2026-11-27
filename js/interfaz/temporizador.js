const elementoTiempo = document.querySelector(".temporizador time");

/**
 * Muestra el tiempo restante de la ronda con formato minutos:segundos.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 */
export function actualizarTemporizador(estado) {
  if (!(elementoTiempo instanceof HTMLTimeElement)) {
    throw new Error("No se encontró el temporizador de la partida.");
  }

  const totalSegundos = Math.ceil(estado.tiempo.restanteMs / 1000);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;

  elementoTiempo.textContent = `${minutos}:${String(segundos).padStart(2, "0")}`;
  elementoTiempo.dateTime = `PT${totalSegundos}S`;
}
