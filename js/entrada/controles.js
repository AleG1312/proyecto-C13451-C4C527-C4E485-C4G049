// Teclas acordadas para que ambos jugadores puedan actuar al mismo tiempo.
export const CONTROLES = Object.freeze({
  corredor: Object.freeze({
    izquierda: "KeyA",
    derecha: "KeyD",
    salto: "KeyW",
    descenso: "KeyS",
    dash: "ShiftLeft",
  }),
  atrapador: Object.freeze({
    izquierda: "ArrowLeft",
    derecha: "ArrowRight",
    salto: "ArrowUp",
    descenso: "ArrowDown",
    disparo: "boton-principal-raton",
  }),
  pausa: "Escape",
});

// Teclas cuyo comportamiento normal interferiría con la partida.
const TECLAS_DEL_JUEGO = new Set([
  ...Object.values(CONTROLES.corredor),
  ...Object.values(CONTROLES.atrapador),
  CONTROLES.pausa,
]);

/**
 * Registra los controles de teclado y ratón mediante eventos.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {HTMLCanvasElement} canvas
 * @param {() => void} alternarPausa
 */
export function registrarControles(estado, canvas, alternarPausa) {
  window.addEventListener("keydown", (evento) => {
    if (TECLAS_DEL_JUEGO.has(evento.code)) {
      evento.preventDefault();
    }

    if (evento.code === CONTROLES.pausa && !evento.repeat) {
      alternarPausa();
      return;
    }

    // Cada pulsación genera un solo intento de salto.
    if (!evento.repeat && estado.fase === "jugando") {
      if (evento.code === CONTROLES.corredor.salto) {
        estado.entradas.saltosSolicitados.corredor = true;
      } else if (evento.code === CONTROLES.atrapador.salto) {
        estado.entradas.saltosSolicitados.atrapador = true;
      }
    }

    if (estado.fase === "jugando") {
      estado.entradas.teclasPresionadas.add(evento.code);
    }
  });

  window.addEventListener("keyup", (evento) => {
    estado.entradas.teclasPresionadas.delete(evento.code);
  });

  // Evita que una tecla quede activa si la ventana pierde el foco.
  window.addEventListener("blur", () => {
    estado.entradas.teclasPresionadas.clear();
    estado.entradas.saltosSolicitados.corredor = false;
    estado.entradas.saltosSolicitados.atrapador = false;
  });

  canvas.addEventListener("pointermove", (evento) => {
    const limites = canvas.getBoundingClientRect();
    estado.entradas.puntero.x =
      ((evento.clientX - limites.left) * canvas.width) / limites.width;
    estado.entradas.puntero.y =
      ((evento.clientY - limites.top) * canvas.height) / limites.height;
  });

  canvas.addEventListener("pointerdown", (evento) => {
    if (evento.button === 0 && estado.fase === "jugando") {
      estado.entradas.disparoSolicitado = true;
    }
  });
}
