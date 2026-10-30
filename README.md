# giulianoantonanzas.github.io

Portfolio personal de Giuliano Antonanzas: **https://giulianoantonanzas.github.io**

Sitio estático, sin build ni dependencias: `index.html` + `styles.css` + `script.js`.
Bilingüe (español por defecto, inglés con el botón **EN** o `?lang=en`), con modo claro/oscuro.

## Editar

Todo el contenido está en `index.html`. Cada texto aparece dos veces, uno al lado del otro:

```html
<p lang="es">Texto en español.</p>
<p lang="en">Text in English.</p>
```

El CSS muestra solo el idioma activo (`styles.css`, sección *Language switching*), así que para
cambiar algo basta con editar los dos bloques. Los proyectos son `<article class="card">` dentro de
`#proyectos`; la experiencia son `<li class="job">` dentro de `#experiencia`.

Para verlo en local no hace falta nada más que abrir `index.html`, o:

```bash
python3 -m http.server 8080
```

## Publicar

GitHub Pages sirve la rama `main` desde la raíz del repositorio. Cada push a `main` actualiza el sitio
en uno o dos minutos. Si Pages no está activado: *Settings → Pages → Source: Deploy from a branch →
main / (root)*.
