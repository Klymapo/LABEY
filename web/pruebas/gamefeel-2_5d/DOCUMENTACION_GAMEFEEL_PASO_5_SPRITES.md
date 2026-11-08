# LABEY — Paso 5: integración de sprites oficiales V3 en el laboratorio 2.5D

**Fecha:** 2026-11-08  
**Responsable:** Admin / Atátoriz; integración técnica: Argos  
**Estado:** prueba HTML5 funcional con arte V3, independiente del juego principal. **No** se ha modificado `Klymapo/LABEY/main` ni desplegado en Cloudflare.

## 1. Propósito
Sustituir el cuadrado blanco de 32x32 en el último laboratorio (Paso 4, Dash + hitboxes) por los sprites originales del protagonista Labey. Mantener sin cambios los parámetros aprobados de movimiento y Dash, la geometría de las colisiones y el Y-sorting.

## 2. Origen verificable de recursos
- Gaston `VIDEOJUEGOS/ROGUELITE_BETA/RECURSOS_BETA/SPRITES_LIMPIOS_V3/PROTAGONISTA_CAMINAR_LIMPIO_V3.png`, PNG RGBA 1600x2560, 8 filas x 5 columnas, 320px cada fotograma.
- Gaston `.../SPRITES_LIMPIOS_V3/PROTAGONISTA_ATACAR_LIMPIO_V3.png`, PNG RGBA 960x2560, 8 filas x 3 columnas, 320px cada fotograma.
- Orden de filas: S, SE, E, NE, N, NW, W, SW. Se usan las ocho, sin espejar.
- Las 8 poses de reposo se muestran con la primera imagen de cada fila de caminar; no constituyen nuevos cuadros artísticos.
- Las dos hojas PNG de `assets/` son **copias de bytes idénticos** a V3: no se dibujó ni regeneró ningún sprite.

## 3. Representación Canvas y anclaje 2.5D
- Sprite protagonista: `drawImage` con recorte de 320x320 en el atlas, a escala de prueba 0.40. El personaje visible ocupa aproximadamente 70px de alto, pero el sprite completo mantiene su margen transparente original.
- Centro horizontal del sprite en X=160 del cuadro y pivote de pies visual cerca de Y=296; se dibuja con los pies sobre `player.y + 16`.
- La hitbox real de pies **no cambia**: 21x11px, offset en Y=+10 respecto a `player.y`, como en Paso 4. El volumen visual se puede superponer a la caja desde atrás, sin introducir colisiones de torso.
- Se mantiene el Y-sorting usando la coordenada de los pies. La sombra ovalada sigue anclada al suelo y se estira en Dash. Continúa el contorno rojo de depuración para pies, cuatro bases de caja y límites.

## 4. Controles y animación
- Mover con joystick táctil/mouse o WASD/flechas; aceleración 1200px/s², fricción exponencial 6.5 y tope 260px/s: **idénticos a Paso 4**.
- Caminar: 5 fotogramas por dirección a 0.09 s/cuadro; reposo: primer cuadro de caminata, conservando la última orientación cuando no hay movimiento.
- Atacar: botón circular **ATACAR** o teclas J/F, 3 cuadros a 0.11 s/cuadro; fija la dirección al comenzar la animación; por ahora no hay daños, alcance ni colisión ofensiva.
- Dash: Espacio/Shift/botón DASH, 780px/s por 0.20s, 0.80s de recarga posterior, salida 130px/s. `isInvulnerable` permanece activa sólo durante la fase del impulso. El Dash usa la pose intermedia (cuadro 2) de caminar, **no un sprite de Dash nuevo**.
- Efecto visual: la estela púrpura conserva su desvanecimiento, añadiendo una silueta semitransparente del sprite V3.
- Reset: restablece posición segura, dirección, velocidad, Dash, ataque y animación.

## 5. Archivos entregados
- `LABEY_PASO5_SPRITES_DASH_HITBOXES.html`: versión autocontenida, PNG incrustados como data URI; abrir directamente desde el navegador sin servidor ni internet.
- `LABEY_PASO5_SPRITES_DASH_HITBOXES.zip`: contiene `index.html`, `assets/protagonista_caminar_v3.png`, `assets/protagonista_atacar_v3.png` y `README.md`, listo para extraer y abrir `index.html`. No alterar la estructura interna de carpetas.
- `CAPTURAS/`: capturas para vista móvil y PC, con y sin hitboxes.

## 6. Auditoría
- Comprobación de sintaxis JavaScript para HTML externo y autocontenido con `node --check`.
- Regresión del motor de colisiones de Paso 4: **60 casos** (20x3 resoluciones 390x844, 1200x800 y 320x568).
- Regresión ampliada del Paso 4: **45 casos** (21 en 390x844, 24 en 1200x800).
- Integración visual/sprites: **23 aserciones principales por resolución** en 390x844, 1200x800, 320x568, más carga de ambos atlases en Chromium, activación UI ATACAR, toggle Debug, capturas, y ausencia de errores JS. Validación del mapeo N, NE, E, SE, S, SW, W y NW.
- Comparación SHA-256 de ambas hojas de sprites: copias idénticas a V3. ZIP íntegro y estructura comprobada.
- Queda pendiente prueba en **celular físico**: multitáctil joystick/ataque/Dash, tamaño relativo, perspectiva y rendimiento.

## 7. Límites explícitos
- No se modificaron `web/index.html`, las betas de Godot ni los sprites V3 originales.
- No se añadieron animaciones de daño, muerte o Dash (se reutilizan poses existentes).
- El botón ATACAR solamente muestra la animación; aún NO existe daño, hitbox de espada o enemigos en este laboratorio.
- Prueba y escala de 40% provisionales; calibrar tamaño en dispositivo real antes de integrarlo a las salas completas.

## 8. Rutas
- Archivo maestro: `Gaston/VIDEOJUEGOS/ROGUELITE_BETA/DOCUMENTACION/REPORTE_MAESTRO.md`.
- Respaldo Paso 5: `Gaston/VIDEOJUEGOS/ROGUELITE_BETA/RECURSOS_BETA/PRUEBA_GAMEFEEL_2_5D/PASO_5_SPRITES/`.
- Fuente de sprites: carpeta `SPRITES_LIMPIOS_V3` de Gaston.
