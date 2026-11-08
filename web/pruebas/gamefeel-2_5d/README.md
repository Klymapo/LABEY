# LABEY · Laboratorio de movimiento y perspectiva 2.5D

**Estado:** prototipo HTML5 independiente de Game Feel · 08/11/2026. **No** reemplaza `web/index.html` (prototipo principal v0.4); tampoco sustituye el proyecto Godot.

## Abrir

Abre `index.html` directamente en Chrome, Edge o Safari, sin conexión ni compilación. Mueve el cuadrado blanco con el joystick virtual (táctil/mouse) o con WASD/flechas. Usa **Espacio**, **Shift** o el botón **DASH**; **Reset** devuelve al personaje al centro.

## Versiones archivadas

- `versiones/PASO_1_MOVIMIENTO.html`: joystick, aceleración, fricción, movimiento diagonal normalizado, velocidad máxima y orientación en 8 direcciones.
- `versiones/PASO_2_DASH.html`: impulso de 0.20 s a 780 px/s, estela púrpura, invulnerabilidad durante el dash, recarga de 0.80 s y feedback táctil.
- `index.html` (Paso 3): mismo control y física aprobados, con dibujo Canvas 2D de piso de rombos isométricos, sombra ovalada, cuatro cajas visuales, Y-sorting y sombra modificada durante el dash. Las cajas **no** tienen colisiones.

## Constantes de la prueba (no balance definitivo)

`MAX_SPEED=260 px/s`, `ACCELERATION=1200 px/s²`, `FRICTION=6.5 (factor exponencial)`, `DASH_SPEED=780 px/s`, `DASH_DURATION=0.20 s`, `DASH_COOLDOWN=0.80 s DESPUÉS del impulso`, `DASH_EXIT_SPEED=130 px/s`. Estado de invulnerabilidad: `isInvulnerable` true únicamente durante el impulso. Game loop con `requestAnimationFrame` y delta time. No sprites, IA, audio, combate ni salas definitivas.

## Capturas

Las capturas de referencia se encuentran en `capturas/` para tamaños 390×844 (móvil simulado) y 1200×800 (escritorio), con situaciones general, detrás y delante de las cajas. Son imágenes de prueba, no assets de producción.

## QA y límites

El usuario confirmó que el movimiento y el Dash se sienten bien. Las capturas ilustran el orden por profundidad. Este módulo no reemplaza pruebas de rendimiento, colisiones o controles en dispositivos físicos. El despliegue Cloudflare no está incluido en esta publicación.

**Fuente de verdad:** `web/pruebas/gamefeel-2_5d/` de `Klymapo/LABEY`. Conserva los prototipos originales sin cambios de física.
