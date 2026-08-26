// ============================================================
// 📻 GALOULOURADIO — SCRIPT.JS
// 🎵 LECTEUR + CATALOGUE MUSICAL + RADIO AUTOMATIQUE
// 🔐 FIREBASE AUTHENTICATION
// ============================================================


// ============================================================
// 🔥 FIREBASE
// ============================================================

import { auth } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ============================================================
// 🔵 GOOGLE
// ============================================================

const googleProvider =
    new GoogleAuthProvider();


// ============================================================
// 📌 ÉLÉMENTS HTML
// ============================================================

const googleLoginButton =
    document.getElementById("googleLoginButton");

const audio =
    document.getElementById("radioAudio");

const playButton =
    document.getElementById("playButton");

const mainPlay =
    document.getElementById("mainPlay");

const nextButton =
    document.getElementById("nextButton");

const currentTitle =
    document.getElementById("currentTitle");

const currentArtist =
    document.getElementById("currentArtist");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const volumeBar =
    document.getElementById("volumeBar");

const radioStatus =
    document.getElementById("radioStatus");

const playlistButtons =
    document.querySelectorAll(".playlist-button");


// ============================================================
// 🎵 CATALOGUE MUSICAL
// ============================================================
//
// Tous les fichiers doivent se trouver dans :
// music/
//
// Le navigateur ne télécharge pas tout le catalogue.
// Le morceau est chargé lorsqu'il doit être joué.
//
// ============================================================

const catalogueMusical = [

    // --------------------------------------------------------
    // 🔥 HITS
    // --------------------------------------------------------

    {
        id: "music2",
        title: "Le Site sera prêt à Noël 2026 ! 🎄",
        artist: "GaloulouStudio",
        file: "music/music2.mp3",
        playlists: ["hits"]
    },

    {
        id: "music1",
        title: "Music 1",
        artist: "GaloulouRadio",
        file: "music/music1.mp3",
        playlists: ["hits", "night", "chill"]
    },

    {
        id: "the-mountain-phonk-496452",
        title: "The Mountain Phonk",
        artist: "The_Mountain",
        file: "music/the_mountain-phonk-496452.mp3",
        playlists: ["hits", "night"]
    },

    {
        id: "the-mountain-phonk-483828",
        title: "The Mountain Phonk Music",
        artist: "The_Mountain",
        file: "music/the_mountain-phonk-phonk-music-483828.mp3",
        playlists: ["hits"]
    },

    {
        id: "alex-morgan-brazilian-phonk-573874",
        title: "Brazilian Phonk Bounce Beat",
        artist: "Alex Morgan",
        file: "music/alex-morgan-brazilian-phonk-bounce-beat-573874.mp3",
        playlists: ["hits", "night"]
    },

    {
        id: "the-mountain-phonk-496450",
        title: "The Mountain Phonk Music",
        artist: "The_Mountain",
        file: "music/the_mountain-phonk-phonk-music-496450.mp3",
        playlists: ["hits", "night"]
    },


    // --------------------------------------------------------
    // ☀️ MORNING
    // --------------------------------------------------------

    {
        id: "kulakovka-chill",
        title: "Chill",
        artist: "Kulakovka",
        file: "music/kulakovka-chill-reel-570198.mp3",
        playlists: ["morning", "chill", "night"]
    },

    {
        id: "kulakovka-lofi",
        title: "Réveil Doux",
        artist: "Kulakovka",
        file: "music/kulakovka-lofi-relax-570489.mp3",
        playlists: ["morning", "chill"]
    },

    {
        id: "mickeyscat-moment-of-peace",
        title: "Moment of Peace",
        artist: "MickeysCat",
        file: "music/mickeyscat-moment-of-peace-mickeyscat-554494.mp3",
        playlists: ["morning", "chill", "night"]
    },

    {
        id: "mickeyscat-moment-of-peace-1",
        title: "Moment of Peace",
        artist: "MickeysCat",
        file: "music/mickeyscat-moment-of-peace-mickeyscat-554494(1).mp3",
        playlists: ["chill"]
    }
];


// ============================================================
// 📻 PLAYLISTS
// ============================================================

const playlists = {
    hits: [],
    morning: [],
    night: [],
    chill: []
};


// ============================================================
// 🔄 CONSTRUCTION AUTOMATIQUE DES PLAYLISTS
// ============================================================

catalogueMusical.forEach((song) => {

    if (!Array.isArray(song.playlists)) {
        return;
    }

    song.playlists.forEach((playlistName) => {

        if (playlists[playlistName]) {
            playlists[playlistName].push(song);
        }

    });

});


// ============================================================
// 📊 INFORMATIONS DU CATALOGUE
// ============================================================

console.log(
    "🎵 Catalogue musical chargé :",
    catalogueMusical.length,
    "morceaux"
);

console.log(
    "🔥 Hits :",
    playlists.hits.length
);

console.log(
    "☀️ Morning :",
    playlists.morning.length
);

console.log(
    "🌙 Night :",
    playlists.night.length
);

console.log(
    "🎶 Chill :",
    playlists.chill.length
);


// ============================================================
// 🤖 RADIO AUTOMATIQUE
// ============================================================

let radioPlaylist =
    playlists.hits;

let currentPlaylist =
    playlists.hits;

let currentIndex =
    0;

let isPlaying =
    false;

let radioStarted =
    false;

let shuffleMode =
    true;


// ============================================================
// 🕐 FORMAT DU TEMPS
// ============================================================

function formatTime(seconds) {

    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondes =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        secondes
            .toString()
            .padStart(2, "0")
    );
}


// ============================================================
// 🎲 MÉLANGE
// ============================================================

function shuffleArray(array) {

    const copy =
        [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[i]
        ];
    }

    return copy;
}


// ============================================================
// 🎵 CHOISIR LA PROCHAINE MUSIQUE
// ============================================================

function getNextIndex() {

    if (
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {
        return 0;
    }

    if (
        currentPlaylist.length === 1
    ) {
        return 0;
    }

    if (shuffleMode) {

        let nextIndex;

        do {

            nextIndex =
                Math.floor(
                    Math.random() *
                    currentPlaylist.length
                );

        } while (
            nextIndex === currentIndex
        );

        return nextIndex;
    }

    return (
        currentIndex + 1
    ) % currentPlaylist.length;
}


// ============================================================
// 🎵 CHARGER UNE MUSIQUE
// ============================================================

function loadSong(index, autoPlay = false) {

    if (
        !audio ||
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {

        if (currentTitle) {
            currentTitle.textContent =
                "Aucune musique disponible";
        }

        if (currentArtist) {
            currentArtist.textContent =
                "Le catalogue est vide.";
        }

        return;
    }

    currentIndex =
        Math.max(
            0,
            Math.min(
                index,
                currentPlaylist.length - 1
            )
        );

    const song =
        currentPlaylist[currentIndex];

    audio.src =
        song.file;

    audio.load();

    if (currentTitle) {
        currentTitle.textContent =
            song.title;
    }

    if (currentArtist) {
        currentArtist.textContent =
            song.artist;
    }

    if (progressBar) {
        progressBar.value =
            0;
    }

    if (currentTime) {
        currentTime.textContent =
            "0:00";
    }

    if (duration) {
        duration.textContent =
            "0:00";
    }

    if (radioStatus) {
        radioStatus.textContent =
            "🤖 PROGRAMME AUTOMATIQUE";
    }

    if (autoPlay) {
        playRadio();
    }
}


// ============================================================
// ▶️ LECTURE
// ============================================================

async function playRadio() {

    if (!audio) {
        return;
    }

    try {

        if (!audio.src) {
            loadSong(
                currentIndex
            );
        }

        await audio.play();

        isPlaying =
            true;

        radioStarted =
            true;

        updatePlayer();

        if (radioStatus) {
            radioStatus.textContent =
                "🔴 EN LECTURE · PROGRAMME AUTOMATIQUE";
        }

    } catch (error) {

        isPlaying =
            false;

        updatePlayer();

        console.error(
            "❌ Lecture audio impossible :",
            error
        );

    }
}


// ============================================================
// ⏸️ PAUSE
// ============================================================

function pauseRadio() {

    if (!audio) {
        return;
    }

    audio.pause();

    isPlaying =
        false;

    updatePlayer();

    if (radioStatus) {
        radioStatus.textContent =
            "⏸️ RADIO EN PAUSE";
    }
}


// ============================================================
// 🔄 INTERFACE DU LECTEUR
// ============================================================

function updatePlayer() {

    if (playButton) {

        playButton.textContent =
            isPlaying
                ? "⏸ Mettre en pause"
                : "▶ Écouter GaloulouRadio";
    }

    if (mainPlay) {

        mainPlay.textContent =
            isPlaying
                ? "⏸"
                : "▶";
    }
}


// ============================================================
// ⏭️ MUSIQUE SUIVANTE
// ============================================================

function nextSong() {

    if (
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {
        return;
    }

    currentIndex =
        getNextIndex();

    loadSong(
        currentIndex,
        true
    );
}


// ============================================================
// ⏮️ MUSIQUE PRÉCÉDENTE
// ============================================================

function previousSong() {

    if (
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {
        return;
    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex =
            currentPlaylist.length - 1;
    }

    loadSong(
        currentIndex,
        true
    );
}


// ============================================================
// ▶️ BOUTON PLAY PRINCIPAL
// ============================================================

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


// ============================================================
// ▶️ BOUTON DU LECTEUR
// ============================================================

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


// ============================================================
// ⏭️ BOUTON SUIVANT
// ============================================================

if (nextButton) {

    nextButton.addEventListener(
        "click",
        nextSong
    );
}


// ============================================================
// 🎧 BOUTONS PLAYLISTS
// ============================================================

playlistButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const playlistName =
                    button.dataset.playlist;

                if (
                    !playlists[playlistName]
                ) {

                    console.error(
                        "❌ Playlist inconnue :",
                        playlistName
                    );

                    return;
                }

                if (
                    playlists[playlistName].length === 0
                ) {

                    console.warn(
                        "⚠️ Cette playlist est vide :",
                        playlistName
                    );

                    return;
                }

                currentPlaylist =
                    shuffleMode
                        ? shuffleArray(
                            playlists[playlistName]
                        )
                        : playlists[playlistName];

                radioPlaylist =
                    currentPlaylist;

                currentIndex =
                    0;

                loadSong(
                    currentIndex,
                    true
                );

                console.log(
                    "📻 Playlist sélectionnée :",
                    playlistName,
                    currentPlaylist.length,
                    "morceaux"
                );
            }
        );
    }
);


// ============================================================
// 🔊 VOLUME
// ============================================================

if (volumeBar) {

    const savedVolume =
        Number(
            localStorage.getItem(
                "galoulouRadioVolume"
            )
        );

    const initialVolume =
        Number.isFinite(savedVolume) &&
        savedVolume >= 0 &&
        savedVolume <= 1
            ? savedVolume
            : 1;

    volumeBar.value =
        initialVolume;

    if (audio) {
        audio.volume =
            initialVolume;
    }

    volumeBar.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    volumeBar.value
                );

            if (audio) {
                audio.volume =
                    volume;
            }

            localStorage.setItem(
                "galoulouRadioVolume",
                volume.toString()
            );
        }
    );
}


// ============================================================
// ⏱️ DURÉE DE LA MUSIQUE
// ============================================================

if (audio) {

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (duration) {

                duration.textContent =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );
}


// ============================================================
// 📈 PROGRESSION
// ============================================================

if (audio) {

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !Number.isFinite(
                    audio.duration
                ) ||
                audio.duration <= 0
            ) {
                return;
            }

            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            if (progressBar) {
                progressBar.value =
                    percentage;
            }

            if (currentTime) {
                currentTime.textContent =
                    formatTime(
                        audio.currentTime
                    );
            }

            if (duration) {
                duration.textContent =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );
}


// ============================================================
// 🎚️ BARRE DE PROGRESSION
// ============================================================

if (progressBar) {

    progressBar.addEventListener(
        "input",
        () => {

            if (
                !audio ||
                !Number.isFinite(
                    audio.duration
                ) ||
                audio.duration <= 0
            ) {
                return;
            }

            audio.currentTime =
                (
                    Number(
                        progressBar.value
                    ) / 100
                ) *
                audio.duration;
        }
    );
}


// ============================================================
// 🎵 MUSIQUE TERMINÉE
// ============================================================

if (audio) {

    audio.addEventListener(
        "ended",
        () => {

            isPlaying =
                false;

            updatePlayer();

            nextSong();
        }
    );
}


// ============================================================
// ❌ ERREUR AUDIO
// ============================================================

if (audio) {

    audio.addEventListener(
        "error",
        () => {

            isPlaying =
                false;

            updatePlayer();

            if (currentTitle) {
                currentTitle.textContent =
                    "Erreur audio ❌";
            }

            if (currentArtist) {
                currentArtist.textContent =
                    "Impossible de charger ce morceau.";
            }

            if (radioStatus) {
                radioStatus.textContent =
                    "⚠️ ERREUR DE LECTURE";
            }

            console.error(
                "❌ Impossible de charger :",
                audio.src
            );
        }
    );
}


// ============================================================
// 🔐 CONNEXION GOOGLE
// ============================================================

async function connecterAvecGoogle() {

    if (auth.currentUser) {
        return;
    }

    try {

        console.log(
            "🔵 Connexion Google..."
        );

        await signInWithPopup(
            auth,
            googleProvider
        );

        console.log(
            "✅ Connexion Google réussie."
        );

    } catch (error) {

        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            console.log(
                "ℹ️ Fenêtre Google fermée."
            );

            return;
        }

        if (
            error.code ===
            "auth/cancelled-popup-request"
        ) {

            console.log(
                "ℹ️ Une connexion Google est déjà en cours."
            );

            return;
        }

        if (
            error.code ===
            "auth/unauthorized-domain"
        ) {

            console.error(
                "❌ Le domaine du site n'est pas autorisé dans Firebase."
            );

            return;
        }

        console.error(
            "❌ Connexion Google impossible :",
            error
        );
    }
}


// ============================================================
// 🚪 DÉCONNEXION
// ============================================================

async function deconnecter() {

    try {

        await signOut(
            auth
        );

        console.log(
            "🚪 Déconnexion réussie."
        );

    } catch (error) {

        console.error(
            "❌ Déconnexion impossible :",
            error
        );
    }
}


// ============================================================
// 🔵 BOUTON COMPTE
// ============================================================

function mettreAJourBoutonCompte(user) {

    if (!googleLoginButton) {
        return;
    }

    googleLoginButton.replaceWith(
        googleLoginButton.cloneNode(true)
    );

    const button =
        document.getElementById(
            "googleLoginButton"
        );

    if (!button) {
        return;
    }

    if (user) {

        button.textContent =
            "👤 Mon compte · Déconnexion";

        button.addEventListener(
            "click",
            deconnecter
        );

    } else {

        button.textContent =
            "🔵 Se connecter avec Google";

        button.addEventListener(
            "click",
            connecterAvecGoogle
        );
    }
}


// ============================================================
// 👤 ÉTAT FIREBASE
// ============================================================

onAuthStateChanged(
    auth,
    (user) => {

        mettreAJourBoutonCompte(
            user
        );

        if (user) {

            console.log(
                "👤 Compte connecté."
            );

        } else {

            console.log(
                "🚪 Aucun compte connecté."
            );
        }
    }
);


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

if (
    currentPlaylist &&
    currentPlaylist.length > 0
) {

    loadSong(
        0,
        false
    );
}

updatePlayer();

if (audio) {

    if (
        volumeBar
    ) {

        audio.volume =
            Number(
                volumeBar.value
            );

    } else {

        audio.volume =
            1;
    }
}

console.log(
    "📻 GaloulouRadio démarré."
);

console.log(
    "🎵",
    catalogueMusical.length,
    "morceaux dans le catalogue."
);

console.log(
    "🔥 Firebase Authentication chargé."
);
