import { estadoPartida } from "./estado/estadoPartida.js";
import {
  eliminarEstadoPartida,
  restaurarEstadoPartida,
} from "./estado/persistencia.js";

const ganadorPartida = document.querySelector("#ganador-partida");
const elementosPuestos = {
  primero: {
    nombre: document.querySelector("#primer-puesto-nombre"),
    imagen: document.querySelector("#primer-puesto-imagen"),
    puntaje: document.querySelector("#primer-puesto-puntaje"),
    lugar: document.querySelector("#primer-puesto-lugar"),
  },
  segundo: {
    nombre: document.querySelector("#segundo-puesto-nombre"),
    imagen: document.querySelector("#segundo-puesto-imagen"),
    puntaje: document.querySelector("#segundo-puesto-puntaje"),
    lugar: document.querySelector("#segundo-puesto-lugar"),
  },
};

/**
 * Muestra los datos del jugador en una posición del podio.
 * @param {"primero"|"segundo"} puesto
 * @param {"corredor"|"atrapador"} rol
 */
function mostrarPuesto(puesto, rol) {
  const elementos = elementosPuestos[puesto];
  const jugador = estadoPartida.jugadores[rol];

  elementos.nombre.textContent = jugador.nombre;
  elementos.imagen.src = jugador.apariencia.imagen;
  elementos.imagen.alt = rol === "corredor" ? "Corredor" : "Atrapador";
  elementos.puntaje.textContent = String(estadoPartida.puntajes[rol]);
}

if (!(ganadorPartida instanceof HTMLSpanElement) ||
    !(elementosPuestos.primero.nombre instanceof HTMLHeadingElement) ||
    !(elementosPuestos.primero.imagen instanceof HTMLImageElement) ||
    !(elementosPuestos.primero.puntaje instanceof HTMLSpanElement) ||
    !(elementosPuestos.primero.lugar instanceof HTMLParagraphElement) ||
    !(elementosPuestos.segundo.nombre instanceof HTMLHeadingElement) ||
    !(elementosPuestos.segundo.imagen instanceof HTMLImageElement) ||
    !(elementosPuestos.segundo.puntaje instanceof HTMLSpanElement) ||
    !(elementosPuestos.segundo.lugar instanceof HTMLParagraphElement)) {
  throw new Error("No se encontraron los datos del marcador final.");
}

if (restaurarEstadoPartida(estadoPartida)) {
  if (estadoPartida.ganadorPartida === null &&
      estadoPartida.finalizacionManual) {
    ganadorPartida.textContent = "Empate";
    mostrarPuesto("primero", "corredor");
    mostrarPuesto("segundo", "atrapador");
    elementosPuestos.primero.lugar.textContent = "Empate";
    elementosPuestos.segundo.lugar.textContent = "Empate";
  } else if (estadoPartida.ganadorPartida !== null) {
    const ganador = estadoPartida.ganadorPartida;
    const segundo = ganador === "corredor" ? "atrapador" : "corredor";

    ganadorPartida.textContent = estadoPartida.jugadores[ganador].nombre;
    mostrarPuesto("primero", ganador);
    mostrarPuesto("segundo", segundo);
  }
}

// La siguiente partida comenzará nuevamente con ambos puntajes en cero.
eliminarEstadoPartida();
