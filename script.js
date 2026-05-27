const listaCanciones = [
    { id: 0, titulo: "Kali Uchis - Quiero Sentirme Bien", src: "music/Kali Uchis – quiero sentirme bien.mp3" },
    { id: 1, titulo: "Daniel, me estás matando - Lo Hice, Te Dejé", src: "music/Daniel me estas matando - Lo Hice Te Deje.mp3" },
    { id: 2, titulo: "Frank Ocean - Thinkin Bout You", src: "music/Frank Ocean - Thinkin Bout You.mp3" },
    
    { id: 3, titulo: "Ariana Grande - pov", src: "music/Ariana Grande - pov.mp3" },
    { id: 4, titulo: "Bad Bunny - El Apagón", src: "music/Bad Bunny - El Apagón.mp3" },
    { id: 5, titulo: "Billie Eilish - my future", src: "music/Billie Eilish - my future.mp3" },

    { id: 6, titulo: "Lana del Rey - Million Dollar Man", src: "music/Lana del Rey - Million Dollar Man.mp3" },
    { id: 7, titulo: "Shakira - Día De Enero", src: "music/Shakira - Dia De Enero.mp3" },
    { id: 8, titulo: "SZA - Love Galore (Alt Version)", src: "music/SZA - Love Galore (Alt Version).mp3" },
    { id: 9, titulo: "The Weeknd - In The Night", src: "music/The Weeknd - In The Night.mp3" },
    
    { 
        id: 10, 
        titulo: "Para mis amigos", 
        src: "", 
        isEasterEgg: true, 
        mensaje: "Para mis amigos y seres queridos, por si alguna vez se les olvidó pagar el Spotify." 
    }
];

let indiceActual = 0;
let estaEncendido = false; 

const reproductorAudio = document.getElementById("reproductor-audio");
const carreteIzq = document.getElementById("carrete-izq");
const carreteDer = document.getElementById("carrete-der");
const ledEstadoPower = document.getElementById("led-estado-power"); 
const menuPlaylist = document.getElementById("playlist-menu");
const contenedorLista = document.getElementById("lista-canciones");

// Buscamos la ventana para poder pintar el texto encima
const seccionVentana = document.querySelector(".seccion-ventana");

const btnPlayPause = document.getElementById("btn-play-pause");
const btnRewind = document.getElementById("btn-rewind");
const btnShuffle = document.getElementById("btn-shuffle");
const btnPlaylist = document.getElementById("btn-playlist");
const btnStop = document.getElementById("btn-stop"); 

function cargarPlaylistVisual() {
    contenedorLista.innerHTML = "";
    listaCanciones.forEach((cancion) => {
        const li = document.createElement("li");
        li.textContent = cancion.titulo;
        li.setAttribute("data-id", cancion.id);
        li.addEventListener("click", () => {
            if (estaEncendido) seleccionarCancion(cancion.id);
        });
        contenedorLista.appendChild(li);
    });
}

function seleccionarCancion(id) {
    indiceActual = id;
    const cancionActual = listaCanciones[indiceActual];
    
    // Resaltar elemento activo en la lista
    document.querySelectorAll("#lista-canciones li").forEach(li => {
        li.classList.remove("cancion-activa");
        if(parseInt(li.getAttribute("data-id")) === id) {
            li.classList.add("cancion-activa");
        }
    });

    // Validar si hicieron clic en el Easter Egg de los amigos
    if (cancionActual.isEasterEgg) {
        reproductorAudio.src = ""; // Vaciamos el audio para que no suene nada anterior
        pausarMusica();            // Detenemos los motores de audio nativos
        
        // Activamos visualmente el botón de play y los carretes por pura estética de que "está corriendo"
        carreteIzq.classList.add("girando");
        carreteDer.classList.add("girando");
        btnPlayPause.querySelector(".fa-play").style.display = "none";
        btnPlayPause.querySelector(".fa-pause").style.display = "inline-block";
        btnPlayPause.classList.add("activo");

        // Pintamos el mensaje en la pantalla
        desplegarMensajeAmigos(cancionActual.mensaje);
    } else {
        // Si es una canción normal, quitamos el cartel y cargamos el mp3 de forma tradicional
        removerMensajeAmigos();
        reproductorAudio.src = cancionActual.src;
        reproducirMusica();
    }
}

function reproducirMusica() {
    if (!estaEncendido) return; 

    // Si es el Easter Egg, reproducirMusica actúa de forma visual
    if (listaCanciones[indiceActual].isEasterEgg) {
        carreteIzq.classList.add("girando");
        carreteDer.classList.add("girando");
        btnPlayPause.querySelector(".fa-play").style.display = "none";
        btnPlayPause.querySelector(".fa-pause").style.display = "inline-block";
        btnPlayPause.classList.add("activo");
        return;
    }

    reproductorAudio.play().then(() => {
        carreteIzq.classList.add("girando");
        carreteDer.classList.add("girando");
        
        btnPlayPause.querySelector(".fa-play").style.display = "none";
        btnPlayPause.querySelector(".fa-pause").style.display = "inline-block";
        btnPlayPause.classList.add("activo");
    }).catch(err => console.log("Verifica las rutas de tus archivos mp3"));
}

function pausarMusica() {
    reproductorAudio.pause();
    carreteIzq.classList.remove("girando");
    carreteDer.classList.remove("girando");
    
    btnPlayPause.querySelector(".fa-play").style.display = "inline-block";
    btnPlayPause.querySelector(".fa-pause").style.display = "none";
    btnPlayPause.classList.remove("activo");
}

// INTERRUPTOR GENERAL DE ENERGÍA (BOTÓN POWER / STOP)
btnStop.addEventListener("click", () => {
    estaEncendido = !estaEncendido;

    if (estaEncendido) {
        ledEstadoPower.classList.add("led-verde");
        console.log("Casetera Encendida - Luz Verde");
    } else {
        ledEstadoPower.classList.remove("led-verde");
        
        pausarMusica();
        removerMensajeAmigos(); // Limpiamos el mensaje si se apaga el aparato
        reproductorAudio.currentTime = 0;
        menuPlaylist.style.display = "none"; 
        console.log("Casetera Apagada - Luz Roja");
    }
});

// EVENTOS DE LOS CONTROLES MECÁNICOS
btnPlayPause.addEventListener("click", () => {
    if (!estaEncendido) return; 

    const cancionActual = listaCanciones[indiceActual];

    if (cancionActual.isEasterEgg) {
        // Lógica visual de play/pause exclusiva para el Easter Egg
        if (carreteIzq.classList.contains("girando")) {
            carreteIzq.classList.remove("girando");
            carreteDer.classList.remove("girando");
            btnPlayPause.querySelector(".fa-play").style.display = "inline-block";
            btnPlayPause.querySelector(".fa-pause").style.display = "none";
            btnPlayPause.classList.remove("activo");
        } else {
            reproducirMusica();
        }
    } else {
        // Lógica de audio normal
        if (!reproductorAudio.src) {
            seleccionarCancion(0);
        } else if (reproductorAudio.paused) {
            reproducirMusica();
        } else {
            pausarMusica();
        }
    }
});

btnRewind.addEventListener("click", () => {
    if (!estaEncendido) return;
    reproductorAudio.currentTime = 0;
});

btnShuffle.addEventListener("click", () => {
    if (!estaEncendido) return;
    let nuevoIndice;
    do {
        nuevoIndice = Math.floor(Math.random() * listaCanciones.length);
    } while (nuevoIndice === indiceActual && listaCanciones.length > 1);
    seleccionarCancion(nuevoIndice);
});

btnPlaylist.addEventListener("click", () => {
    if (!estaEncendido) return;
    
    if (menuPlaylist.style.display === "block") {
        menuPlaylist.style.display = "none";
    } else {
        menuPlaylist.style.display = "block";
    }
});

reproductorAudio.addEventListener("ended", () => {
    pausarMusica();
});

// FUNCIONES PARA CONTROLAR EL DISPLAY DIGITAL DEL EASTER EGG
function desplegarMensajeAmigos(texto) {
    removerMensajeAmigos();

    const capaMensaje = document.createElement("div");
    capaMensaje.id = "easter-egg-display";
    capaMensaje.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 10, 0.94);
        color: #00ff66;
        font-family: monospace;
        font-size: 11px;
        padding: 12px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 12px;
        z-index: 10;
        line-height: 1.4;
    `;
    capaMensaje.innerText = `"${texto}"`;
    
    if (seccionVentana) {
        seccionVentana.style.position = "relative";
        seccionVentana.appendChild(capaMensaje);
    }
}

function removerMensajeAmigos() {
    const capaExistente = document.getElementById("easter-egg-display");
    if (capaExistente) {
        capaExistente.remove();
    }
}

// Inicialización de la interfaz
cargarPlaylistVisual();