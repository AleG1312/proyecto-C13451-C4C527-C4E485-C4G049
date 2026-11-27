import { CONTROLES } from "../entrada/controles.js";

// Valores compartidos para un movimiento uniforme en ambos personajes.
const VELOCIDAD_HORIZONTAL = 240;
const GRAVEDAD = 1400;
const ALTURA_SALTO_EN_TAMANOS = 2.5;

/**
 * Obtiene la dirección horizontal indicada por las teclas activas.
 * @param {Set<string>} teclas
 * @param {{izquierda: string, derecha: string}} controles
 */
function obtenerDireccion(teclas, controles) {
  const izquierda = teclas.has(controles.izquierda) ? -1 : 0;
  const derecha = teclas.has(controles.derecha) ? 1 : 0;
  return izquierda + derecha;
}

/**
 * Actualiza el movimiento lateral y la trayectoria de salto de un jugador.
 * @param {import("../estado/tipos.js").Jugador} jugador
 * @param {{izquierda: string, derecha: string}} controles
 * @param {Set<string>} teclas
 * @param {boolean} saltoSolicitado
 * @param {number} deltaSegundos
 * @param {number} anchoMapa
 * @param {number} altoMapa
 */
function moverJugador(
  jugador,
  controles,
  teclas,
  saltoSolicitado,
  deltaSegundos,
  anchoMapa,
  altoMapa,
) {
  const direccion = obtenerDireccion(teclas, controles);
  jugador.velocidad.x = direccion * VELOCIDAD_HORIZONTAL;

  // La velocidad inicial produce una altura de 2.5 veces el personaje.
  if (saltoSolicitado && jugador.estaEnSuelo) {
    const alturaSalto = jugador.alto * ALTURA_SALTO_EN_TAMANOS;
    jugador.velocidad.y = -Math.sqrt(2 * GRAVEDAD * alturaSalto);
    jugador.estaEnSuelo = false;
  }

  jugador.posicion.x += jugador.velocidad.x * deltaSegundos;
  jugador.posicion.x = Math.max(
    0,
    Math.min(jugador.posicion.x, anchoMapa - jugador.ancho),
  );

  if (!jugador.estaEnSuelo) {
    jugador.posicion.y += jugador.velocidad.y * deltaSegundos +
      0.5 * GRAVEDAD * deltaSegundos ** 2;
    jugador.velocidad.y += GRAVEDAD * deltaSegundos;
  }

  // Los pies se apoyan en el borde inferior al terminar el salto.
  const posicionSuelo = altoMapa - jugador.alto;
  if (jugador.posicion.y >= posicionSuelo) {
    jugador.posicion.y = posicionSuelo;
    jugador.velocidad.y = 0;
    jugador.estaEnSuelo = true;
  }
}

/**
 * Mueve a ambos jugadores a partir de las entradas del cuadro actual.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {number} deltaMs
 */
export function actualizarMovimiento(estado, deltaMs) {
  const deltaSegundos = deltaMs / 1000;

  for (const rol of ["corredor", "atrapador"]) {
    moverJugador(
      estado.jugadores[rol],
      CONTROLES[rol],
      estado.entradas.teclasPresionadas,
      estado.entradas.saltosSolicitados[rol],
      deltaSegundos,
      estado.mapa.ancho,
      estado.mapa.alto,
    );

    // El intento se consume aunque el personaje estuviera en el aire.
    estado.entradas.saltosSolicitados[rol] = false;
  }
}
