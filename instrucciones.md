**Objetivo:** el sitio queda estilizado, uniforme y adaptable, sobre el HTML ya validado.

**Entregable:**

- Estilos aplicados a todas las páginas, coherentes con los wireframes/diseño.
- CSS válido ante el validador de CSS del W3C y sin errores de `stylelint`.
- Accesibilidad a nivel de estilos: contraste suficiente entre texto y fondo (nivel AA de WCAG, verificable con una herramienta de contraste); no depender solo del color para transmitir información (turnos, estados, errores); estados de foco visibles para navegación por teclado; respetar `prefers-reduced-motion` en las animaciones/transiciones.
- Diseño responsive en todas las páginas.
- Paleta de colores generada con una herramienta, aplicada mediante variables CSS.
- Estilos modularizados y reutilizados (`common.css` + hoja propia por página, ej.: `board.css`).
- Buenas prácticas de CSS: uso de variables (definir valores repetidos como colores una sola vez y reutilizarlos con `var()`); comentarios que expliquen las secciones de estilo; y escribir las propiedades estándar sin *vendor prefixes* manuales (los prefijos como `-webkit-`, `-moz-` o `-ms-` están obsoletos y ya no deben escribirse a mano).
- Transiciones/animaciones básicas y efectos en imágenes según la temática del juego.
- Crear un **Pull Request (PR)** desde la rama de trabajo del equipo hacia la rama principal del repositorio. El PR debe contener los cambios correspondientes a este entregable y permanecer abierto para su revisión. Las observaciones, sugerencias o cambios solicitados durante la revisión se atenderán dentro del mismo PR.