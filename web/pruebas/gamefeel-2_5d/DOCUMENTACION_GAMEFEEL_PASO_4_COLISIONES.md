# LABEY BLACKSMITH | LABORATORIO GAME FEEL — PASO 4

**Fecha:** 08/11/2026  
**Responsable:** Admin / Atátoriz  
**Implementación y documentación técnica:** Argos  
**Naturaleza:** prototipo HTML5 autónomo, independiente de `web/index.html` principal y de la beta de Godot.  
**Estado:** código generado, auditoría automatizada ejecutada; revisión jugable en dispositivo físico pendiente.  
**Fuente:** `LABEY_COLISIONES_DASH_PASO4.html` (HTML/CSS/JS integrados, sin imágenes ni bibliotecas externas).

## 1. Objetivo y alcance

Proveer límites finitos al escenario 2.5D y colisiones reales para cuatro cajas de laboratorio. El propósito es calibrar el movimiento y la lectura espacial antes de integrar sprites, enemigos o salas procedurales. **No** se modifica el comportamiento aprobado de aceleración, fricción, joystick o Dash. Se preservan perspectiva isométrica de rombos, estela, sombra, profundidad por Y y botones móviles.

## 2. Comportamientos implementados

1. **Área jugable:** rectángulo dentro de los bordes de la ventana con margen `MAP_MARGIN=22 px`; el cuadrado visible de 32×32 y la hitbox de pies permanecen dentro. Si se impacta un borde se anula la velocidad del eje bloqueado.
2. **Cajas sólidas sólo en la base:** cuatro objetos con apariencia 2.5D. Las colisiones usan rectángulos planos alineados a ejes (AABB) que representan la huella de contacto con el suelo. No se bloquea toda la elevación dibujada. Las dimensiones de cajas y su ubicación se calculan respecto a tamaño de pantalla.
3. **Colisiones y deslizamiento:** `moveWithCollisions()` subdivide el desplazamiento en pasos de hasta 4 px por eje. Para caminar, comprueba X y luego Y; el eje libre puede continuar si el otro choca. No atraviesa cajas durante desplazamientos rápidos.
4. **Dash con choque:** el impulso mantiene `780 px/s` hasta colisionar. Si encuentra obstáculo o borde, corta el Dash, pone la velocidad a cero y retira `isInvulnerable`; inicia recarga de 0.80 s. En trayecto libre conserva los 0.20 s del Dash y velocidad de salida 130 px/s.
5. **Debug:** botón `MOSTRAR HITBOXES` / `OCULTAR HITBOXES` con `aria-pressed`; dibuja límites de mapa, bases reales de las cajas y hitbox del jugador en rojo sobre la escena. No altera la física ni el orden de objetos.
6. **Reset / rotación:** `getSafeSpawn()` busca un lugar libre al reiniciar o cambiar el tamaño de pantalla. Si la pantalla es demasiado pequeña para un espacio libre, existe un caso de degradación anotado en el código.
7. **Dibujo:** permanece la cuadrícula isométrica, sombra oval bajo el jugador, estela púrpura y **Y-sorting de menor a mayor Y** de punto de contacto (objetos más cercanos se dibujan después). El debug se dibuja al final.

## 3. Parámetros reproducibles

| Parámetro | Valor | Nota |
|---|---:|---|
| `MAX_SPEED` | 260 px/s | Movimiento normal, diagonales normalizadas |
| `ACCELERATION` | 1200 px/s² | Física original |
| `FRICTION` | 6.5 | Decaimiento exponencial original |
| `SIZE` | 32 px | Lado del cuadrado visual |
| `DASH_SPEED` | 780 px/s | Impulso inmediato |
| `DASH_DURATION` | 0.20 s | Invulnerabilidad solamente mientras dura el impulso |
| `DASH_COOLDOWN` | 0.80 s | Después de salir del Dash |
| `DASH_EXIT_SPEED` | 130 px/s | Sólo si no choca |
| `MAP_MARGIN` | 22 px | Borde jugable interno |
| `PLAYER_FOOT_WIDTH × HEIGHT` | 21 × 11 px | AABB plana en el suelo |
| `PLAYER_FOOT_OFFSET_Y` | +10 px | Respecto al centro del cuadrado |
| `MAX_COLLISION_STEP` | 4 px | Subdivisión de movimiento para evitar túnel |

**Cajas (posición proporcional a la pantalla):**

| Caja | Centro X (`rx`) | Frente Y (`ry`) | Ancho visual | Altura visual | Profundidad |
|---|---:|---:|---:|---:|---:|
| 1 ámbar | 0.21 | 0.36 | 86 px | 49 px | 29 px |
| 2 azul | 0.76 | 0.43 | 115 px | 66 px | 38 px |
| 3 azul | 0.33 | 0.70 | 100 px | 58 px | 31 px |
| 4 ámbar | 0.78 | 0.78 | 82 px | 47 px | 27 px |

La huella física usa el ancho `box.width × 0.76` y el intervalo Y de `frontY - depth × 1.75` a `frontY - depth × 0.25`. Estas son proporciones de *calibración*, no geometría exacta de producción.

## 4. Pruebas ejecutadas (08/11/2026)

`test_labey_step4.py` (Playwright + Chromium): **20 comprobaciones por resolución** en 390×844, 1200×800 y 320×568; sin errores de JavaScript. Incluye cuatro cajas, su suelo de colisión, tránsito diagonal por bordes, choque, Dash e invulnerabilidad, recarga, límites y Reset; comprueba además conmutación de Debug.

`test_labey_step4_extended.py`: **21 comprobaciones adicionales** en 390×844 y **24** en 1200×800, sobre límites y prevención de atravesar cajas. Las capturas con y sin debug fueron generadas en las tres resoluciones indicadas.

**Limitaciones del QA:** son pruebas automatizadas del HTML local con navegador de escritorio simulando resoluciones de móvil. No equivalen a validación de multitáctil, latencia, rendimiento o ergonomía en un teléfono físico. Tampoco prueban importación Godot, jugabilidad final ni despliegue Cloudflare.

## 5. Archivos de entrega y preservación

- `PASO_4_COLISIONES/LABEY_COLISIONES_DASH_PASO4.html`: fuente principal, ejecutable offline por doble clic.
- `PASO_4_COLISIONES/LABEY_COLISIONES_DASH_PASO4.zip`: ZIP que incluye `index.html`.
- `PASO_4_COLISIONES/CAPTURAS/`: seis PNG: `LABEY_PASO4_{320x568,390x844,1200x800}` con y sin `_DEBUG`.
- `PASO_4_COLISIONES/QA/`: dos scripts Playwright usados en la auditoría. Requieren Python, Playwright y Chromium; sus rutas locales son específicas del entorno de pruebas, no son parte del juego offline.
- `DOCUMENTACION/DOCUMENTACION_GAMEFEEL_PASO_4_COLISIONES.md`: esta ficha técnica.
- `DOCUMENTACION/REPORTE_MAESTRO_SNAPSHOT_2026-11-08_PASO4.md`: copia de recuperación previa a sincronizar el reporte maestro.
- `DOCUMENTACION/REPORTE_MAESTRO.md`: registro del cambio e índice de estado actualizado, conservando historial previo.

**Repositorio GitHub:** se verificó que `Klymapo/LABEY` rama `main` todavía conserva el experimento Paso 3 (`web/pruebas/gamefeel-2_5d/index.html`) y el prototipo principal web v0.4; **el Paso 4 no se ha subido a GitHub** como parte de esta documentación.  
**Gaston:** https://drive.google.com/drive/folders/1rp0Dq8GDtEQJfHYhAz-1xojkrY-p7S5r  
**Reporte maestro:** https://drive.google.com/file/d/1ALbXf5VySHRerbR2Rmkk4UXt3l7czK81/view  
**GitHub histórico Paso 3:** https://github.com/Klymapo/LABEY/tree/main/web/pruebas/gamefeel-2_5d

## 6. Qué falta antes de integrar al juego

- Medir el feeling real en celular, calibrar huellas de pies y márgenes con sprites definitivos.
- Comprobar en dispositivos físicos el control multitáctil joystick + Dash.
- Decidir si el mapa seguirá asociado a los bordes de pantalla o tendrá coordenadas de mundo con cámara móvil (el Paso 4 usa el viewport como mapa).
- Diseñar colisiones complejas (polígonos, paredes, obstáculos con interacción) y verificar que siguen siendo compatibles con orden Y, animaciones y dash.
- No confundir el debug de colisiones con un sistema de combate o daño; no hay enemigos ni puzzles en esta prueba.

## 7. Registro de la operación de documentación

- **Fecha:** 2026-11-08.
- **Origen:** archivos HTML/ZIP y capturas producidos para LABEY Paso 4, mantenidos sin cambios de lógica durante este registro.
- **Destino:** respaldo nuevo en Gaston bajo `RECURSOS_BETA/PRUEBA_GAMEFEEL_2_5D/PASO_4_COLISIONES`, ficha técnica nueva y snapshot de sincronización en `DOCUMENTACION`, más actualización del reporte maestro existente.
- **Conservación:** pasos 1 a 3 no sobrescritos; ninguna eliminación; repositorio GitHub sin cambios en esta operación.
