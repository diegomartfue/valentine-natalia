# 365 dias de nosotros

Pagina web interactiva para celebrar nuestro primer aniversario. Tres secciones: galeria de recuerdos, 38 razones de amor descubribles, y una carta animada con sobre.

## Estructura

```
index.html          Pagina principal
js/data.js          TODO el contenido editable (textos, fotos, razones, carta)
js/app.js           Logica e interactividad
css/styles.css      Estilos y animaciones
images/anniversary/ Carpeta para tus fotos
audio/              Carpeta para musica de fondo (opcional)
```

## Personalizar

Edita unicamente `js/data.js`. No necesitas tocar HTML, CSS ni app.js.

### Fotos de recuerdos

1. Coloca tus fotos en `images/anniversary/`
2. En `data.js`, actualiza cada entrada de `memories` con la ruta, titulo, fecha y descripcion:

```javascript
{
  id: 1,
  image: 'images/anniversary/primer-cita.jpg',
  title: 'Nuestra primera cita',
  date: 'Enero 2026',
  description: 'Fuimos al cafe donde todo comenzo...'
}
```

### Razones

Las 38 razones ya estan escritas. Puedes modificar el texto, agregar o eliminar razones. Cada una necesita un `id` unico, `text` y `category`.

### Carta

Reemplaza el texto placeholder en `letter.body` con tu carta personal. Cada elemento del arreglo es un parrafo separado:

```javascript
body: [
  'Primer parrafo de tu carta...',
  'Segundo parrafo...',
  'Tantos como quieras.'
]
```

### Foto especial (carta)

Agrega una foto al final de la carta:

```javascript
image: 'images/anniversary/foto-especial.jpg'
```

### Musica de fondo

1. Coloca un archivo MP3 en `audio/`
2. Actualiza la ruta y activa la musica:

```javascript
music: {
  file: 'audio/nuestra-cancion.mp3',
  enabled: true
}
```

## Desarrollo local

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080` en tu navegador.

## Deploy en GitHub Pages

1. Haz commit y push de tus cambios
2. Ve a Settings > Pages en tu repositorio
3. Source: Deploy from branch
4. Branch: main
5. Tu sitio estara en: `https://TU-USUARIO.github.io/valentine-natalia/`

## Funcionalidades

- Seccion de bienvenida con animacion de particulas
- Galeria de recuerdos estilo polaroid con cinta decorativa
- 38 razones interactivas con progreso guardado en localStorage
- Boton "Sorprendeme" para descubrir razones al azar
- Carta animada con sobre que se abre al tocar
- Navegacion fija con scroll suave
- Animaciones de revelacion al hacer scroll
- Diseno mobile-first responsive
- Toggle de musica de fondo (sin autoplay)

---

Hecho con amor para Natalia
