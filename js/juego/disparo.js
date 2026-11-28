import { obtenerObstaculos, obtenerRectangulo } from "./colisiones.js";
import { estaDisponible, iniciarRecarga, ralentizar } from "./recargas.js";
import { notificar } from "../estado/realimentacion.js";

/** @typedef {import("../estado/tipos.js").Vector} Vector */
/** @typedef {import("../estado/tipos.js").Rectangulo} Rectangulo */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */
/** @typedef {import("../estado/tipos.js").Mapa} Mapa */
/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */

// Duración de la ralentización al acertar y al fallar.
const RALENTIZACION_CORREDOR_MS = 2000;
const RALENTIZACION_ATRAPADOR_MS = 800;

/**
 * Calcula el centro del jugador, usado como origen del disparo.
 * @param {Jugador} jugador
 * @returns {Vector}
 */
function calcularOrigen(jugador) {
  return {
    x: jugador.posicion.x + jugador.ancho / 2,
    y: jugador.posicion.y + jugador.alto / 2,
  };
}

/**
 * Calcula la dirección normalizada desde el origen hacia el puntero.
 * @param {Vector} origen
 * @param {Vector} puntero
 * @returns {Vector|null} Dirección o null si el puntero está en el origen.
 */
function calcularDireccion(origen, puntero) {
  const dx = puntero.x - origen.x;
  const dy = puntero.y - origen.y;
  const largo = Math.hypot(dx, dy);

  if (largo === 0) {
    return null;
  }

  return { x: dx / largo, y: dy / largo };
}

/**
 * Distancia a la que el rayo toca un rectángulo, o null si no lo toca.
 * @param {Vector} origen
 * @param {Vector} direccion
 * @param {Rectangulo} rectangulo
 * @returns {number|null}
 */
function distanciaHastaRectangulo(origen, direccion, rectangulo) {
  let entrada = 0;
  let salida = Infinity;

  for (const [eje, tamano] of [["x", "ancho"], ["y", "alto"]]) {
    const inicio = rectangulo[eje];
    const fin = rectangulo[eje] + rectangulo[tamano];

    if (direccion[eje] === 0) {
      if (origen[eje] < inicio || origen[eje] > fin) {
        return null;
      }
      continue;
    }

    const primerCruce = (inicio - origen[eje]) / direccion[eje];
    const segundoCruce = (fin - origen[eje]) / direccion[eje];
    entrada = Math.max(entrada, Math.min(primerCruce, segundoCruce));
    salida = Math.min(salida, Math.max(primerCruce, segundoCruce));
  }

  return entrada <= salida ? entrada : null;
}

/**
 * Distancia al obstáculo más cercano; si no hay, la diagonal del mapa.
 * @param {Vector} origen
 * @param {Vector} direccion
 * @param {Mapa} mapa
 * @returns {number}
 */
function distanciaHastaPared(origen, direccion, mapa) {
  const distancias = obtenerObstaculos(mapa)
    .map((obstaculo) => distanciaHastaRectangulo(origen, direccion, obstaculo))
    .filter((distancia) => distancia !== null);

  return Math.min(Math.hypot(mapa.ancho, mapa.alto), ...distancias);
}

/**
 * Resuelve un disparo solicitado y aplica la ralentización correspondiente.
 * @param {EstadoPartida} estado
 * @param {number} ahoraMs
 */
export function actualizarDisparo(estado, ahoraMs) {
  if (!estado.entradas.disparoSolicitado) {
    return;
  }

  estado.entradas.disparoSolicitado = false;

  const { atrapador, corredor } = estado.jugadores;
  const habilidadDisparo = atrapador.habilidades.disparo;
  const origen = calcularOrigen(atrapador);
  const direccion = calcularDireccion(origen, estado.entradas.puntero);

  if (!estaDisponible(habilidadDisparo, ahoraMs)) {
    notificar(estado, "disparo-recarga");
    return;
  }

  if (direccion === null) {
    return;
  }

  const alcance = distanciaHastaPared(origen, direccion, estado.mapa);
  const impacto = distanciaHastaRectangulo(
    origen,
    direccion,
    obtenerRectangulo(corredor),
  );
  const acerto = impacto !== null && impacto < alcance;

  if (acerto) {
    ralentizar(corredor, ahoraMs, RALENTIZACION_CORREDOR_MS);
    notificar(estado, "disparo-acierto");
  } else {
    ralentizar(atrapador, ahoraMs, RALENTIZACION_ATRAPADOR_MS);
    notificar(estado, "disparo-fallo");
  }

  const distanciaFinal = acerto ? impacto : alcance;
  estado.ultimoDisparo = {
    origen,
    acerto,
    instanteMs: ahoraMs,
    destino: {
      x: origen.x + direccion.x * distanciaFinal,
      y: origen.y + direccion.y * distanciaFinal,
    },
  };

  iniciarRecarga(habilidadDisparo, ahoraMs);
}
