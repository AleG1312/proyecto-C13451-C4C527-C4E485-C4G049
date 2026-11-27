/**
 * Posición o desplazamiento dentro del área de juego.
 * @typedef {Object} Vector
 * @property {number} x - Valor horizontal en píxeles.
 * @property {number} y - Valor vertical en píxeles.
 */

/**
 * Rectángulo usado para los elementos físicos del mapa.
 * @typedef {Object} Rectangulo
 * @property {number} x - Posición horizontal en píxeles.
 * @property {number} y - Posición vertical en píxeles.
 * @property {number} ancho - Ancho en píxeles.
 * @property {number} alto - Alto en píxeles.
 */

/**
 * Estado de recarga de una habilidad.
 * @typedef {Object} Habilidad
 * @property {number} recargaMs - Tiempo total de recarga.
 * @property {number} disponibleDesdeMs - Momento en que puede volver a usarse.
 */

/**
 * Datos necesarios para representar y actualizar un jugador.
 * @typedef {Object} Jugador
 * @property {string} id - Identificador único.
 * @property {string} nombre - Nombre mostrado en la interfaz.
 * @property {"corredor"|"atrapador"} rol - Función dentro de la ronda.
 * @property {Vector} posicion - Ubicación actual.
 * @property {Vector} velocidad - Movimiento actual.
 * @property {number} ancho - Ancho de la zona de colisión.
 * @property {number} alto - Alto de la zona de colisión.
 * @property {boolean} estaEnSuelo - Indica si puede saltar.
 * @property {number} ralentizadoHastaMs - Fin del efecto de ralentización.
 * @property {Object.<string, Habilidad>} habilidades - Habilidades disponibles.
 */

/**
 * Puerta que puede bloquear temporalmente el paso.
 * @typedef {Rectangulo & {
 *   id: string,
 *   abierta: boolean,
 *   cierraEnMs: number|null,
 *   abreEnMs: number|null
 * }} Puerta
 */

/**
 * Elementos que forman el escenario jugable.
 * @typedef {Object} Mapa
 * @property {number} ancho - Ancho total en píxeles.
 * @property {number} alto - Alto total en píxeles.
 * @property {Rectangulo[]} paredes - Obstáculos sólidos.
 * @property {Rectangulo[]} plataformas - Superficies transitables.
 * @property {Puerta[]} puertas - Pasos que pueden abrirse o cerrarse.
 */

/**
 * Estado completo y única fuente de verdad de la partida.
 * @typedef {Object} EstadoPartida
 * @property {"preparacion"|"jugando"|"pausado"|"fin-ronda"|"fin-partida"} fase
 * @property {{corredor: Jugador, atrapador: Jugador}} jugadores
 * @property {Mapa} mapa
 * @property {{duracionRondaMs: number, restanteMs: number, transcurridoMs: number}} tiempo
 * @property {{actual: number, total: number, ganador: string|null, motivoFinal: string|null}} ronda
 * @property {{corredor: number, atrapador: number}} puntajes
 * @property {string|null} ganadorPartida
 * @property {{tipo: "exito"|"error"|"informacion"|null, mensaje: string}} realimentacion
 */

// Este archivo solo documenta tipos y no ejecuta comportamiento.
export {};
