/** @typedef {import("./tipos.js").EstadoPartida} EstadoPartida */
/** @typedef {import("./tipos.js").TipoEvento} TipoEvento */
/** @typedef {import("./tipos.js").Vector} Vector */

// Los efectos más largos duran menos que esto; lo anterior ya no se usa.
const VIGENCIA_EVENTO_MS = 1000;

/**
 * Registra en el estado algo que le pasó a un jugador (un dash, un disparo,
 * una habilidad en recarga...). La interfaz lo convierte en sonido y
 * animación; aquí solo se anota qué pasó y cuándo.
 * @param {EstadoPartida} estado
 * @param {TipoEvento} tipo
 * @param {Vector} [origen] - Punto de partida, para dibujar la estela del dash.
 */
export function notificar(estado, tipo, origen) {
  const ahoraMs = estado.tiempo.transcurridoMs;
  const realimentacion = estado.realimentacion;

  realimentacion.ultimoId += 1;
  realimentacion.eventos = realimentacion.eventos.filter(
    (evento) => ahoraMs - evento.instanteMs < VIGENCIA_EVENTO_MS,
  );
  realimentacion.eventos.push({
    id: realimentacion.ultimoId,
    tipo,
    instanteMs: ahoraMs,
    ...(origen === undefined ? {} : { origen: { ...origen } }),
  });
}

/**
 * Borra los eventos anteriores, por ejemplo al comenzar otra ronda.
 * @param {EstadoPartida} estado
 */
export function limpiarRealimentacion(estado) {
  estado.realimentacion.eventos = [];
  estado.realimentacion.ultimoId = 0;
}
