# giulianoantonanzas.github.io

Portfolio personal de Giuliano Antonanzas: **https://giulianoantonanzas.github.io**

Sitio estático, sin build ni dependencias: `index.html` + `styles.css` + `script.js` + `assets/`.
Bilingüe (español por defecto, inglés con el botón **EN** o `?lang=en`), con modo claro/oscuro.

## Qué hay en la página

| Sección | id | Qué es |
| --- | --- | --- |
| Hero | — | Diagrama SVG "arquitectura de una persona": entradas → nodo central (foto) → salidas, y capas abajo. Cada nodo es un link. |
| Hola | `#hola` | Presentación + métricas (`.metrics`, los números se animan). |
| Recorrido | `#recorrido` | Git graph con tres ramas. Cada `<li class="commit">` tiene `data-lane` (0 main, 1 escuelita, 2 propio), opcional `data-from` (de qué commit se abre la rama) y `data-merge` (a qué commit hace merge). `script.js` dibuja las líneas. |
| Equipos | `#equipos` | Runbook de tres pasos, caso destacado y casos cortos. |
| Escuelita | `#escuelita` | Texto, checklist, links y panel de datos. |
| Productos | `#construyendo` | Seguridar destacado y tres productos; cada uno con su `<ol class="flow">` (cajas con flechas). |
| IA · AWS | `#ia-aws` | Especialista en IA aplicada + certificaciones. |
| Contacto | `#contacto` | Email y redes. |

## Editar

Cada texto aparece dos veces, uno al lado del otro:

```html
<p lang="es">Texto en español.</p>
<p lang="en">Text in English.</p>
```

El CSS muestra solo el idioma activo, así que para cambiar algo basta con editar los dos bloques.
Dentro del SVG del hero se usa `<tspan lang="es">` / `<tspan lang="en">`.

Para verlo en local no hace falta nada más que abrir `index.html`, o:

```bash
python3 -m http.server 8080
```

## Caché

`index.html` enlaza `styles.css?v=…` y `script.js?v=…`. Al cambiar el CSS o el JS, subí ese número
(o la fecha) en los dos enlaces: así los navegadores que ya visitaron el sitio no mezclan HTML nuevo
con estilos viejos.

## Publicar

GitHub Pages sirve la rama `main` desde la raíz del repositorio. Cada push a `main` actualiza el sitio
en uno o dos minutos. Si Pages no está activado: *Settings → Pages → Source: Deploy from a branch →
main / (root)*.
