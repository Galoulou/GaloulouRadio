// ============================================================
// 📻 GALOULOURADIO
// 🤖 RADIO AUTOMATIQUE
// 🎵 LECTEUR
// 🔐 FIREBASE AUTHENTICATION
// ============================================================


// ============================================================
// 🔥 FIREBASE
// ============================================================

import {
    auth
} from "./firebase.js";


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
    document.getElementById(
        "googleLoginButton"
    );


const audio =
    document.getElementById(
        "radioAudio"
    );


const playButton =
    document.getElementById(
        "playButton"
    );


const mainPlay =
    document.getElementById(
        "mainPlay"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


const currentTitle =
    document.getElementById(
        "currentTitle"
    );


const currentArtist =
    document.getElementById(
        "currentArtist"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const currentTime =
    document.getElementById(
        "currentTime"
    );


const duration =
    document.getElementById(
        "duration"
    );


const volumeBar =
    document.getElementById(
        "volumeBar"
    );


const radioStatus =
    document.getElementById(
        "radioStatus"
    );


const playlistButtons =
    document.querySelectorAll(
        ".playlist-button"
    );


// ============================================================
// 🎵 CATALOGUE MUSICAL — GALOULOURADIO
// ============================================================
//
// Pour ajouter une musique :
//
// {
//     id: "identifiant-unique",
//     title: "Nom du morceau",
//     artist: "Artiste",
//     file: "music/nom-du-fichier.mp3",
//     playlists: ["hits", "morning"]
// }
//
// playlists possibles :
// hits
// morning
// night
// chill
//
// ============================================================

const catalogueMusical = [

    // ========================================================
    // 🔥 HITS
    // ========================================================

    {
        id: "music2",
        title: "Le Site sera prêt en Noel 2026 !",
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


    // ========================================================
    // ☀️ MORNING
    // ========================================================

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
    }

];


// ============================================================
// 📻 CONSTRUCTION AUTOMATIQUE DES PLAYLISTS
// ============================================================

const playlists = {

    hits: [],
    morning: [],
    night: [],
    chill: []

};


// ============================================================
// 🔄 AJOUT DES MUSIQUES AUX PLAYLISTS
// ============================================================

catalogueMusical.forEach(
    song => {

        song.playlists.forEach(
            playlistName => {

                if (
                    playlists[playlistName]
                ) {

                    playlists[playlistName].push(
                        song
                    );

                }

            }
        );

    }
);


// ============================================================
// 📊 INFORMATIONS CATALOGUE
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
// 🤖 PROGRAMMATION AUTOMATIQUE
// ============================================================
//
// Pour l'instant la radio utilise la playlist "hits".
// Plus tard, cette partie pourra contenir 250+ musiques.
//
// Le navigateur ne charge PAS toutes les musiques.
// Il charge uniquement celle qui est actuellement jouée.
// ============================================================

let radioPlaylist =
    playlists.hits;


// ============================================================
// ⚙️ ÉTAT DE LA RADIO
// ============================================================

let currentIndex =
    0;


let isPlaying =
    false;


let radioStarted =
    false;


// ============================================================
// 🔐 CONNEXION GOOGLE
// ============================================================

async function connecterAvecGoogle() {

    if (
        auth.currentUser
    ) {

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

function mettreAJourBoutonCompte(
    user
) {

    if (
        !googleLoginButton
    ) {

        return;

    }


    googleLoginButton.removeEventListener(
        "click",
        connecterAvecGoogle
    );


    googleLoginButton.removeEventListener(
        "click",
        deconnecter
    );


    if (
        user
    ) {

        googleLoginButton.textContent =
            "👤 Mon compte · Déconnexion";


        googleLoginButton.addEventListener(
            "click",
            deconnecter
        );

    }

    else {

        googleLoginButton.textContent =
            "🔵 Se connecter avec Google";


        googleLoginButton.addEventListener(
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


        if (
            user
        ) {

            console.log(
                "👤 Compte connecté."
            );

        }

        else {

            console.log(
                "🚪 Aucun compte connecté."
            );

        }

    }
);


// ============================================================
// 🕐 FORMAT DU TEMPS
// ============================================================

function formatTime(
    seconds
) {

    if (
        !Number.isFinite(
            seconds
        )
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondes =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        secondes
            .toString()
            .padStart(
                2,
                "0"
            )
    );

}


// ============================================================
// 🎵 MUSIQUE ACTUELLE
// ============================================================

function getCurrentSong() {

    if (
        !radioPlaylist ||
        radioPlaylist.length === 0
    ) {

        return null;

    }


    return radioPlaylist[
        currentIndex
    ];

}


// ============================================================
// ⏭️ CALCULER LE PROCHAIN MORCEAU
// ============================================================

function getNextIndex() {

    if (
        !radioPlaylist ||
        radioPlaylist.length === 0
    ) {

        return 0;

    }


    const nextIndex =
        currentIndex + 1;


    if (
        nextIndex >=
        radioPlaylist.length
    ) {

        return 0;

    }


    return nextIndex;

}


// ============================================================
// 🎵 CHARGER UNE MUSIQUE
// ============================================================

function loadSong(
    index
) {

    if (
        !audio ||
        !radioPlaylist ||
        radioPlaylist.length === 0
    ) {

        return;

    }


    if (
        index < 0 ||
        index >= radioPlaylist.length
    ) {

        index = 0;

    }


    currentIndex =
        index;


    const song =
        getCurrentSong();


    if (
        !song
    ) {

        return;

    }


    // --------------------------------------------------------
    // 🎵 FICHIER AUDIO
    // --------------------------------------------------------

    audio.src =
        song.file;


    // --------------------------------------------------------
    // 📝 TITRE
    // --------------------------------------------------------

    if (
        currentTitle
    ) {

        currentTitle.textContent =
            song.title;

    }


    // --------------------------------------------------------
    // 👤 ARTISTE
    // --------------------------------------------------------

    if (
        currentArtist
    ) {

        currentArtist.textContent =
            song.artist;

    }


    // --------------------------------------------------------
    // 📊 PROGRESSION
    // --------------------------------------------------------

    if (
        progressBar
    ) {

        progressBar.value =
            0;

    }


    if (
        currentTime
    ) {

        currentTime.textContent =
            "0:00";

    }


    if (
        duration
    ) {

        duration.textContent =
            "0:00";

    }


    console.log(
        "🎵 Morceau chargé :",
        song.title
    );

}


// ============================================================
// 🤖 DÉMARRER LA RADIO AUTOMATIQUE
// ============================================================

async function startAutomaticRadio() {

    if (
        !audio
    ) {

        return;

    }


    if (
        !radioStarted
    ) {

        radioStarted =
            true;


        console.log(
            "🤖 Radio automatique démarrée."
        );

    }


    try {

        await audio.play();


        isPlaying =
            true;


        updatePlayer();


        if (
            radioStatus
        ) {

            radioStatus.textContent =
                "🤖 PROGRAMME AUTOMATIQUE";

        }


        console.log(
            "▶️ Lecture automatique :",
            getCurrentSong()?.title
        );


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
// ⏸️ PAUSE RADIO
// ============================================================

function pauseRadio() {

    if (
        !audio
    ) {

        return;

    }


    audio.pause();


    isPlaying =
        false;


    updatePlayer();


    console.log(
        "⏸️ Radio en pause."
    );

}


// ============================================================
// 🔄 INTERFACE DU LECTEUR
// ============================================================

function updatePlayer() {

    if (
        !playButton ||
        !mainPlay
    ) {

        return;

    }


    if (
        isPlaying
    ) {

        playButton.textContent =
            "⏸ Mettre en pause";


        mainPlay.textContent =
            "⏸";

    }

    else {

        playButton.textContent =
            "▶ Écouter GaloulouRadio";


        mainPlay.textContent =
            "▶";

    }

}


// ============================================================
// ⏭️ PASSER AU MORCEAU SUIVANT
// ============================================================

function nextSong(
    automatic = false
) {

    if (
        !radioPlaylist ||
        radioPlaylist.length === 0
    ) {

        return;

    }


    const nextIndex =
        getNextIndex();


    currentIndex =
        nextIndex;


    loadSong(
        currentIndex
    );


    console.log(
        automatic
            ? "🤖 Passage automatique au morceau suivant."
            : "⏭️ Morceau suivant."
    );


    // Si la radio était en lecture,
    // le nouveau morceau démarre immédiatement.

    if (
        isPlaying
    ) {

        startAutomaticRadio();

    }

}


// ============================================================
// ▶️ BOUTON PLAY PRINCIPAL
// ============================================================

if (
    playButton
) {

    playButton.addEventListener(
        "click",
        () => {

            if (
                isPlaying
            ) {

                pauseRadio();

            }

            else {

                startAutomaticRadio();

            }

        }
    );

}


// ============================================================
// ▶️ BOUTON DU LECTEUR
// ============================================================

if (
    mainPlay
) {

    mainPlay.addEventListener(
        "click",
        () => {

            if (
                isPlaying
            ) {

                pauseRadio();

            }

            else {

                startAutomaticRadio();

            }

        }
    );

}


// ============================================================
// ⏭️ BOUTON SUIVANT
// ============================================================

if (
    nextButton
) {

    nextButton.addEventListener(
        "click",
        () => {

            nextSong(
                false
            );

        }
    );

}


// ============================================================
// 🎧 CHANGEMENT DE PLAYLIST
// ============================================================

playlistButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const playlistName =
                    button.dataset.playlist;


                if (
                    !playlists[
                        playlistName
                    ]
                ) {

                    console.error(
                        "❌ Playlist inconnue :",
                        playlistName
                    );

                    return;

                }


                // ------------------------------------------------
                // Nouvelle programmation
                // ------------------------------------------------

                radioPlaylist =
                    playlists[
                        playlistName
                    ];


                currentIndex =
                    0;


                console.log(
                    "📻 Nouvelle programmation :",
                    playlistName
                );


                loadSong(
                    currentIndex
                );


                startAutomaticRadio();

            }
        );

    }
);


// ============================================================
// 🔊 VOLUME
// ============================================================

if (
    volumeBar
) {

    volumeBar.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    volumeBar.value
                );


            if (
                audio
            ) {

                audio.volume =
                    volume;

            }

        }
    );

}


// ============================================================
// ⏱️ DURÉE
// ============================================================

if (
    audio
) {

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (
                duration
            ) {

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

if (
    audio
) {

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !Number.isFinite(
                    audio.duration
                )
            ) {

                return;

            }


            const pourcentage =
                (
                    audio.currentTime /
                    audio.duration
                ) *
                100;


            if (
                progressBar
            ) {

                progressBar.value =
                    pourcentage;

            }


            if (
                currentTime
            ) {

                currentTime.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }


            if (
                duration
            ) {

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

if (
    progressBar
) {

    progressBar.addEventListener(
        "input",
        () => {

            if (
                !audio ||
                !Number.isFinite(
                    audio.duration
                )
            ) {

                return;

            }


            audio.currentTime =
                (
                    Number(
                        progressBar.value
                    ) /
                    100
                ) *
                audio.duration;

        }
    );

}


// ============================================================
// 🤖 AUTOMATISATION
// ============================================================
//
// C'EST LE CŒUR DE LA RADIO.
//
// Quand le morceau arrive à la fin,
// le prochain morceau est automatiquement chargé.
//
// ============================================================

if (
    audio
) {

    audio.addEventListener(
        "ended",
        () => {

            console.log(
                "🎵 Morceau terminé."
            );


            nextSong(
                true
            );

        }
    );

}


// ============================================================
// ❌ ERREUR AUDIO
// ============================================================

if (
    audio
) {

    audio.addEventListener(
        "error",
        () => {

            isPlaying =
                false;


            updatePlayer();


            if (
                currentTitle
            ) {

                currentTitle.textContent =
                    "Erreur audio ❌";

            }


            if (
                currentArtist
            ) {

                currentArtist.textContent =
                    "Impossible de charger ce morceau.";

            }


            console.error(
                "❌ Impossible de charger :",
                getCurrentSong()
            );

        }
    );

}


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

// La radio est préparée,
// mais elle ne démarre PAS toute seule.
//
// Le navigateur bloque généralement
// la lecture audio automatique sans interaction.
//
// Il faut donc cliquer sur ▶ une première fois.

loadSong(
    0
);


updatePlayer();


if (
    audio
) {

    audio.volume =
        1;

}


console.log(
    "📻 GaloulouRadio démarré."
);


console.log(
    "🤖 Système de radio automatique chargé."
);


console.log(
    "🔥 Firebase Authentication chargé."
);
