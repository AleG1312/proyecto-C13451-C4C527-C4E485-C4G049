import { estaRalentizado } from "../juego/recargas.js";

/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */

// Tiempo que el trazo del disparo permanece visible.
const DURACION_TRAZO_MS = 120;
const RADIO_IMPACTO_PX = 6;

/**
 * Dibuja las puertas: rellenas si están cerradas, solo el borde si están abiertas.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 */
function dibujarPuertas(contexto, estado) {
  contexto.save();
  contexto.fillStyle = "#6b3e1f";
  contexto.strokeStyle = "#6b3e1f";

  estado.mapa.puertas.forEach((puerta) => {
    if (puerta.abierta) {
      contexto.strokeRect(puerta.x, puerta.y, puerta.ancho, puerta.alto);
    } else {
      contexto.fillRect(puerta.x, puerta.y, puerta.ancho, puerta.alto);
    }
  });

  contexto.restore();
}

/**
 * Cubre con un tinte azul a los jugadores ralentizados.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 */
function dibujarRalentizacion(contexto, estado) {
  const ahoraMs = estado.tiempo.transcurridoMs;
  contexto.save();
  contexto.fillStyle = "rgba(80, 160, 255, 0.4)";

  Object.values(estado.jugadores).forEach((jugador) => {
    if (estaRalentizado(jugador, ahoraMs)) {
      contexto.fillRect(
        jugador.posicion.x,
        jugador.posicion.y,
        jugador.ancho,
        jugador.alto,
      );
    }
  });

  contexto.restore();
}

/**
 * Dibuja el último disparo como una línea que se desvanece.
 * Roja si acertó, naranja si falló.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 */
function dibujarDisparo(contexto, estado) {
  const disparo = estado.ultimoDisparo;

  if (!disparo) {
    return;
  }

  const edadMs = estado.tiempo.transcurridoMs - disparo.instanteMs;

  if (edadMs < 0 || edadMs > DURACION_TRAZO_MS) {
    return;
  }

  contexto.save();
  contexto.globalAlpha = 1 - edadMs / DURACION_TRAZO_MS;
  contexto.strokeStyle = disparo.acerto ? "#ff2d2d" : "#ffb000";
  contexto.fillStyle = contexto.strokeStyle;
  contexto.lineWidth = 3;

  contexto.beginPath();
  contexto.moveTo(disparo.origen.x, disparo.origen.y);
  contexto.lineTo(disparo.destino.x, disparo.destino.y);
  contexto.stroke();

  contexto.beginPath();
  contexto.arc(disparo.destino.x, disparo.destino.y, RADIO_IMPACTO_PX, 0, Math.PI * 2);
  contexto.fill();
  contexto.restore();
}

/**
 * Dibuja puertas, ralentizaciones y disparo a partir del estado.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 */
export function dibujarHabilidades(contexto, estado) {
  dibujarPuertas(contexto, estado);
  dibujarRalentizacion(contexto, estado);
  dibujarDisparo(contexto, estado);
}
