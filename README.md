# 📚 BookFinder & AudioBooks App  

Aplicación móvil desarrollada en **React Native (Expo)** que permite:  

- 🔍 Buscar libros con la **Google Books API**.  
- 🎧 Explorar y reproducir **audiolibros** desde la **API de LibriVox**.  
- 📖 Visualizar detalles completos de cada libro o audiolibro.  
- ⭐ Guardar favoritos localmente con **AsyncStorage**.  

La app combina la búsqueda de libros con un **reproductor estilo Spotify** para audiolibros, ofreciendo una experiencia completa de lectura y escucha.  


## ✨ Características principales  

### 📚 Libros
- 🔍 Búsqueda de libros en línea con **Google Books API**.  
- 📖 Resultados con título, autor y portada.  
- 📑 Pantalla de detalles con descripción, editorial, fecha de publicación y más.  
- ⭐ Guardar y consultar **libros favoritos** de manera local.  

### 🎧 Audiolibros
- 🎶 Catálogo de audiolibros en español desde **LibriVox API**.  
- 📀 Modal tipo Spotify con portada, título y autor.  
- ▶️ Controles de reproducción (play/pause, barra de progreso).  
- ⏱️ Visualización del tiempo transcurrido y duración.  
- ⭐ Guardado de audiolibros favoritos.  


## 🚀 Tecnologías utilizadas  

- **React Native (Expo)**  
- **Google Books API** (búsqueda de libros)  
- **LibriVox API** (audiolibros gratuitos)  
- **React Navigation** (navegación fluida)  
- **expo-av** (reproducción de audio)  
- **AsyncStorage** (persistencia local)  
- **html-entities** (decodificación de texto)  
- **react-native-community/slider** (barra de progreso de audio)  


## 📷 Capturas de Pantalla  

🔍 **Pantalla de búsqueda de libros**  
Resultados con título, autor y portada. 

<img width="247" height="544" alt="image" src="https://github.com/user-attachments/assets/80eca204-1465-465f-adec-996e17078c35" />

📖 **Detalle de libro**  
Información completa: descripción, fecha, editorial, etc. 

<img width="249" height="548" alt="image" src="https://github.com/user-attachments/assets/316085c0-0a32-4fe7-8a4b-8bd739bec492" />


⭐ **Favoritos**  
Lista de libros y audiolibros guardados localmente.  

<img width="248" height="549" alt="image" src="https://github.com/user-attachments/assets/6ad45d2b-2c26-4408-a99a-2bfe87eb832a" />


🎧 **Reproductor estilo Spotify**  
Modal con portada, controles de reproducción y barra de progreso.  


<img width="251" height="546" alt="image" src="https://github.com/user-attachments/assets/74151246-3b17-4160-9c0c-95606f4a94c6" />


<img width="248" height="550" alt="image" src="https://github.com/user-attachments/assets/00cd83fc-cbe2-4de6-b58d-e6312b683bb3" />



## ⚙️ Instalación y ejecución  

1. Clonar el repositorio:  

   git clone https://github.com/tu-usuario/bookfinder-app.git
   cd bookfinder-app
Instalar dependencias:
npm install

Instalar librerías adicionales:

expo install expo-av
npm install @react-native-community/slider
npm install html-entities

Ejecutar la app:
npx expo start -c

📡 Funcionamiento técnico
🔍 Libros (Google Books API)

Se realiza la búsqueda con fetch a la API:

https://www.googleapis.com/books/v1/volumes?q=harry+potter
Se renderizan resultados en una FlatList.

Al seleccionar un libro, se muestran sus detalles en otra pantalla.

Los favoritos se guardan con AsyncStorage.

🎧 Audiolibros (LibriVox API)

Se obtienen audiolibros en español desde:

https://librivox.org/api/feed/audiobooks?format=json&language=Spanish&limit=20
Cada audiolibro abre un modal tipo Spotify con portada, título y autor.

Se controla la reproducción con expo-av:

playAsync() → Reproducir

pauseAsync() → Pausar

setPositionAsync() → Mover barra de progreso

El progreso se visualiza con @react-native-community/slider.

📌 Próximas mejoras

✅ Filtros por categoría o idioma en libros y audiolibros.

✅ Opción de eliminar favoritos.

✅ Reproducción en segundo plano y controles desde la notificación.

✅ Playlist personalizadas.

✅ Tema oscuro/claro con toggle.

👨‍💻 Autor
Desarrollado por Antoni Campero 🚀



