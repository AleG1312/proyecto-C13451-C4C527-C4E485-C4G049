# Iconos en pixel art

Los iconos del juego son SVG en pixel art con fondo transparente. Se crearon
para sustituir imágenes de bancos gratuitos que traían el
patrón de cuadros "transparente" pintado en la imagen, marcas de agua y tamaños
distintos entre sí.

| Archivo | Uso |
|---|---|
| `icono-usuario.svg` | Perfil del jugador (inicio, lobby) |
| `icono-configuracion.svg` | Acceso a configuración |
| `icono-flecha-izquierda.svg` | Regresar / mapa anterior |
| `icono-flecha-derecha.svg` | Mapa siguiente (reflejo de la flecha izquierda) |
| `placeholder-imagen.svg` | Imagen provisional (bienvenida, mapas, resultados) |
| `clock.svg` | Tiempo restante (juego, lobby) |
| `shoe.svg` | Recarga del dash del corredor |
| `gun.svg` | Recarga del arma del atrapador |
| `creator.svg` | Avatar de los integrantes en créditos |

## Reglas para que todos se vean iguales

1. **Misma cuadrícula: 16 × 16.** Todos los iconos se dibujan en la misma
   cuadrícula, así un píxel del dibujo mide lo mismo en todos.
2. **Tamaños en múltiplos de 16.** Se muestran a 32px (interfaz) o 48px
   (juego, reloj del lobby), o sea, 2× o 3×. Con escalas como 24px (1,5×)
   unos píxeles quedan más anchos que otros. Por eso `.boton-icono`
   (`css/common.css`) usa `padding: 0.375rem`: 3rem − 4px de borde − 12px de
   relleno = 32px exactos.
3. **Fondo transparente real.** Las celdas vacías no se dibujan; el fondo lo
   pone el CSS (por ejemplo, el círculo azul de `.boton-icono`). No se usan
   fondos blancos ni el patrón de cuadros pintado.
4. **Bordes nítidos.** Cada SVG lleva `shape-rendering="crispEdges"` y
   `common.css` aplica `image-rendering: pixelated` para que el navegador no
   difumine los píxeles al escalar.
5. **Paleta.** Los iconos de interfaz son blancos (`--color-texto`) para
   contrastar con los fondos azules; el rojo y el azul marino de la paleta del
   sitio (`css/readme.md`) se usan como acentos. Los iconos del juego tienen
   colores propios para distinguir cada rol.

## Cómo editar o agregar un icono

Los SVG se generan; no se editan a mano. Cada icono es una lista de 16 textos
de 16 caracteres en `scripts/generar-iconos.mjs`, donde cada carácter es un
píxel:

```js
"icono-usuario": [
  "................",
  "......WWWW......",   // "." = transparente, "W" = blanco
  ".....WWWWWW.....",
  // ...
],
```

1. Modifique la cuadrícula (o agregue una nueva entrada a `ICONOS`). Si
   necesita otro color, agréguelo a `PALETA` con una letra libre.
2. Ejecute `npm run iconos`. El script valida que la cuadrícula sea de
   16 × 16 y que solo use letras de la paleta, y escribe `assets/<nombre>.svg`.
3. Use el icono con `width` y `height` múltiplos de 16.

## Otros archivos

- `fondo-juan-santamaria.png`: fondo del sitio, adaptado a pixel art de una
  foto de Erick Chavarría (CC BY-SA 2.0); la referencia está en créditos.
- `back.png` y `settings.png`: bocetos en pixel art que hoy no usa ninguna
  página.
- `favicon.ico`: icono de la pestaña del navegador.
