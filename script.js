// ============================================================
// 🎵 GALOULOURADIO - LECTEUR AUTOMATIQUE
// ============================================================

// Éléments du site
const playButton = document.getElementById("playButton");
const mainPlay = document.getElementById("mainPlay");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const radioAudio = document.getElementById("radioAudio");

const playlistButtons = document.querySelectorAll(".playlist-button");

// ============================================================
// 🎶 TES MUSIQUES
// ============================================================
//
// IMPORTANT :
// Mets tes fichiers MP3 dans un dossier "music"
// à côté de index.html.
//
// Exemple :
//
// music/
//   musique1.mp3
//   musique2.mp3
//   musique3.mp3
//
// Puis ajoute-les ici.
//
// ============================================================

const playlists = {

    hits: [
        {
            title: "Musique 1",
            artist: "GaloulouRadio",
            file: "music/musique1.mp3"
        },
        {
            title: "Musique 2",
            artist: "GaloulouRadio",
            file: "music/musique2.mp3"
        }
    ],

    morning: [
        {
            title: "Morning 1",
            artist: "GaloulouRadio",
            file: "music/musique1.mp3"
        },
        {
            title: "Morning 2",
            artist: "GaloulouRadio",
            file: "music/musique2.mp3"
        }
    ],

    night: [
        {
            title: "Night 1",
            artist: "GaloulouRadio",
            file: "music/musique2.mp3"
        },
        {
            title: "Night 2",
            artist: "GaloulouRadio",
            file: "music/musique1.mp3"
        }
    ],

    chill: [
        {
            title: "Chill 1",
            artist: "GaloulouRadio",
            file: "music/musique1.mp3"
        },
        {
            title: "Chill 2",
            artist: "GaloulouRadio",
            file: "music/musique2.mp3"
        }
    ]

};


// ============================================================
// ⚙️ VARIABLES
// ============================================================

let currentPlaylist = playlists.hits;
let currentIndex = 0;
let playing = false;


// ============================================================
// 🎵 CHARGER UNE MUSIQUE
// ============================================================

function loadSong(index) {

    if (!currentPlaylist || currentPlaylist.length === 0) {
        return;
    }

    currentIndex = index;

    const song = currentPlaylist[currentIndex];

    radioAudio.src = song.file;

    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;

}


// ============================================================
// ▶️ DÉMARRER
// ============================================================

async function startRadio() {

    try {

        await radioAudio.play();

        playing = true;

        updateButtons();

    } catch (error) {

        console.log("Impossible de lancer la musique :", error);

        currentTitle.textContent = "Impossible de lancer la musique";
        currentArtist.textContent =
            "Vérifie que le fichier MP3 existe dans le dossier music.";

    }

}


// ============================================================
// ⏸️ ARRÊTER
// ============================================================

function stopRadio() {

    radioAudio.pause();

    playing = false;

    updateButtons();

}


// ============================================================
// 🔘 METTRE À JOUR LES BOUTONS
// ============================================================

function updateButtons() {

    if (playing) {

        if (playButton) {
            playButton.textContent = "⏸ Mettre en pause";
        }

        if (mainPlay) {
            mainPlay.textContent = "⏸";
        }

    } else {

        if (playButton) {
            playButton.textContent = "▶ Écouter GaloulouRadio";
        }

        if (mainPlay) {
            mainPlay.textContent = "▶";
        }

    }

}


// ============================================================
// 🎵 MUSIQUE SUIVANTE
// ============================================================

function nextSong() {

    if (!currentPlaylist || currentPlaylist.length === 0) {
        return;
    }

    currentIndex++;

    if (currentIndex >= currentPlaylist.length) {
        currentIndex = 0;
    }

    loadSong(currentIndex);

    startRadio();

}


// ============================================================
// ▶️ BOUTON PRINCIPAL
// ============================================================

if (playButton) {

    playButton.addEventListener("click", () => {

        if (playing) {

            stopRadio();

        } else {

            startRadio();

        }

    });

}


// ============================================================
// ▶️ BOUTON DU LECTEUR
// ============================================================

if (mainPlay) {

    mainPlay.addEventListener("click", () => {

        if (playing) {

            stopRadio();

        } else {

            startRadio();

        }

    });

}


// ============================================================
// 🎵 BOUTONS DES PLAYLISTS
// ============================================================

playlistButtons.forEach(button => {

    button.addEventListener("click", () => {

        const playlistName = button.dataset.playlist;

        if (!playlists[playlistName]) {
            console.log("Playlist inconnue :", playlistName);
            return;
        }

        currentPlaylist = playlists[playlistName];

        currentIndex = 0;

        loadSong(currentIndex);

        startRadio();

        // Retour vers le lecteur
        document.querySelector(".player-section")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    });

});


// ============================================================
// 🎶 PASSER AUTOMATIQUEMENT À LA MUSIQUE SUIVANTE
// ============================================================

radioAudio.addEventListener("ended", () => {

    nextSong();

});


// ============================================================
// ⚠️ ERREUR DE LECTURE
// ============================================================

radioAudio.addEventListener("error", () => {

    playing = false;

    updateButtons();

    currentTitle.textContent = "Erreur audio ❌";

    currentArtist.textContent =
        "Le fichier musical est introuvable ou ne peut pas être lu.";

});


// ============================================================
// 🚀 INITIALISATION
// ============================================================

loadSong(0);

updateButtons();
