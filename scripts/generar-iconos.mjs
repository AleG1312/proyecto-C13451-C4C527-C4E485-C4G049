// Generador de los iconos en pixel art de National Campaign.
//
// Cada icono se dibuja como una cuadrícula de 16 × 16 caracteres: cada
// carácter es un píxel y su color sale de PALETA ('.' es transparente).
// El script convierte cada cuadrícula en un SVG dentro de assets/, agrupando
// los píxeles contiguos de una fila en un solo rectángulo por color.
//
// Uso:  npm run iconos   (o: node scripts/generar-iconos.mjs)
//
// Para modificar un icono, edite su cuadrícula aquí y vuelva a ejecutar el
// script; no edite los SVG a mano. Las reglas de estilo están en
// assets/readme.md.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const TAMANO = 16;

// Colores de la interfaz (los mismos de css/common.css) y colores propios de
// los iconos del juego.
export const PALETA = {
  ".": null, // transparente
  W: "#ffffff", // blanco: --color-texto
  R: "#d71920", // rojo: --color-primario
  K: "#07152f", // azul marino: --color-fondo
  // Bota del dash
  G: "#a8e61d", // verde lima
  g: "#7cb518", // verde oscuro (borde superior de la bota)
  C: "#8fd3f4", // celeste del ala
  c: "#d2f1fc", // brillo del ala
  S: "#5e5468", // gris violáceo (contornos)
  // Arma
  M: "#9aa3ad", // metal
  D: "#4a4f5a", // metal en sombra
  N: "#8b5a2b", // madera de la empuñadura
  n: "#6b4220", // madera en sombra
  // Avatar de créditos
  L: "#d4f7c4", // verde claro
  X: "#000000", // negro
  k: "#444444", // gris oscuro
};

export const ICONOS = {
  // Interfaz: monocromos en blanco para leerse sobre los fondos azules.
  "icono-configuracion": [
    "................",
    "......WWWW......",
    "..WW..WWWW..WW..",
    "..WWWWWWWWWWWW..",
    "...WWWWWWWWWW...",
    "...WWWWWWWWWW...",
    ".WWWWWW..WWWWWW.",
    ".WWWWW....WWWWW.",
    ".WWWWW....WWWWW.",
    ".WWWWWW..WWWWWW.",
    "...WWWWWWWWWW...",
    "...WWWWWWWWWW...",
    "..WWWWWWWWWWWW..",
    "..WW..WWWW..WW..",
    "......WWWW......",
    "................",
  ],
  "icono-usuario": [
    "................",
    "......WWWW......",
    ".....WWWWWW.....",
    ".....WWWWWW.....",
    ".....WWWWWW.....",
    ".....WWWWWW.....",
    "......WWWW......",
    "................",
    "....WWWWWWWW....",
    "...WWWWWWWWWW...",
    "..WWWWWWWWWWWW..",
    "..WWWWWWWWWWWW..",
    "..WWWWWWWWWWWW..",
    "..WWWWWWWWWWWW..",
    "..WWWWWWWWWWWW..",
    "................",
  ],
  "icono-flecha-izquierda": [
    "................",
    "................",
    "......WW........",
    ".....WWW........",
    "....WWWW........",
    "...WWWWW........",
    "..WWWWWWWWWWWWW.",
    ".WWWWWWWWWWWWWW.",
    ".WWWWWWWWWWWWWW.",
    "..WWWWWWWWWWWWW.",
    "...WWWWW........",
    "....WWWW........",
    ".....WWW........",
    "......WW........",
    "................",
    "................",
  ],
  // La flecha derecha se genera reflejando la izquierda (ver más abajo).
  "placeholder-imagen": [
    "................",
    "................",
    "WWWWWWWWWWWWWWWW",
    "W..............W",
    "W.........RRR..W",
    "W........RRRRR.W",
    "W....W...RRRRR.W",
    "W...WWW..RRRRR.W",
    "W..WWWWW..RRR..W",
    "W.WWWWWWW......W",
    "WWWWWWWWWW..W..W",
    "WWWWWWWWWWWWWW.W",
    "WWWWWWWWWWWWWWWW",
    "................",
    "................",
    "................",
  ],

  // Juego: a color, para distinguir el tiempo y las habilidades de cada rol.
  clock: [
    ".....RRRRRR.....",
    "...RRRRRRRRRR...",
    "..RRRWWWWWWRRR..",
    ".RRWWWWWWWWWWRR.",
    ".RRWWWWKWWWWWRR.",
    "RRWWWWWKWWWWWWRR",
    "RRWWWWWKWWWWWWRR",
    "RRWWWWWKWWWWWWRR",
    "RRWWWWWKKKKWWWRR",
    "RRWWWWWWWWWWWWRR",
    "RRWWWWWWWWWWWWRR",
    ".RRWWWWWWWWWWRR.",
    ".RRWWWWWWWWWWRR.",
    "..RRRWWWWWWRRR..",
    "...RRRRRRRRRR...",
    ".....RRRRRR.....",
  ],
  shoe: [
    "................",
    "................",
    "................",
    "SSSSS..ggggg....",
    "SccCCS.GGGGG....",
    ".SSSCCSGGGGG....",
    "SccCCCSGGGGG....",
    ".SSSCCSGGGGG....",
    "..SccCSGGGGGG...",
    "...SSSSGGGGGGGG.",
    "......GGGGGGGGGG",
    "......GGGGGGGGGG",
    "......WWWWWWWWWW",
    "................",
    "................",
    "................",
  ],
  gun: [
    "................",
    "................",
    "................",
    "..............M.",
    ".MMMMMMMMMMMMMMM",
    ".MWWMMMMMMMMMMMM",
    ".DDDDDDDDDDDDDDD",
    "..NNNND..D......",
    "..NnNN.DD.......",
    ".NNnNN..........",
    ".NnNN...........",
    ".NNnN...........",
    "NnNN............",
    "NNNN............",
    "................",
    "................",
  ],
  creator: [
    "................",
    "................",
    ".......SSS......",
    "......SGGGS.....",
    ".....SGGLGGS....",
    ".....SGXLXGS....",
    ".....SGLLLGS....",
    ".....SGXLXGS....",
    ".....SGXXXGS....",
    "......SGGGS.....",
    ".......SSS......",
    ".....SSGGGSS....",
    "....kGGGGGGGk...",
    "...SGGGGGGGGGS..",
    "...SSSSSSSSSSS..",
    "................",
  ],
};

ICONOS["icono-flecha-derecha"] = ICONOS["icono-flecha-izquierda"].map((fila) =>
  [...fila].reverse().join(""),
);

/** Revisa que la cuadrícula sea de 16 × 16 y use solo colores de la paleta. */
function validar(nombre, filas) {
  if (filas.length !== TAMANO) {
    throw new Error(`${nombre}: tiene ${filas.length} filas, se esperaban ${TAMANO}`);
  }
  filas.forEach((fila, y) => {
    if (fila.length !== TAMANO) {
      throw new Error(`${nombre}, fila ${y}: mide ${fila.length}, se esperaba ${TAMANO}`);
    }
    for (const caracter of fila) {
      if (!(caracter in PALETA)) {
        throw new Error(`${nombre}, fila ${y}: el carácter "${caracter}" no está en la paleta`);
      }
    }
  });
}

/** Convierte una cuadrícula en SVG: un <path> por color, un rectángulo por tramo. */
export function aSvg(filas) {
  const trazos = new Map();
  filas.forEach((fila, y) => {
    let x = 0;
    while (x < TAMANO) {
      const caracter = fila[x];
      let fin = x + 1;
      while (fin < TAMANO && fila[fin] === caracter) fin += 1;
      if (PALETA[caracter]) {
        const color = PALETA[caracter];
        const d = trazos.get(color) ?? [];
        d.push(`M${x} ${y}h${fin - x}v1h-${fin - x}z`);
        trazos.set(color, d);
      }
      x = fin;
    }
  });

  const paths = [...trazos]
    .map(([color, d]) => `  <path fill="${color}" d="${d.join("")}"/>`)
    .join("\n");

  return `<!-- Generado por scripts/generar-iconos.mjs; edite la cuadrícula allí. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${TAMANO}" height="${TAMANO}" viewBox="0 0 ${TAMANO} ${TAMANO}" shape-rendering="crispEdges">
${paths}
</svg>
`;
}

function main() {
  const carpeta = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
  for (const [nombre, filas] of Object.entries(ICONOS)) {
    validar(nombre, filas);
    writeFileSync(join(carpeta, `${nombre}.svg`), aSvg(filas));
    console.log(`assets/${nombre}.svg`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
