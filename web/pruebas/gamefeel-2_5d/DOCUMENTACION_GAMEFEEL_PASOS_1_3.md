# LABEY BLACKSMITH — PRUEBA GAME FEEL HTML5 (PASOS 1–3)

**Fecha:** 2026-11-08  |  **Responsable:** Admin / Atátoriz  |  **Compilación documental:** Argos
**Estado:** desarrollo experimental de controles, NO gameplay final. Documento complementario al REPORTE_MAESTRO.md.

## Propósito
Estudiar primero la comodidad del control táctil, tamaño de personaje, scroll y sensación de desplazamiento antes de construir salas procedurales, gadgets, puzzles o combates. Se eligió una prueba minimalista sin sprites con cuadrado blanco de 32x32 y un joystick circular, sobre pantalla adaptable a móvil y PC.

## Paso 1 · Movimiento
- Archivo: `versiones/PASO_1_MOVIMIENTO.html` (original preservado).
- Loop `requestAnimationFrame` con delta time: evita que la velocidad dependa de FPS.
- Joystick virtual mediante eventos de puntero (táctil y mouse), y compatibilidad con WASD/flechas.
- Física: aceleración gradual, frenado con fricción e inercia, velocidad máxima y normalización diagonal; indicador conserva orientación última al detenerse.
- Reset para recuperar al jugador si sale de pantalla.

## Paso 2 · Dash
- Archivo: `versiones/PASO_2_DASH.html` (original preservado).
- Botón circular inferior derecho + teclas Espacio/Shift; dirección del joystick o última orientación.
- Impulso instantáneo de 780 px/s durante 0.20 s; se suspende la física normal del paso 1 durante el impulso, se retoma después.
- Estela púrpura, invulnerabilidad `isInvulnerable=true` durante los 0.20 s y recarga de 0.80 s DESPUÉS del dash; la UI indica LISTO/ACTIVO/RECARGANDO.
- Retroalimentación del usuario: movimiento y Dash se sienten bien.

## Paso 3 · Vista 2.5D isométrica
- Archivo principal: `index.html` dentro de `web/pruebas/gamefeel-2_5d/` (original `LABEY_ISOMETRICO_DASH_PASO3.html`).
- Mantiene los mismos parámetros de física y Dash del Paso 2; sólo evoluciona la representación con Canvas 2D.
- Cuadrícula de rombos, sombra ovalada bajo el cuadrado, cuatro cajas decorativas, render por Y-sorting para aparentar pasar delante o detrás y sombra alterada durante Dash.
- Referencia estética: juego de acción 2.5D tipo Hades; los objetos son geometría temporal, sin sprites ni colisiones de cajas.
- Capturas de prueba: móvil simulado 390×844 y escritorio 1200×800; estados general / delante / detrás.

## Parámetros de calibración (no definitivos)
| Parámetro | Valor |
|---|---|
| Velocidad máxima | 260 px/s |
| Aceleración | 1200 px/s² |
| Fricción | 6.5, decaimiento exponencial |
| Velocidad Dash | 780 px/s |
| Duración Dash | 0.20 s |
| Cooldown Dash | 0.80 s tras finalizar |
| Salida del Dash | 130 px/s |

## Estado, alcance y próximos pasos
- **Implementado en la prueba:** joystick móvil/mouse, teclado, aceleración, frenado, Dash, estela, invulnerabilidad temporal, cooldown, UI de estado, cuadrícula isométrica, sombra y orden de dibujado por Y.
- **No implementado en esta prueba:** sprites oficiales, armas/datos de daño, colisiones reales con cajas, obstáculos, enemigos, salas aleatorias, gadgets/puzzles, persistencia o exportación Android.
- **QA:** el usuario confirmó el feeling del movimiento y Dash; se produjeron capturas en dimensiones móvil y PC. Las pruebas funcionales del Paso 3 no sustituyen un ensayo en un celular físico.
- **Separación de código:** `Klymapo/LABEY/web/index.html` mantiene la v0.4 del prototipo principal con arte y botones; `web/pruebas/gamefeel-2_5d/` conserva esta serie independiente. No hay despliegue Cloudflare validado para el experimento.

## Referencias
- GitHub: https://github.com/Klymapo/LABEY
- Reporte maestro: https://drive.google.com/file/d/1ALbXf5VySHRerbR2Rmkk4UXt3l7czK81/view
- Carpeta en Gaston: https://drive.google.com/drive/folders/1HeTw_U4iEktCw48gPiDEn8FduVUvQn51

**Proveniencia:** archivos originales de los Pasos 1, 2 y 3 generados durante la sesión del 08/11/2026. Cualquier modificación o integración futura requiere auditoría del game feel.
