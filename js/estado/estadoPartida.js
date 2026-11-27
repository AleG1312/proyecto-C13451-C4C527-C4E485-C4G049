/** @typedef {import("./tipos.js").EstadoPartida} EstadoPartida */

/**
 * Estado compartido de la partida.
 * Todos los módulos deben consultar o actualizar esta única fuente de verdad.
 * @type {EstadoPartida}
 */
export const estadoPartida = {
  // Fase que determina qué acciones están permitidas.
  fase: "preparacion",

  // Datos físicos, efectos y habilidades de ambos jugadores.
  jugadores: {
    corredor: {
      id: "jugador-1",
      nombre: "Chonetico",
      rol: "corredor",
      posicionInicial: { x: 80, y: 480 },
      posicion: { x: 80, y: 480 },
      velocidad: { x: 0, y: 0 },
      ancho: 40,
      alto: 60,
      apariencia: { imagen: "assets/creeper-azul.jpg" },
      estaEnSuelo: true,
      ralentizadoHastaMs: 0,
      habilidades: {
        dash: {
          recargaMs: 3000,
          disponibleDesdeMs: 0,
        },
      },
    },
    atrapador: {
      id: "jugador-2",
      nombre: "Filibustero",
      rol: "atrapador",
      posicionInicial: { x: 840, y: 480 },
      posicion: { x: 840, y: 480 },
      velocidad: { x: 0, y: 0 },
      ancho: 40,
      alto: 60,
      apariencia: { imagen: "assets/creeper-verde.jpg" },
      estaEnSuelo: true,
      ralentizadoHastaMs: 0,
      habilidades: {
        disparo: {
          recargaMs: 2000,
          disponibleDesdeMs: 0,
        },
      },
    },
  },

  // Dimensiones y elementos físicos del escenario.
  mapa: {
    ancho: 960,
    alto: 540,
    paredes: [],
    plataformas: [],
    puertas: [],
  },

  // Valores temporales de la ronda actual, expresados en milisegundos.
  tiempo: {
    duracionRondaMs: 60000,
    restanteMs: 60000,
    transcurridoMs: 0,
  },

  // Progreso y resultado de la ronda actual.
  ronda: {
    actual: 1,
    total: 3,
    ganador: null,
    motivoFinal: null,
  },

  // Cantidad de rondas ganadas por cada rol.
  puntajes: {
    corredor: 0,
    atrapador: 0,
  },

  // Identificador del ganador cuando termina la partida.
  ganadorPartida: null,

  // Mensaje que la interfaz muestra como respuesta a una acción.
  realimentacion: {
    tipo: null,
    mensaje: "",
  },

  // Entradas activas que las mecánicas consultarán en cada actualización.
  entradas: {
    teclasPresionadas: new Set(),
    saltosSolicitados: {
      corredor: false,
      atrapador: false,
    },
    puntero: { x: 0, y: 0 },
    disparoSolicitado: false,
  },
};
