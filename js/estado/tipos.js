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
 * @property {Vector} posicionInicial - Punto donde comienza cada ronda.
 * @property {Vector} posicion - Ubicación actual.
 * @property {Vector} velocidad - Movimiento actual.
 * @property {number} ancho - Ancho de la zona de colisión.
 * @property {number} alto - Alto de la zona de colisión.
 * @property {{imagen: string}} apariencia - Recurso visual del personaje.
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
 * Acción de un jugador que merece sonido y animación.
 * Los terminados en "-recarga", "-sin-direccion" y "-bloqueado" son errores.
 * @typedef {"dash"|"dash-recarga"|"dash-sin-direccion"|
 *   "dash-bloqueado"|"disparo-acierto"|"disparo-fallo"|"disparo-recarga"|
 *   "puerta-cerrada"} TipoEvento
 */

/**
 * Algo que ocurrió en la ronda y que la interfaz debe hacer notar.
 * @typedef {Object} EventoRealimentacion
 * @property {number} id - Número creciente para no repetir un efecto.
 * @property {TipoEvento} tipo - Qué ocurrió.
 * @property {number} instanteMs - Momento de la ronda en que ocurrió.
 * @property {Vector} [origen] - Dónde empezó el movimiento (solo en el dash).
 */

/**
 * Eventos recientes de éxito o error para los jugadores.
 * @typedef {Object} Realimentacion
 * @property {EventoRealimentacion[]} eventos - Eventos del último segundo.
 * @property {number} ultimoId - Id del evento más reciente.
 */

/**
 * Estado completo y única fuente de verdad de la partida.
 * @typedef {Object} EstadoPartida
 * @property {"preparacion"|"jugando"|"pausado"|"fin-ronda"|"fin-partida"} fase
 * @property {{corredor: Jugador, atrapador: Jugador}} jugadores
 * @property {Mapa} mapa
 * @property {{duracionRondaMs: number, restanteMs: number, transcurridoMs: number}} tiempo
 * @property {{actual: number, total: number, ganador: "corredor"|"atrapador"|null, motivoFinal: "captura"|"tiempo-agotado"|null}} ronda
 * @property {{corredor: number, atrapador: number}} puntajes
 * @property {"corredor"|"atrapador"|null} ganadorPartida
 * @property {boolean} finalizacionManual - Indica si se terminó desde la pausa.
 * @property {Realimentacion} realimentacion
 * @property {{teclasPresionadas: Set<string>, saltosSolicitados: {corredor: boolean, atrapador: boolean}, puntero: Vector, disparoSolicitado: boolean}} entradas
 */

// Este archivo solo documenta tipos y no ejecuta comportamiento.
export {};
