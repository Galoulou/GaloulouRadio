// ============================================================
// 📻 GALOULOURADIO
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
// 🎵 PLAYLISTS
// ============================================================

const playlists = {

    hits: [

        {
            title:
                "Le Site sera prêt en Noel 2026 !",

            artist:
                "GaloulouStudio",

            file:
                "music/music2.mp3"
        },

        {
            title:
                "Music 1",

            artist:
                "GaloulouRadio",

            file:
                "music/music1.mp3"
        }

    ],


    morning: [

        {
            title:
                "Chill",

            artist:
                "Kulakovka",

            file:
                "music/kulakovka-chill-reel-570198.mp3"
        },

        {
            title:
                "Reveille Doux",

            artist:
                "Kulakovka",

            file:
                "music/kulakovka-lofi-relax-570489.mp3"
        }

    ],


    night: [

        {
            title:
                "Music 1",

            artist:
                "GaloulouRadio",

            file:
                "music/music1.mp3"
        },

        {
            title:
                "Chill",

            artist:
                "Kulakovka",

            file:
                "music/kulakovka-chill-reel-570198.mp3"
        }

    ],


    chill: [

        {
            title:
                "Chill",

            artist:
                "Kulakovka",

            file:
                "music/kulakovka-chill-reel-570198.mp3"
        },

        {
            title:
                "Music 1",

            artist:
                "GaloulouRadio",

            file:
                "music/music1.mp3"
        }

    ]

};


// ============================================================
// ⚙️ ÉTAT DU LECTEUR
// ============================================================

let currentPlaylist =
    playlists.hits;


let currentIndex =
    0;


let isPlaying =
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
// 🎵 CHARGER UNE MUSIQUE
// ============================================================

function loadSong(
    index
) {

    if (
        !audio ||
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {

        return;

    }


    currentIndex =
        index;


    const song =
        currentPlaylist[
            currentIndex
        ];


    audio.src =
        song.file;


    if (
        currentTitle
    ) {

        currentTitle.textContent =
            song.title;

    }


    if (
        currentArtist
    ) {

        currentArtist.textContent =
            song.artist;

    }


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

}


// ============================================================
// ▶️ LECTURE
// ============================================================

async function playRadio() {

    if (
        !audio
    ) {

        return;

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

    if (
        !audio
    ) {

        return;

    }


    audio.pause();


    isPlaying =
        false;


    updatePlayer();

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
// ⏭️ MUSIQUE SUIVANTE
// ============================================================

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

        currentIndex =
            0;

    }


    loadSong(
        currentIndex
    );


    playRadio();

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

                playRadio();

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

                playRadio();

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
        nextSong
    );

}


// ============================================================
// 🎧 PLAYLISTS
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
                        "❌ Playlist inconnue."
                    );

                    return;

                }


                currentPlaylist =
                    playlists[
                        playlistName
                    ];


                currentIndex =
                    0;


                loadSong(
                    currentIndex
                );


                playRadio();

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
// ⏱️ DURÉE DE LA MUSIQUE
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
// 🎵 MUSIQUE TERMINÉE
// ============================================================

if (
    audio
) {

    audio.addEventListener(
        "ended",
        () => {

            nextSong();

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

        }
    );

}


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

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
    "🔥 Firebase Authentication chargé."
);
