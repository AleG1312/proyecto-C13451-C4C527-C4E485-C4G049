/** @typedef {import("../estado/tipos.js").TipoEvento} TipoEvento */

/**
 * Un sonido sintetizado; las frecuencias van en Hz y los tiempos en segundos.
 * Con forma "ruido" suena un soplido filtrado (golpes, impactos) y la
 * frecuencia indica la zona del filtro en lugar de una nota.
 * @typedef {Object} Nota
 * @property {number} frecuencia - Frecuencia al empezar.
 * @property {number} [frecuenciaFinal] - Frecuencia al terminar (barrido).
 * @property {number} [inicio] - Retraso desde que se pide el sonido.
 * @property {number} [duracion] - Cuánto suena.
 * @property {OscillatorType|"ruido"} [forma] - Timbre.
 * @property {number} [intensidad] - Multiplica el volumen general.
 */

// Volumen general: bajo para no tapar la partida.
const VOLUMEN = 0.15;
const DURACION_PREDETERMINADA_S = 0.12;
const VOLUMEN_MINIMO = 0.0001;
const ATAQUE_S = 0.01;
const DURACION_RUIDO_S = 1;

// Todos los errores comparten un "bzz" grave de dos golpes.
/** @type {Nota[]} */
const SONIDO_ERROR = [
  { frecuencia: 196, duracion: 0.08, forma: "square" },
  { frecuencia: 147, inicio: 0.1, duracion: 0.12, forma: "square" },
];

// El disparo suena igual al salir; lo que cambia es si acierta o falla.
/** @type {Nota} */
const SONIDO_BALA = {
  frecuencia: 1400,
  frecuenciaFinal: 300,
  duracion: 0.08,
  forma: "sawtooth",
};

/** @type {Record<TipoEvento, Nota[]>} */
const SONIDOS = {
  "dash": [
    { frecuencia: 900, frecuenciaFinal: 220, duracion: 0.15, forma: "triangle" },
  ],
  "dash-recarga": SONIDO_ERROR,
  "dash-sin-direccion": SONIDO_ERROR,
  "dash-bloqueado": SONIDO_ERROR,
  "disparo-recarga": SONIDO_ERROR,
  // Impacto en tres partes: el golpe seco de la bala, un retumbe grave y
  // un tono que se "desinfla", como si el corredor perdiera velocidad.
  "disparo-acierto": [
    SONIDO_BALA,
    {
      frecuencia: 2500,
      frecuenciaFinal: 400,
      inicio: 0.06,
      duracion: 0.14,
      forma: "ruido",
      intensidad: 2.5,
    },
    {
      frecuencia: 160,
      frecuenciaFinal: 45,
      inicio: 0.06,
      duracion: 0.22,
      forma: "sine",
      intensidad: 2,
    },
    {
      frecuencia: 520,
      frecuenciaFinal: 110,
      inicio: 0.2,
      duracion: 0.55,
      forma: "triangle",
    },
  ],
  "disparo-fallo": [
    SONIDO_BALA,
    {
      frecuencia: 180,
      frecuenciaFinal: 110,
      inicio: 0.08,
      duracion: 0.2,
      forma: "square",
    },
  ],
  "puerta-cerrada": [
    { frecuencia: 220, duracion: 0.1, forma: "square" },
    { frecuencia: 165, inicio: 0.1, duracion: 0.18, forma: "square" },
  ],
};

/** @type {AudioContext|null} */
let contextoAudio = null;

/** @type {AudioBuffer|null} */
let bufferRuido = null;

/**
 * Crea el contexto de audio; solo se llama tras un gesto del usuario.
 * @returns {AudioContext}
 */
function obtenerContexto() {
  if (contextoAudio === null) {
    contextoAudio = new AudioContext();
  }

  return contextoAudio;
}

/**
 * Genera una sola vez un segundo de ruido blanco para reutilizarlo.
 * @param {AudioContext} contexto
 * @returns {AudioBuffer}
 */
function obtenerBufferRuido(contexto) {
  if (bufferRuido === null) {
    const muestras = contexto.sampleRate * DURACION_RUIDO_S;
    bufferRuido = contexto.createBuffer(1, muestras, contexto.sampleRate);
    const datos = bufferRuido.getChannelData(0);

    for (let indice = 0; indice < muestras; indice += 1) {
      datos[indice] = Math.random() * 2 - 1;
    }
  }

  return bufferRuido;
}

/**
 * Aplica la frecuencia inicial y, si la hay, el barrido hasta la final.
 * @param {AudioParam} parametro
 * @param {Nota} nota
 * @param {number} inicio
 * @param {number} fin
 */
function programarFrecuencia(parametro, nota, inicio, fin) {
  parametro.setValueAtTime(nota.frecuencia, inicio);

  if (nota.frecuenciaFinal !== undefined) {
    parametro.exponentialRampToValueAtTime(nota.frecuenciaFinal, fin);
  }
}

/**
 * Crea la fuente de una nota: ruido filtrado o un oscilador.
 * @param {AudioContext} contexto
 * @param {Nota} nota
 * @param {number} inicio
 * @param {number} fin
 * @returns {{fuente: AudioScheduledSourceNode, salida: AudioNode}}
 */
function crearFuente(contexto, nota, inicio, fin) {
  if (nota.forma === "ruido") {
    const fuente = contexto.createBufferSource();
    const filtro = contexto.createBiquadFilter();
    fuente.buffer = obtenerBufferRuido(contexto);
    filtro.type = "bandpass";
    programarFrecuencia(filtro.frequency, nota, inicio, fin);
    return { fuente, salida: fuente.connect(filtro) };
  }

  const oscilador = contexto.createOscillator();
  oscilador.type = nota.forma ?? "sine";
  programarFrecuencia(oscilador.frequency, nota, inicio, fin);
  return { fuente: oscilador, salida: oscilador };
}

/**
 * Programa una nota con subida y caída suaves para que no chasquee.
 * @param {AudioContext} contexto
 * @param {Nota} nota
 */
function tocarNota(contexto, nota) {
  const inicio = contexto.currentTime + (nota.inicio ?? 0);
  const fin = inicio + (nota.duracion ?? DURACION_PREDETERMINADA_S);
  const { fuente, salida } = crearFuente(contexto, nota, inicio, fin);
  const volumen = contexto.createGain();
  const volumenNota = VOLUMEN * (nota.intensidad ?? 1);

  volumen.gain.setValueAtTime(VOLUMEN_MINIMO, inicio);
  volumen.gain.exponentialRampToValueAtTime(volumenNota, inicio + ATAQUE_S);
  volumen.gain.exponentialRampToValueAtTime(VOLUMEN_MINIMO, fin);

  salida.connect(volumen).connect(contexto.destination);
  fuente.start(inicio);
  fuente.stop(fin);
}

/**
 * Reproduce el sonido de un evento. Si el navegador todavía no permite
 * audio (nadie ha tocado una tecla), se omite en vez de sonar tarde.
 * @param {TipoEvento} tipo
 */
export function reproducirSonido(tipo) {
  if (contextoAudio === null || contextoAudio.state !== "running") {
    return;
  }

  SONIDOS[tipo].forEach((nota) => tocarNota(contextoAudio, nota));
}

/**
 * Habilita el audio con la primera tecla o clic, como exigen los
 * navegadores antes de reproducir sonido.
 */
export function prepararSonidos() {
  const activar = () => {
    obtenerContexto().resume();
  };

  window.addEventListener("keydown", activar, { once: true });
  window.addEventListener("pointerdown", activar, { once: true });
}
