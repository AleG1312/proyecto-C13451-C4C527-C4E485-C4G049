import { dibujarHabilidades } from "./dibujarHabilidades.js";
import { crearPaletaMapa, dibujarMapa } from "./dibujarMapa.js";
import { dibujarEfectos } from "./efectos.js";

/**
 * Carga una imagen antes de intentar dibujarla.
 * @param {string} ruta
 * @returns {Promise<HTMLImageElement>}
 */
function cargarImagen(ruta) {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.addEventListener("load", () => resolver(imagen), { once: true });
    imagen.addEventListener("error", rechazar, { once: true });
    imagen.src = ruta;
  });
}

/**
 * Prepara una función que dibuja el mapa y los personajes según el estado.
 * @param {HTMLCanvasElement} canvas
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 */
export async function crearRenderizadorPartida(canvas, estado) {
  const contexto = canvas.getContext("2d");

  if (contexto === null) {
    throw new Error("No se pudo preparar el canvas del juego.");
  }

  const imagenes = {
    corredor: await cargarImagen(estado.jugadores.corredor.apariencia.imagen),
    atrapador: await cargarImagen(estado.jugadores.atrapador.apariencia.imagen),
  };
  const paletaMapa = crearPaletaMapa();

  return function renderizarPartida() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    dibujarMapa(contexto, estado.mapa, paletaMapa);

    Object.entries(estado.jugadores).forEach(([rol, jugador]) => {
      contexto.drawImage(
        imagenes[rol],
        jugador.posicion.x,
        jugador.posicion.y,
        jugador.ancho,
        jugador.alto,
      );
    });

    dibujarHabilidades(contexto, estado);
    dibujarEfectos(contexto, estado);
  };
}
