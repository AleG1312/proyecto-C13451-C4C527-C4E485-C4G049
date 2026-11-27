import { obtenerProgresoRecarga } from "../juego/recargas.js";

const barraDash = document.querySelector("#dash-j1");
const barraDisparo = document.querySelector("#arma-j2");

/**
 * Muestra un porcentaje de recarga en una barra de la interfaz.
 * @param {Element|null} barra
 * @param {number} porcentaje
 */
function mostrarProgreso(barra, porcentaje) {
  if (!(barra instanceof HTMLProgressElement)) {
    return;
  }

  barra.value = porcentaje;
  barra.textContent = `${Math.round(porcentaje)}%`;
}

/**
 * Actualiza las barras de recarga del dash y del disparo.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {number} ahoraMs
 */
export function actualizarIndicadoresHabilidades(estado, ahoraMs) {
  const { corredor, atrapador } = estado.jugadores;

  mostrarProgreso(
    barraDash,
    obtenerProgresoRecarga(corredor.habilidades.dash, ahoraMs),
  );
  mostrarProgreso(
    barraDisparo,
    obtenerProgresoRecarga(atrapador.habilidades.disparo, ahoraMs),
  );
}
