let lastSong = null; // Guarda a última música para evitar atualizações desnecessárias

async function fetchLyrics() {
    console.log("Tentando buscar a música...");

    try {
        let response = await fetch("http://localhost:5000/current-song");
        let data = await response.json();

        console.log("API retornou:", data);

        let songNameElem = document.getElementById("song_name");
        let songArtistElem = document.getElementById("song_artist");
        let lyricsElem = document.getElementById("lyrics");

        if (!songNameElem || !songArtistElem || !lyricsElem) {
            console.error("ERRO: Elementos HTML não encontrados!");
            return;
        }

        if (data.status === "No song playing") {
            songNameElem.innerText = "Nenhuma música tocando";
            songArtistElem.innerText = "";
            lyricsElem.innerText = "♪";
            lastSong = null;
            return;
        }

        let displaySong = data.song;
        if (!data.is_playing) {
            displaySong += " (PAUSADO)";
        }

        if (lastSong !== displaySong) {
            console.log(`🎵 Atualizando para: ${displaySong}`);
            songNameElem.innerText = displaySong;
            songArtistElem.innerText = data.artist;
            lastSong = displaySong;
        }

        lyricsElem.innerText = data.lyrics;
    } catch (error) {
        console.error("Erro ao buscar a música:", error);
    }
}

const iconeArrastar = document.querySelector(".icone_arrastar");
let isDragging = false;
let startX, startY, startWindowX, startWindowY;

iconeArrastar.addEventListener("mousedown", (event) => {
    event.preventDefault();

    isDragging = true;
    startX = event.screenX;
    startY = event.screenY;

    // Obtém a posição inicial da janela corretamente
    const { x, y } = window.electron.getWindowBounds();
    startWindowX = x;
    startWindowY = y;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(event) {
    if (!isDragging) return;

    // Calcula deslocamento relativo ao ponto inicial
    const offsetX = event.screenX - startX;
    const offsetY = event.screenY - startY;

    // Move a janela sem alterar width e height
    window.electron.moveWindow(startWindowX + offsetX, startWindowY + offsetY);
}

function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

const iconeConfig = document.querySelector(".icone_config");
iconeConfig.addEventListener("click", () => {
    window.electron.openSettings();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Iniciando atualização automática da música...");
    fetchLyrics();
    setInterval(fetchLyrics, 250);
});