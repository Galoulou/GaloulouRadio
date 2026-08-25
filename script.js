// ============================================================
// 📻 GALOULOURADIO
// 🎵 LECTEUR + FIREBASE AUTHENTICATION + DATABASE
// ============================================================


// ============================================================
// 🔥 FIREBASE
// ============================================================

import {
    auth,
    db
} from "./firebase.js";


import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
    ref,
    get,
    set,
    update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// ============================================================
// 🔵 GOOGLE
// ============================================================

const googleProvider =
    new GoogleAuthProvider();


const googleLoginButton =
    document.getElementById(
        "googleLoginButton"
    );


// ============================================================
// 📻 ÉLÉMENTS DU LECTEUR
// ============================================================

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
// 🎵 TES MUSIQUES
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
// ⚙️ VARIABLES DU LECTEUR
// ============================================================

let currentPlaylist =
    playlists.hits;


let currentIndex =
    0;


let isPlaying =
    false;


// ============================================================
// ☁️ PARAMÈTRES PAR DÉFAUT
// ============================================================

const parametresParDefaut = {

    theme:
        "system",

    accentColor:
        "#2563eb",

    background:
        "#ffffff",

    volume:
        1,

    autoplay:
        true,

    favorites:
        []

};


// ============================================================
// 🎨 PARAMÈTRES ACTUELS
// ============================================================

let parametresUtilisateur = {
    ...parametresParDefaut
};


// ============================================================
// 📥 CHARGER LES PARAMÈTRES
// ============================================================

async function chargerParametres(user) {

    if (!user) {

        return;

    }


    try {

        const userRef =
            ref(
                db,
                "users/" +
                user.uid
            );


        const snapshot =
            await get(
                userRef
            );


        // ----------------------------------------------------
        // 🆕 PREMIÈRE CONNEXION
        // ----------------------------------------------------

        if (!snapshot.exists()) {

            console.log(
                "🆕 Première connexion !"
            );


            console.log(
                "☁️ Création du profil..."
            );


            await set(
                userRef,
                parametresParDefaut
            );


            parametresUtilisateur = {
                ...parametresParDefaut
            };


            console.log(
                "✅ Profil créé dans Firebase !"
            );


            appliquerParametres(
                parametresUtilisateur
            );


            return;

        }


        // ----------------------------------------------------
        // ☁️ PROFIL EXISTANT
        // ----------------------------------------------------

        const donnees =
            snapshot.val();


        parametresUtilisateur = {

            ...parametresParDefaut,

            ...donnees

        };


        console.log(
            "☁️ Paramètres récupérés :",
            parametresUtilisateur
        );


        appliquerParametres(
            parametresUtilisateur
        );


    } catch (error) {

        console.error(
            "❌ Erreur de chargement des paramètres :",
            error
        );

    }

}


// ============================================================
// 🎨 APPLIQUER LES PARAMÈTRES
// ============================================================

function appliquerParametres(parametres) {

    if (!parametres) {

        return;

    }


    // --------------------------------------------------------
    // 🎨 FOND
    // --------------------------------------------------------

    if (
        parametres.background
    ) {

        document.body.style.backgroundColor =
            parametres.background;

    }


    // --------------------------------------------------------
    // 🟦 COULEUR PRINCIPALE
    // --------------------------------------------------------

    if (
        parametres.accentColor
    ) {

        document.documentElement.style
            .setProperty(
                "--accent-color",
                parametres.accentColor
            );

    }


    // --------------------------------------------------------
    // 🌙 THÈME
    // --------------------------------------------------------

    if (
        parametres.theme
    ) {

        document.documentElement
            .setAttribute(
                "data-theme",
                parametres.theme
            );

    }


    // --------------------------------------------------------
    // 🔊 VOLUME
    // --------------------------------------------------------

    if (
        typeof parametres.volume ===
        "number"
    ) {

        audio.volume =
            parametres.volume;


        if (volumeBar) {

            volumeBar.value =
                parametres.volume;

        }

    }


    console.log(
        "🎨 Paramètres appliqués !"
    );

}


// ============================================================
// 💾 SAUVEGARDER UN PARAMÈTRE
// ============================================================

async function sauvegarderParametre(
    nom,
    valeur
) {

    const user =
        auth.currentUser;


    if (!user) {

        console.log(
            "⚠️ Pas de compte connecté."
        );

        return;

    }


    try {

        const userRef =
            ref(
                db,
                "users/" +
                user.uid
            );


        await update(
            userRef,
            {
                [nom]: valeur
            }
        );


        parametresUtilisateur[
            nom
        ] =
            valeur;


        console.log(
            "💾 Paramètre sauvegardé :",
            nom,
            valeur
        );


    } catch (error) {

        console.error(
            "❌ Erreur de sauvegarde :",
            error
        );

    }

}


// ============================================================
// 🔐 CONNEXION GOOGLE
// ============================================================

async function gererConnexion() {

    try {

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        console.log(
            "✅ Connexion Google réussie !"
        );


        console.log(
            "👤 Nom :",
            user.displayName
        );


        console.log(
            "📧 Email :",
            user.email
        );


        console.log(
            "🆔 UID :",
            user.uid
        );


    } catch (error) {

        console.error(
            "❌ Erreur de connexion Google :",
            error
        );

    }

}


// ============================================================
// 🚪 DÉCONNEXION
// ============================================================

async function deconnexion() {

    try {

        await signOut(
            auth
        );


        console.log(
            "🚪 Déconnexion réussie !"
        );


    } catch (error) {

        console.error(
            "❌ Erreur de déconnexion :",
            error
        );

    }

}


// ============================================================
// 👤 SURVEILLER LE COMPTE
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            console.log(
                "👤 Utilisateur connecté :",
                user.displayName
            );


            console.log(
                "📧 Email :",
                user.email
            );


            console.log(
                "🆔 UID :",
                user.uid
            );


            // ------------------------------------------------
            // ☁️ CHARGER SES PARAMÈTRES
            // ------------------------------------------------

            await chargerParametres(
                user
            );


            // ------------------------------------------------
            // 👤 BOUTON COMPTE
            // ------------------------------------------------

            if (
                googleLoginButton
            ) {

                googleLoginButton.textContent =
                    "👤 " +
                    (
                        user.displayName ||
                        "Mon compte"
                    ) +
                    " · Déconnexion";


                googleLoginButton.onclick =
                    deconnexion;

            }


        } else {

            console.log(
                "🚪 Aucun utilisateur connecté"
            );


            // ------------------------------------------------
            // 🔵 BOUTON CONNEXION
            // ------------------------------------------------

            if (
                googleLoginButton
            ) {

                googleLoginButton.textContent =
                    "🔵 Se connecter avec Google";


                googleLoginButton.onclick =
                    gererConnexion;

            }

        }

    }
);


// ============================================================
// 🕐 FORMAT DU TEMPS
// ============================================================

function formatTime(seconds) {

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


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(
            2,
            "0"
        )}`;

}


// ============================================================
// 🎵 CHARGER UNE MUSIQUE
// ============================================================

function loadSong(index) {

    if (
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


    currentTitle.textContent =
        song.title;


    currentArtist.textContent =
        song.artist;


    progressBar.value =
        0;


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";

}


// ============================================================
// ▶️ LECTURE
// ============================================================

async function playRadio() {

    try {

        await audio.play();


        isPlaying =
            true;


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


// ============================================================
// ⏸️ PAUSE
// ============================================================

function pauseRadio() {

    audio.pause();


    isPlaying =
        false;


    updatePlayer();

}


// ============================================================
// 🔄 METTRE À JOUR LE LECTEUR
// ============================================================

function updatePlayer() {

    if (isPlaying) {

        playButton.textContent =
            "⏸ Mettre en pause";


        mainPlay.textContent =
            "⏸";

    } else {

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
// 🎵 BOUTON PRINCIPAL
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
// 🎵 BOUTON DU LECTEUR
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
        () => {

            nextSong();

        }
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
                        "Playlist inconnue :",
                        playlistName
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

if (volumeBar) {

    audio.volume =
        Number(
            volumeBar.value
        );


    volumeBar.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    volumeBar.value
                );


            audio.volume =
                volume;


            // ----------------------------------------------
            // ☁️ SAUVEGARDER
            // ----------------------------------------------

            sauvegarderParametre(
                "volume",
                volume
            );

        }
    );

}


// ============================================================
// ⏱️ DURÉE DE LA MUSIQUE
// ============================================================

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


// ============================================================
// 📈 PROGRESSION
// ============================================================

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


        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressBar.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );


        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


// ============================================================
// 🎚️ DÉPLACER LA BARRE
// ============================================================

if (progressBar) {

    progressBar.addEventListener(
        "input",
        () => {

            if (
                !Number.isFinite(
                    audio.duration
                )
            ) {

                return;

            }


            const newTime =
                (
                    Number(
                        progressBar.value
                    ) / 100
                ) *
                audio.duration;


            audio.currentTime =
                newTime;

        }
    );

}


// ============================================================
// 🎵 MUSIQUE TERMINÉE
// ============================================================

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


// ============================================================
// ❌ ERREUR AUDIO
// ============================================================

audio.addEventListener(
    "error",
    () => {

        isPlaying =
            false;


        updatePlayer();


        currentTitle.textContent =
            "Erreur audio ❌";


        currentArtist.textContent =
            "Impossible de charger ce morceau. Le site sera prêt le 26/12/2026.";

    }
);


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

loadSong(
    0
);


updatePlayer();


console.log(
    "📻 GaloulouRadio est démarré !"
);


console.log(
    "🔥 Firebase Authentication est chargé !"
);


console.log(
    "☁️ Firebase Realtime Database est chargé !"
);
