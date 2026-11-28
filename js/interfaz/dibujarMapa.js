/** @typedef {import("../estado/tipos.js").Mapa} Mapa */
/** @typedef {import("../estado/tipos.js").Rectangulo} Rectangulo */

/**
 * Colores del escenario, tomados de la paleta del sitio.
 * @typedef {Object} PaletaMapa
 * @property {string} cielo - Parte superior del fondo.
 * @property {string} horizonte - Parte inferior del fondo.
 * @property {string} suelo - Línea del borde inferior, donde se apoyan los pies.
 * @property {string} pared - Relleno de las paredes.
 * @property {string} bordePared - Contorno de las paredes.
 * @property {string} plataforma - Relleno de las plataformas.
 * @property {string} bordePlataforma - Borde superior de las plataformas.
 */

// Valores de respaldo si una variable CSS no está definida.
const PALETA_RESPALDO = Object.freeze({
  cielo: "#07152f",
  horizonte: "#0d1f42",
  suelo: "#fff",
  pared: "#164ca8",
  bordePared: "#fff",
  plataforma: "#d71920",
  bordePlataforma: "#fff",
});

const GROSOR_SUELO_PX = 4;
const GROSOR_BORDE_PX = 2;
const GROSOR_BORDE_PLATAFORMA_PX = 3;
const TAMANO_BLOQUE_PX = 30;

/**
 * Lee una variable CSS de la raíz del documento.
 * @param {CSSStyleDeclaration} estilos
 * @param {string} variable
 * @param {string} respaldo
 * @returns {string}
 */
function leerVariable(estilos, variable, respaldo) {
  const valor = estilos.getPropertyValue(variable).trim();
  return valor === "" ? respaldo : valor;
}

/**
 * Arma la paleta del mapa con las variables de common.css, para que el
 * canvas use los mismos colores que el resto de la página.
 * @returns {PaletaMapa}
 */
export function crearPaletaMapa() {
  const estilos = getComputedStyle(document.documentElement);
  const fondo = leerVariable(estilos, "--color-fondo", PALETA_RESPALDO.cielo);
  const superficie = leerVariable(
    estilos,
    "--color-superficie",
    PALETA_RESPALDO.horizonte,
  );
  const texto = leerVariable(estilos, "--color-texto", PALETA_RESPALDO.suelo);

  return {
    cielo: fondo,
    horizonte: superficie,
    suelo: texto,
    pared: leerVariable(estilos, "--color-secundario", PALETA_RESPALDO.pared),
    bordePared: texto,
    plataforma: leerVariable(
      estilos,
      "--color-primario",
      PALETA_RESPALDO.plataforma,
    ),
    bordePlataforma: texto,
  };
}

/**
 * Pinta el fondo degradado y la línea del suelo.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Mapa} mapa
 * @param {PaletaMapa} paleta
 */
function dibujarFondo(contexto, mapa, paleta) {
  const degradado = contexto.createLinearGradient(0, 0, 0, mapa.alto);
  degradado.addColorStop(0, paleta.cielo);
  degradado.addColorStop(1, paleta.horizonte);

  contexto.fillStyle = degradado;
  contexto.fillRect(0, 0, mapa.ancho, mapa.alto);

  contexto.fillStyle = paleta.suelo;
  contexto.fillRect(0, mapa.alto - GROSOR_SUELO_PX, mapa.ancho, GROSOR_SUELO_PX);
}

/**
 * Traza líneas horizontales dentro de una pared para que se lea como
 * bloques apilados y no como un simple rectángulo.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Rectangulo} pared
 */
function dibujarBloques(contexto, pared) {
  contexto.beginPath();

  for (let y = pared.y + TAMANO_BLOQUE_PX; y < pared.y + pared.alto;
    y += TAMANO_BLOQUE_PX) {
    contexto.moveTo(pared.x, y);
    contexto.lineTo(pared.x + pared.ancho, y);
  }

  contexto.stroke();
}

/**
 * Dibuja las paredes como bloques sólidos con contorno.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Rectangulo[]} paredes
 * @param {PaletaMapa} paleta
 */
function dibujarParedes(contexto, paredes, paleta) {
  contexto.fillStyle = paleta.pared;
  contexto.strokeStyle = paleta.bordePared;
  contexto.lineWidth = GROSOR_BORDE_PX;

  paredes.forEach((pared) => {
    contexto.fillRect(pared.x, pared.y, pared.ancho, pared.alto);
    contexto.strokeRect(pared.x, pared.y, pared.ancho, pared.alto);
    dibujarBloques(contexto, pared);
  });
}

/**
 * Dibuja las plataformas con un borde superior marcado, que es la cara
 * sobre la que se puede caminar.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Rectangulo[]} plataformas
 * @param {PaletaMapa} paleta
 */
function dibujarPlataformas(contexto, plataformas, paleta) {
  plataformas.forEach((plataforma) => {
    contexto.fillStyle = paleta.plataforma;
    contexto.fillRect(
      plataforma.x,
      plataforma.y,
      plataforma.ancho,
      plataforma.alto,
    );

    contexto.fillStyle = paleta.bordePlataforma;
    contexto.fillRect(
      plataforma.x,
      plataforma.y,
      plataforma.ancho,
      GROSOR_BORDE_PLATAFORMA_PX,
    );
  });
}

/**
 * Dibuja el escenario a partir del mapa del estado: fondo, paredes y
 * plataformas. Las puertas las dibuja dibujarHabilidades.js.
 * @param {CanvasRenderingContext2D} contexto
 * @param {Mapa} mapa
 * @param {PaletaMapa} paleta
 */
export function dibujarMapa(contexto, mapa, paleta) {
  contexto.save();
  dibujarFondo(contexto, mapa, paleta);
  dibujarParedes(contexto, mapa.paredes, paleta);
  dibujarPlataformas(contexto, mapa.plataformas, paleta);
  contexto.restore();
}
