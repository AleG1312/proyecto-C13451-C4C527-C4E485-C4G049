// Limita saltos grandes cuando la pestaña estuvo inactiva.
const DELTA_MAXIMO_MS = 100;

/**
 * Inicia el ciclo que actualiza la partida en cada cuadro del navegador.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {(deltaMs: number, instanteMs: number) => void} actualizar
 * @param {() => void} renderizar
 */
export function iniciarCicloJuego(estado, actualizar, renderizar) {
  let instanteAnteriorMs = performance.now();

  function ejecutarCuadro(instanteMs) {
    const deltaMs = Math.min(
      instanteMs - instanteAnteriorMs,
      DELTA_MAXIMO_MS,
    );
    instanteAnteriorMs = instanteMs;

    // La pausa mantiene el ciclo activo, pero detiene los cambios del juego.
    if (estado.fase === "jugando") {
      actualizar(deltaMs, instanteMs);
    }

    // La imagen siempre refleja la última posición guardada en el estado.
    renderizar();

    window.requestAnimationFrame(ejecutarCuadro);
  }

  window.requestAnimationFrame(ejecutarCuadro);
}
