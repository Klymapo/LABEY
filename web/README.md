# LABEY · Publicación web y archivo de Game Feel

## Rama principal
- `web/index.html`: Paso 5.4.3 con gadgets originales, hitboxes por base, profundidad, dash animado, ataque direccional y controles táctiles ocultables con T.
- `web/assets/protagonista_caminar_v3.png` y `web/assets/protagonista_atacar_v3.png`: hojas existentes sin regeneración.
- `web/labey-v0.4.html`: respaldo del prototipo anterior (no eliminar). Las imágenes originales de `web/assets/` también se conservan.
- `web/pruebas/gamefeel-2_5d/`: archivos del laboratorio, pasos originales y documentación.

## Cómo servir
La carpeta `web/` es la raíz de los archivos estáticos. `index.html` se sirve en `/` y los sprites WebP del protagonista y los gadgets en `/assets/`.
Se puede probar localmente con un servidor estático gratuito, por ejemplo `python -m http.server 8000 --directory web`. No requiere APIs ni pagos.

## Cloudflare
Objetivo de despliegue: Worker `labey` de `calimapo55.workers.dev`.
La publicación de este commit en GitHub **no prueba** que Cloudflare haya desplegado automáticamente. Verificar el deployment en el dashboard de Cloudflare y la URL final antes de marcarlo como publicado.
Si el Worker tiene Git conectado con despliegue automático desde `main`, verificar que la carpeta raíz de assets sea `web/`; de lo contrario se deberá ejecutar el despliegue desde la cuenta autorizada, sin copiar tokens en chats.

## Estado de calidad
Los controles y la física se validaron previamente en Chromium simulado, pero faltan pruebas táctiles en teléfono físico.
El botón de ataque reproduce cuadros sin lógica de daño. No hay enemigos en este módulo.

## Historial
- 2026-11-08: Paso 5.4.3. El área de ataque sólo aparece al activar las hitboxes y se retiró el óvalo de invulnerabilidad del dash.
- 2026-11-08: Paso 5.4.2. Casco oeste recompuesto, escala de ataque ajustada, dash de 124.8 px con estela al 40% de su opacidad anterior, frenado inmediato e indicador de pies retirado.
- 2026-11-08: pasos 1–3 archivados, commit `8a53519`.
- 2026-11-08: Paso 4 colisiones respaldado en Gaston.
- 2026-11-08: Paso 5 sprites V3 respaldado en Gaston; actualización del frontend de GitHub para prepararlo para Cloudflare.
