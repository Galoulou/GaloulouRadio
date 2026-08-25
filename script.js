// ============================================================
// 📻 GALOULOURADIO - LECTEUR
// ============================================================

// ------------------------------------------------------------
// ÉLÉMENTS HTML
// ------------------------------------------------------------

const audio = document.getElementById("radioAudio");

const playButton = document.getElementById("playButton");
const mainPlay = document.getElementById("mainPlay");
const nextButton = document.getElementById("nextButton");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeBar = document.getElementById("volumeBar");

const radioStatus = document.getElementById("radioStatus");

const playlistButtons =
    document.querySelectorAll(".playlist-button");


// ------------------------------------------------------------
// 🎵 TES MUSIQUES
// ------------------------------------------------------------

const playlists = {

    hits: [

        {
            title: "Le Site sera prêt en Noel 2026 !",
            artist: "GaloulouStudio",
            file: "music/music2.mp3"
        },

        {
            title: "Music 1",
            artist: "GaloulouRadio",
            file: "music/music1.mp3"
        }

    ],


    // Pour l'instant on utilise les mêmes musiques.
    // On pourra créer de vraies playlists plus tard.

    morning: [

        {
            title: "Chill",
            artist: "Kulakovka",
            file: "music/kulakovka-chill-reel-570198.mp3"
        },

        {
            title: "Reveille Doux",
            artist: "Kulakovka",
            file: "music/kulakovka-lofi-relax-570489.mp3"
        }

    ],


    night: [

        {
            title: "Music 1",
            artist: "GaloulouRadio",
            file: "music/music1.mp3"
        },

        {
            title: "Chill",
            artist: "Kulakovka",
            file: "music/kulakovka-chill-reel-570198.mp3"
        }

    ],


    chill: [

        {
            title: "Chill",
            artist: "Kulakovka",
            file: "music/kulakovka-chill-reel-570198.mp3"
        },

        {
            title: "Music 1",
            artist: "GaloulouRadio",
            file: "music/music1.mp3"
        }

    ]

};


// ------------------------------------------------------------
// ⚙️ VARIABLES
// ------------------------------------------------------------

let currentPlaylist = playlists.hits;

let currentIndex = 0;

let isPlaying = false;


// ------------------------------------------------------------
// 🕐 FORMAT DU TEMPS
// ------------------------------------------------------------

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}


// ------------------------------------------------------------
// 🎵 CHARGER UNE MUSIQUE
// ------------------------------------------------------------

function loadSong(index) {

    if (
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {
        return;
    }

    currentIndex = index;

    const song = currentPlaylist[currentIndex];

    audio.src = song.file;

    currentTitle.textContent = song.title;

    currentArtist.textContent = song.artist;

    progressBar.value = 0;

    currentTime.textContent = "0:00";

    duration.textContent = "0:00";
}


// ------------------------------------------------------------
// ▶️ LECTURE
// ------------------------------------------------------------

async function playRadio() {

    try {

        await audio.play();

        isPlaying = true;

        updatePlayer();

        radioStatus.textContent =
            "🤖 PROGRAMME AUTOMATIQUE";

    } catch (error) {

        console.error(
            "Erreur de lecture audio :",
            error
        );

        currentTitle.textContent =
            "Lecture impossible ❌";

        currentArtist.textContent =
            "Vérifie ton fichier MP3.";

    }

}


// ------------------------------------------------------------
// ⏸️ PAUSE
// ------------------------------------------------------------

function pauseRadio() {

    audio.pause();

    isPlaying = false;

    updatePlayer();

}


// ------------------------------------------------------------
// 🔄 BOUTONS
// ------------------------------------------------------------

function updatePlayer() {

    if (isPlaying) {

        playButton.textContent =
            "⏸ Mettre en pause";

        mainPlay.textContent = "⏸";

    } else {

        playButton.textContent =
            "▶ Écouter GaloulouRadio";

        mainPlay.textContent = "▶";

    }

}


// ------------------------------------------------------------
// ⏭️ MUSIQUE SUIVANTE
// ------------------------------------------------------------

function nextSong() {

    if (
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {
        return;
    }

    currentIndex++;

    if (
        currentIndex >=
        currentPlaylist.length
    ) {

        currentIndex = 0;

    }

    loadSong(currentIndex);

    playRadio();

}


// ------------------------------------------------------------
// 🎵 BOUTON PRINCIPAL
// ------------------------------------------------------------

if (playButton) {

    playButton.addEventListener(
        "click",
        () => {

            if (isPlaying) {

                pauseRadio();

            } else {

                playRadio();

            }

        }
    );

}


// ------------------------------------------------------------
// 🎵 BOUTON DU LECTEUR
// ------------------------------------------------------------

if (mainPlay) {

    mainPlay.addEventListener(
        "click",
        () => {

            if (isPlaying) {

                pauseRadio();

            } else {

                playRadio();

            }

        }
    );

}


// ------------------------------------------------------------
// ⏭️ BOUTON SUIVANT
// ------------------------------------------------------------

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            nextSong();

        }
    );

}


// ------------------------------------------------------------
// 🎧 PLAYLISTS
// ------------------------------------------------------------

playlistButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const playlistName =
                button.dataset.playlist;

            if (
                !playlists[playlistName]
            ) {

                console.error(
                    "Playlist inconnue :",
                    playlistName
                );

                return;
            }

            currentPlaylist =
                playlists[playlistName];

            currentIndex = 0;

            loadSong(currentIndex);

            playRadio();

        }
    );

});


// ------------------------------------------------------------
// 🔊 VOLUME
// ------------------------------------------------------------

if (volumeBar) {

    audio.volume =
        Number(volumeBar.value);

    volumeBar.addEventListener(
        "input",
        () => {

            audio.volume =
                Number(volumeBar.value);

        }
    );

}


// ------------------------------------------------------------
// ⏱️ DURÉE DE LA MUSIQUE
// ------------------------------------------------------------

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(audio.duration);

    }
);


// ------------------------------------------------------------
// 📈 PROGRESSION
// ------------------------------------------------------------

audio.addEventListener(
    "timeupdate",
    () => {

        if (!Number.isFinite(audio.duration)) {
            return;
        }

        const percentage =
            (audio.currentTime /
                audio.duration) * 100;

        progressBar.value =
            percentage;

        currentTime.textContent =
            formatTime(audio.currentTime);

        duration.textContent =
            formatTime(audio.duration);

    }
);


// ------------------------------------------------------------
// 🎚️ DÉPLACER LA BARRE
// ------------------------------------------------------------

if (progressBar) {

    progressBar.addEventListener(
        "input",
        () => {

            if (!Number.isFinite(audio.duration)) {
                return;
            }

            const newTime =
                (Number(progressBar.value) / 100)
                * audio.duration;

            audio.currentTime =
                newTime;

        }
    );

}


// ------------------------------------------------------------
// 🎵 MUSIQUE TERMINÉE
// ------------------------------------------------------------

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


// ------------------------------------------------------------
// ❌ ERREUR AUDIO
// ------------------------------------------------------------

audio.addEventListener(
    "error",
    () => {

        isPlaying = false;

        updatePlayer();

        currentTitle.textContent =
            "Erreur audio ❌";

        currentArtist.textContent =
            "Impossible de charger ce morceau. Le site sera prêt le 26/12/2026.";

    }
);


// ------------------------------------------------------------
// 🚀 DÉMARRAGE
// ------------------------------------------------------------

audio.volume = 1;

loadSong(0);

updatePlayer();
