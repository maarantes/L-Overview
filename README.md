# 🎹 Lyrics Overview

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)

**L-Overview** é um software que exibe a linha atual da letra da música que você está ouvindo no **Spotify**. Ele funciona obtendo a música atual através da API do Spotify e sincronizando a letra com base no tempo da faixa. <br> Isso é possível graças ao pacote [SyncedLyrics](https://github.com/moehmeni/syncedlyrics), que pesquisa por arquivos LRC da música atual nos principais bancos de dados da internet.

<br>

## ⚙️ Instalação e Configuração

### 1️⃣ Criando um App no Spotify Developer Dashboard

Para utilizar o **L-Overview**, você precisa de credenciais da API da sua conta do Spotify:

01. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
02. Faça login com sua conta Spotify.
03. Clique em **Create an App** e forneça qualquer nome e descrição para o app.
04. No campo **Redirect URIs**, adicione:
<pre><code>http://localhost:8888/callback</pre></code>
05. Copie os valores de **Client ID** e **Client Secret**.

<br>

### 2️⃣ Configurando o Backend

1. Clone este repositório e vá para a pasta backend:

<pre><code>git clone https://github.com/maarantes/L-Overview.git
cd L-Overview/backend</code></pre>

2. Instale as dependências:
<pre><code>pip install -r requirements.txt</code></pre>

3. Edite o arquivo backend/main.py e substitua os valores:
<pre><code>SPOTIFY_CLIENT_ID = "[COLE-AQUI]"
SPOTIFY_CLIENT_SECRET = "[COLE-AQUI]"</code></pre>
pelos IDs que você pegou no Dashboard do Spotify.

4. Inicie o servidor Flask
<pre><code>python main.py</code></pre>

<br>

### 3️⃣ Configurando o Frontend

1. Vá para a pasta frontend:
<pre><code>cd frontend</code></pre>

2. Instale as dependências do NodeJS:
<pre><code>npm install</code></pre>

3. Inicie o Frontend:
<pre><code>npm run dev</code></pre>

<br>

### 🛠️ Contribuição

Este é um projeto open-source, então qualquer pessoa pode contribuir. Se quiser ajudar, faça um fork do repositório, crie uma nova branch, commite e depois abra um Pull Request no repositório principal.

### 📜 Licença

Este projeto é distribuído sob a licença MIT. Sinta-se livre para usá-lo e modificá-lo como quiser.
