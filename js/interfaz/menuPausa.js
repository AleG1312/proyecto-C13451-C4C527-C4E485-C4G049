/**
 * Configura el modal y devuelve la acción usada por la tecla Escape.
 * @param {import("../estado/tipos.js").EstadoPartida} estado
 * @param {() => void} finalizarPartida
 */
export function configurarMenuPausa(estado, finalizarPartida) {
  const modal = document.querySelector("#modal-pausa");
  const opciones = Array.from(
    document.querySelectorAll(".modal-pausa__opcion"),
  );
  let opcionActiva = 0;

  if (!(modal instanceof HTMLDialogElement) || opciones.length !== 3 ||
      opciones.some((opcion) => !(opcion instanceof HTMLButtonElement))) {
    throw new Error("No se encontraron los controles del menú de pausa.");
  }

  /** Detiene las entradas activas de ambos jugadores. */
  function limpiarEntradas() {
    estado.entradas.teclasPresionadas.clear();
    estado.entradas.saltosSolicitados.corredor = false;
    estado.entradas.saltosSolicitados.atrapador = false;
    estado.entradas.disparoSolicitado = false;
  }

  /** Abre el modal solo durante una ronda activa. */
  function pausar() {
    if (estado.fase !== "jugando") {
      return;
    }

    estado.fase = "pausado";
    limpiarEntradas();
    opcionActiva = 0;
    modal.showModal();
    opciones[opcionActiva].focus();
  }

  /** Cierra el modal y continúa la ronda. */
  function reanudar() {
    if (estado.fase !== "pausado") {
      return;
    }

    estado.fase = "jugando";
    modal.close();
  }

  /** Cambia entre pausa y juego activo. */
  function alternar() {
    if (estado.fase === "jugando") {
      pausar();
    } else if (estado.fase === "pausado") {
      reanudar();
    }
  }

  opciones.forEach((opcion) => {
    opcion.addEventListener("click", () => {
      const accion = opcion.dataset.accion;

      if (accion === "reanudar") {
        reanudar();
      } else if (accion === "menu") {
        window.location.assign("index.html");
      } else if (accion === "finalizar") {
        finalizarPartida();
      }
    });
  });

  window.addEventListener("keydown", (evento) => {
    if (estado.fase !== "pausado") {
      return;
    }

    if (evento.code === "ArrowDown" || evento.code === "ArrowUp") {
      evento.preventDefault();
      const cambio = evento.code === "ArrowDown" ? 1 : -1;
      opcionActiva = (opcionActiva + cambio + opciones.length) % opciones.length;
      opciones[opcionActiva].focus();
    } else if (evento.code === "Enter") {
      evento.preventDefault();
      opciones[opcionActiva].click();
    }
  });

  // Impide que el navegador cierre el modal sin reanudar el estado.
  modal.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    reanudar();
  });

  return { alternar };
}
