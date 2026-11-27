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
 * Cambia entre juego activo y pausa.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 */
function alternarPausa(estado) {
  if (estado.fase === "jugando") {
    estado.fase = "pausado";
  } else if (estado.fase === "pausado") {
    estado.fase = "jugando";
  }
}

/**
 * Registra los controles de teclado y ratón mediante eventos.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {HTMLCanvasElement} canvas
 */
export function registrarControles(estado, canvas) {
  window.addEventListener("keydown", (evento) => {
    if (TECLAS_DEL_JUEGO.has(evento.code)) {
      evento.preventDefault();
    }

    if (evento.code === CONTROLES.pausa && !evento.repeat) {
      alternarPausa(estado);
      return;
    }

    estado.entradas.teclasPresionadas.add(evento.code);
  });

  window.addEventListener("keyup", (evento) => {
    estado.entradas.teclasPresionadas.delete(evento.code);
  });

  // Evita que una tecla quede activa si la ventana pierde el foco.
  window.addEventListener("blur", () => {
    estado.entradas.teclasPresionadas.clear();
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
