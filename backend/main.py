from flask import Flask, jsonify
import spotipy
import syncedlyrics
from spotipy.oauth2 import SpotifyOAuth
import time

app = Flask(__name__)

SPOTIFY_CLIENT_ID = "[COLE-AQUI]"
SPOTIFY_CLIENT_SECRET = "[COLE-AQUI]"
SPOTIFY_REDIRECT_URI = "http://localhost:8888/callback"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri=SPOTIFY_REDIRECT_URI,
    scope="user-read-playback-state user-read-currently-playing"
))

lyrics_cache = {}

lyrics_dict = {}
last_song = None

def get_current_song():

    try:
        current = sp.current_playback()

        if current and current.get("item"):
            song = current["item"]["name"]
            artist = current["item"]["artists"][0]["name"]
            progress = current.get("progress_ms", 0) // 1000
            is_playing = current.get("is_playing", False)
            
            print(f"Tocando agora: {song} - {artist} | {progress}")

            return song, artist, progress, is_playing

        print("Nenhuma música tocando.")
        return None, None, None, None 
    except Exception as e:
        print("Erro ao obter a música atual:", e)
        return None, None, None, None

def get_synced_lyrics(song, artist):

    global lyrics_cache

    # Se a letra já foi carregada antes, retorna do cache
    if (song, artist) in lyrics_cache:
        return lyrics_cache[(song, artist)]

    search_term = f"{artist} {song}"
    print(f"🔍 Buscando letra para: {search_term}")
    
    lrc_content = syncedlyrics.search(search_term)

    # Se não encontrar letra, retorna um dicionário vazio
    if not lrc_content:
        print(f"❌ Letra não encontrada para {song} - {artist}")
        return {}

    # Converte o conteúdo LRC em um dicionário de timestamps
    parsed_lyrics = {}
    lines = lrc_content.split("\n")

    for line in lines:
        line = line.strip()
        if not line:
            continue

        parts = line.split("]")
        if len(parts) < 2:
            continue

        timestamp = parts[0].replace("[", "").strip()
        if ":" in timestamp:
            try:
                minutes, seconds = map(float, timestamp.split(":"))
                total_seconds = int(minutes) * 60 + int(seconds)
                parsed_lyrics[total_seconds] = parts[1].strip()
            except ValueError:
                continue  # Ignora linhas com timestamps inválidos

    # Salva no cache para evitar novas buscas desnecessárias
    lyrics_cache[(song, artist)] = parsed_lyrics
    print(f"Letra sincronizada carregada ({len(parsed_lyrics)} linhas)")

    return parsed_lyrics

@app.route("/current-song", methods=["GET"])
def current_song():
    global last_song, lyrics_dict
    song, artist, progress, is_playing = get_current_song()

    if not song:
        return jsonify({"status": "No song playing", "is_playing": False})

    # Só busca nova letra se a música mudou
    if last_song != song:
        print(f"🎵 Nova música detectada: {song} - {artist}")
        lyrics_dict = get_synced_lyrics(song, artist)
        last_song = song

    # Determinar a linha da letra correta
    current_lyric = "♪"
    if lyrics_dict:
        for timestamp in sorted(lyrics_dict.keys()):
            if timestamp <= progress:
                current_lyric = lyrics_dict[timestamp]

    return jsonify({
        "song": song,
        "artist": artist,
        "lyrics": current_lyric,
        "is_playing": is_playing
    })

if __name__ == "__main__":
    app.run(port=5000)