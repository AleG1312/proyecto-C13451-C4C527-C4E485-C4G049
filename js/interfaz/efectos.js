import { reproducirSonido } from "./sonidos.js";

/** @typedef {import("../estado/tipos.js").EstadoPartida} EstadoPartida */
/** @typedef {import("../estado/tipos.js").Jugador} Jugador */
/** @typedef {import("../estado/tipos.js").TipoEvento} TipoEvento */
/** @typedef {import("../estado/tipos.js").EventoRealimentacion} EventoRealimentacion */

/**
 * Animaciones de un evento, además de su sonido.
 * @typedef {Object} Efecto
 * @property {"estela"|"onda"|"destello"} [forma] - Animación en el canvas.
 * @property {"corredor"|"atrapador"} [rol] - Jugador sobre el que se dibuja.
 * @property {string} [barra] - Selector de la barra de recarga que se sacude.
 */

const DURACION_EFECTO_MS = 350;
const COLOR_EFECTO = "#fff";
const GROSOR_LINEA_PX = 3;
const CRECIMIENTO_ONDA = 0.8;
const OPACIDAD_DESTELLO = 0.7;
const COPIAS_ESTELA = 5;
const OPACIDAD_ESTELA = 0.5;
const CLASE_SACUDIDA = "jugador__barra--sacudida";

// Los errores no se dibujan en el canvas: suenan y sacuden su barra.
/** @type {Record<TipoEvento, Efecto>} */
const EFECTOS = {
  "dash": { forma: "estela", rol: "corredor" },
  "dash-recarga": { barra: "#dash-j1" },
  "dash-sin-direccion": { barra: "#dash-j1" },
  "dash-bloqueado": { barra: "#dash-j1" },
  "disparo-recarga": { barra: "#arma-j2" },
  "disparo-acierto": { forma: "destello", rol: "corredor" },
  "disparo-fallo": {},
  "puerta-cerrada": { forma: "onda", rol: "corredor" },
};

const preferenciaMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

// Id del último evento ya sonado. No es estado del juego: solo evita que la
// interfaz repita el sonido de un evento en cada cuadro.
let ultimoIdAtendido = 0;

/**
 * Sacude la barra de recarga para señalar que la habilidad no está lista.
 * @param {string} selector
 */
function sacudirBarra(selector) {
  const barra = document.querySelector(selector)?.closest(".jugador__barra");

  if (!(barra instanceof HTMLElement)) {
    return;
  }

  barra.classList.remove(CLASE_SACUDIDA);
  // Leer el tamaño obliga al navegador a reiniciar la animación.
  void barra.offsetWidth;
  barra.classList.add(CLASE_SACUDIDA);
}

/**
 * Reproduce el sonido y la animación de tarjeta de cada evento nuevo.
 * @param {EstadoPartida} estado
 */
export function atenderEventosNuevos(estado) {
  const { eventos, ultimoId } = estado.realimentacion;

  // Una ronda nueva reinicia los ids desde cero.
  if (ultimoId < ultimoIdAtendido) {
    ultimoIdAtendido = 0;
  }

  eventos
    .filter((evento) => evento.id > ultimoIdAtendido)
    .forEach((evento) => {
      reproducirSonido(evento.tipo);
      const barra = EFECTOS[evento.tipo].barra;

      if (barra !== undefined) {
        sacudirBarra(barra);
      }
    });

  ultimoIdAtendido = ultimoId;
}

/**
 * Copias translúcidas del corredor entre el punto de partida y el de
 * llegada del dash, que se desvanecen como una estela.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Jugador} jugador
 * @param {number} progreso - De 0 a 1.
 * @param {EventoRealimentacion} evento
 */
function dibujarEstela(contexto, jugador, progreso, evento) {
  if (evento.origen === undefined) {
    return;
  }

  const { origen } = evento;
  const destino = jugador.posicion;

  // La copia más cercana al corredor es la más visible.
  for (let copia = 0; copia < COPIAS_ESTELA; copia += 1) {
    const avance = copia / COPIAS_ESTELA;
    contexto.globalAlpha =
      OPACIDAD_ESTELA * (1 - progreso) * ((copia + 1) / COPIAS_ESTELA);
    contexto.fillRect(
      origen.x + (destino.x - origen.x) * avance,
      origen.y + (destino.y - origen.y) * avance,
      jugador.ancho,
      jugador.alto,
    );
  }
}

/**
 * Onda que se expande y desvanece alrededor del jugador.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Jugador} jugador
 * @param {number} progreso - De 0 a 1.
 */
function dibujarOnda(contexto, jugador, progreso) {
  const radio = Math.max(jugador.ancho, jugador.alto) / 2;
  const crecimiento = preferenciaMovimiento.matches
    ? 0
    : CRECIMIENTO_ONDA * progreso;

  contexto.globalAlpha = 1 - progreso;
  contexto.beginPath();
  contexto.arc(
    jugador.posicion.x + jugador.ancho / 2,
    jugador.posicion.y + jugador.alto / 2,
    radio * (1 + crecimiento),
    0,
    Math.PI * 2,
  );
  contexto.stroke();
}

/**
 * Destello sobre el jugador: indica que recibió un impacto.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Jugador} jugador
 * @param {number} progreso - De 0 a 1.
 */
function dibujarDestello(contexto, jugador, progreso) {
  contexto.globalAlpha = OPACIDAD_DESTELLO * (1 - progreso);
  contexto.fillRect(
    jugador.posicion.x,
    jugador.posicion.y,
    jugador.ancho,
    jugador.alto,
  );
}

const DIBUJOS = {
  estela: dibujarEstela,
  onda: dibujarOnda,
  destello: dibujarDestello,
};

/**
 * Dibuja un evento según cuánto tiempo ha pasado desde que ocurrió.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 * @param {EventoRealimentacion} evento
 */
function dibujarEvento(contexto, estado, evento) {
  const { forma, rol } = EFECTOS[evento.tipo];
  const edadMs = estado.tiempo.transcurridoMs - evento.instanteMs;

  if (forma === undefined || rol === undefined ||
      edadMs < 0 || edadMs > DURACION_EFECTO_MS) {
    return;
  }

  contexto.save();
  contexto.strokeStyle = COLOR_EFECTO;
  contexto.fillStyle = COLOR_EFECTO;
  contexto.lineWidth = GROSOR_LINEA_PX;
  DIBUJOS[forma](
    contexto,
    estado.jugadores[rol],
    edadMs / DURACION_EFECTO_MS,
    evento,
  );
  contexto.restore();
}

/**
 * Dibuja en el canvas las animaciones de los eventos recientes.
 * @param {CanvasRenderingContext2D} contexto
 * @param {EstadoPartida} estado
 */
export function dibujarEfectos(contexto, estado) {
  estado.realimentacion.eventos.forEach((evento) => {
    dibujarEvento(contexto, estado, evento);
  });
}
