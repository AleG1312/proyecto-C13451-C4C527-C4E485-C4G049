/**
 * Indica si las zonas de ambos jugadores están en contacto.
 * @param {import("../estado/tipos.js").Jugador} primero
 * @param {import("../estado/tipos.js").Jugador} segundo
 * @returns {boolean}
 */
function estanEnContacto(primero, segundo) {
  return primero.posicion.x < segundo.posicion.x + segundo.ancho &&
    primero.posicion.x + primero.ancho > segundo.posicion.x &&
    primero.posicion.y < segundo.posicion.y + segundo.alto &&
    primero.posicion.y + primero.alto > segundo.posicion.y;
}

/**
 * Cierra la ronda, suma el punto y establece la fase siguiente.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {"corredor"|"atrapador"} ganador
 * @param {"captura"|"tiempo-agotado"} motivo
 */
function finalizarRonda(estado, ganador, motivo) {
  estado.ronda.ganador = ganador;
  estado.ronda.motivoFinal = motivo;
  estado.puntajes[ganador] += 1;

  if (estado.ronda.actual >= estado.ronda.total) {
    estado.ganadorPartida = estado.puntajes.corredor >
      estado.puntajes.atrapador ? "corredor" : "atrapador";
    estado.fase = "fin-partida";
  } else {
    estado.fase = "fin-ronda";
  }
}

/**
 * Comprueba las dos condiciones que terminan una ronda.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @returns {"fin-ronda"|"fin-partida"|null}
 */
export function evaluarFinDeRonda(estado) {
  if (estado.fase !== "jugando") {
    return null;
  }

  // Al agotarse el tiempo, el corredor ya logró escapar.
  if (estado.tiempo.restanteMs <= 0) {
    finalizarRonda(estado, "corredor", "tiempo-agotado");
    return estado.fase;
  }

  if (estanEnContacto(estado.jugadores.corredor, estado.jugadores.atrapador)) {
    finalizarRonda(estado, "atrapador", "captura");
    return estado.fase;
  }

  return null;
}

/**
 * Restablece los datos temporales antes de comenzar otra ronda.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 */
export function prepararSiguienteRonda(estado) {
  estado.ronda.actual += 1;
  estado.ronda.ganador = null;
  estado.ronda.motivoFinal = null;
  estado.tiempo.restanteMs = estado.tiempo.duracionRondaMs;
  estado.tiempo.transcurridoMs = 0;
  estado.ganadorPartida = null;

  Object.values(estado.jugadores).forEach((jugador) => {
    jugador.posicion = { ...jugador.posicionInicial };
    jugador.velocidad = { x: 0, y: 0 };
    jugador.ralentizadoHastaMs = 0;
    jugador.estaEnSuelo = true;

    Object.values(jugador.habilidades).forEach((habilidad) => {
      habilidad.disponibleDesdeMs = 0;
    });
  });

  estado.entradas.teclasPresionadas.clear();
  estado.entradas.saltosSolicitados.corredor = false;
  estado.entradas.saltosSolicitados.atrapador = false;
  estado.entradas.disparoSolicitado = false;
  estado.fase = "preparacion";
}
