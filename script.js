// ============================================================
// 📻 GALOULOURADIO
// 🎵 LECTEUR AUTOMATIQUE
// 🎲 CATALOGUE MUSICAL
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
// 🎵 CATALOGUE MUSICAL
// ============================================================
//
// Pour ajouter une musique, ajoute simplement un objet.
//
// Exemple :
//
// {
//     id: "nouvelle-musique",
//     title: "Nom du morceau",
//     artist: "Artiste",
//     file: "music/nom-du-fichier.mp3",
//     playlists: ["hits", "chill"]
// }
//
// Une musique peut appartenir à plusieurs playlists.
//
// ============================================================

const catalogueMusical = [

    // ========================================================
    // 🔥 HITS
    // ========================================================

    {
        id: "music2",

        title:
            "Le Site sera prêt en Noel 2026 !",

        artist:
            "GaloulouStudio",

        file:
            "music/music2.mp3",

        playlists:
            ["hits"]
    },


    {
        id: "music1",

        title:
            "Music 1",

        artist:
            "GaloulouRadio",

        file:
            "music/music1.mp3",

        playlists:
            [
                "hits",
                "night",
                "chill"
            ]
    },


    // ========================================================
    // ☀️ MORNING
    // ========================================================

    {
        id: "kulakovka-chill",

        title:
            "Chill",

        artist:
            "Kulakovka",

        file:
            "music/kulakovka-chill-reel-570198.mp3",

        playlists:
            [
                "morning",
                "chill",
                "night"
            ]
    },


    {
        id: "kulakovka-lofi",

        title:
            "Réveil Doux",

        artist:
            "Kulakovka",

        file:
            "music/kulakovka-lofi-relax-570489.mp3",

        playlists:
            [
                "morning",
                "chill"
            ]
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
// 📊 INFORMATIONS DU CATALOGUE
// ============================================================

console.log(
    "🎵 Catalogue musical chargé :",
    catalogueMusical.length,
    "morceaux"
);


console.log(
    "🔥 Hits :",
    playlists.hits.length,
    "morceaux"
);


console.log(
    "☀️ Morning :",
    playlists.morning.length,
    "morceaux"
);


console.log(
    "🌙 Night :",
    playlists.night.length,
    "morceaux"
);


console.log(
    "🎶 Chill :",
    playlists.chill.length,
    "morceaux"
);


// ============================================================
// 🤖 PROGRAMMATION AUTOMATIQUE
// ============================================================
//
// 06h → 12h : Morning
// 12h → 18h : Hits
// 18h → 22h : Chill
// 22h → 06h : Night
//
// Le navigateur ne charge pas toutes les musiques.
// Une seule musique est chargée dans <audio> à la fois.
//
// ============================================================

function obtenirPlaylistSelonHeure() {

    const heure =
        new Date().getHours();


    // 🌅 06h → 12h
    if (
        heure >= 6 &&
        heure < 12
    ) {

        return playlists.morning;

    }


    // ☀️ 12h → 18h
    if (
        heure >= 12 &&
        heure < 18
    ) {

        return playlists.hits;

    }


    // 🌆 18h → 22h
    if (
        heure >= 18 &&
        heure < 22
    ) {

        return playlists.chill;

    }


    // 🌙 22h → 06h
    return playlists.night;

}


// ============================================================
// 📻 PLAYLIST AUTOMATIQUE ACTUELLE
// ============================================================

let radioPlaylist =
    obtenirPlaylistSelonHeure();


// ============================================================
// ⚙️ ÉTAT DU LECTEUR
// ============================================================

let currentIndex =
    0;


let isPlaying =
    false;


let radioStarted =
    false;


// ============================================================
// 🔄 ACTUALISER LA PLAYLIST AUTOMATIQUE
// ============================================================

function actualiserProgrammation() {

    const nouvellePlaylist =
        obtenirPlaylistSelonHeure();


    if (
        nouvellePlaylist !==
        radioPlaylist
    ) {

        radioPlaylist =
            nouvellePlaylist;


        currentIndex =
            0;


        console.log(
            "🕐 Changement de programmation automatique."
        );

    }

}


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
    user => {

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
// 🎲 CHOISIR UNE MUSIQUE ALÉATOIRE
// ============================================================

function choisirMusiqueAleatoire(
    playlist
) {

    if (
        !playlist ||
        playlist.length === 0
    ) {

        return 0;

    }


    if (
        playlist.length === 1
    ) {

        return 0;

    }


    let nouvelIndex;


    do {

        nouvelIndex =
            Math.floor(
                Math.random() *
                playlist.length
            );

    }

    while (
        nouvelIndex ===
        currentIndex
    );


    return nouvelIndex;

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

        console.error(
            "❌ Aucune musique disponible."
        );

        return;

    }


    if (
        index < 0
    ) {

        index = 0;

    }


    if (
        index >=
        radioPlaylist.length
    ) {

        index = 0;

    }


    currentIndex =
        index;


    const song =
        radioPlaylist[
            currentIndex
        ];


    if (
        !song
    ) {

        console.error(
            "❌ Musique introuvable."
        );

        return;

    }


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


    console.log(
        "🎵 Chargé :",
        song.title,
        "-",
        song.artist
    );

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


        radioStarted =
            true;


        updatePlayer();


        if (
            radioStatus
        ) {

            radioStatus.textContent =
                "🤖 PROGRAMME AUTOMATIQUE";

        }


        console.log(
            "▶️ Radio en lecture."
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
// ⏭️ MUSIQUE SUIVANTE
// ============================================================

function nextSong() {

    if (
        !radioPlaylist ||
        radioPlaylist.length === 0
    ) {

        return;

    }


    // Vérifie l'heure avant de choisir
    // le prochain morceau.

    actualiserProgrammation();


    const nouvelIndex =
        choisirMusiqueAleatoire(
            radioPlaylist
        );


    loadSong(
        nouvelIndex
    );


    if (
        radioStarted ||
        isPlaying
    ) {

        playRadio();

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
        () => {

            nextSong();

        }
    );

}


// ============================================================
// 🎧 PLAYLISTS MANUELLES
// ============================================================
//
// Si l'utilisateur clique sur une playlist,
// on la lance immédiatement.
//
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


                if (
                    playlists[
                        playlistName
                    ].length === 0
                ) {

                    console.error(
                        "❌ Cette playlist est vide."
                    );

                    return;

                }


                radioPlaylist =
                    playlists[
                        playlistName
                    ];


                currentIndex =
                    choisirMusiqueAleatoire(
                        radioPlaylist
                    );


                loadSong(
                    currentIndex
                );


                if (
                    radioStatus
                ) {

                    radioStatus.textContent =
                        "🎵 PLAYLIST : " +
                        playlistName.toUpperCase();

                }


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
// 🎵 MUSIQUE TERMINÉE
// ============================================================

if (
    audio
) {

    audio.addEventListener(
        "ended",
        () => {

            console.log(
                "🎵 Musique terminée."
            );


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


            console.error(
                "❌ Impossible de charger :",
                audio.src
            );

        }
    );

}


// ============================================================
// 🕐 VÉRIFICATION DE L'HORAIRE
// ============================================================
//
// Toutes les minutes, on vérifie si la programmation
// doit changer.
//
// Le morceau actuel continue jusqu'à sa fin.
// Le changement de playlist se fera au prochain morceau.
//
// ============================================================

setInterval(
    () => {

        if (
            !radioStarted
        ) {

            return;

        }


        const anciennePlaylist =
            radioPlaylist;


        const nouvellePlaylist =
            obtenirPlaylistSelonHeure();


        if (
            nouvellePlaylist !==
            anciennePlaylist
        ) {

            radioPlaylist =
                nouvellePlaylist;


            currentIndex =
                -1;


            console.log(
                "🕐 Nouvelle programmation détectée."
            );


            if (
                radioStatus &&
                isPlaying
            ) {

                radioStatus.textContent =
                    "🤖 PROGRAMME AUTOMATIQUE";

            }

        }

    },
    60 * 1000
);


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

actualiserProgrammation();


if (
    radioPlaylist &&
    radioPlaylist.length > 0
) {

    currentIndex =
        choisirMusiqueAleatoire(
            radioPlaylist
        );


    loadSong(
        currentIndex
    );

}


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
    "🤖 Programmation automatique activée."
);


console.log(
    "🔥 Firebase Authentication chargé."
);
