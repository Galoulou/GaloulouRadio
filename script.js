// ============================================================
// 📻 GALOULOURADIO
// ============================================================
// 🎵 Lecteur
// 🔐 Firebase Authentication
// ☁️ Firebase Realtime Database
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

const googleProvider = new GoogleAuthProvider();


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
// 🎵 PLAYLISTS
// ============================================================

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


// ============================================================
// ⚙️ VARIABLES
// ============================================================

let currentPlaylist =
    playlists.hits;

let currentIndex = 0;

let isPlaying = false;


// ============================================================
// ☁️ PARAMÈTRES PAR DÉFAUT
// ============================================================

const parametresParDefaut = {

    theme: "system",

    accentColor: "#2563eb",

    background: "#ffffff",

    volume: 1,

    autoplay: true,

    favorites: []

};


let parametresUtilisateur = {
    ...parametresParDefaut
};


// ============================================================
// 🔐 CONNEXION GOOGLE
// ============================================================

async function connecterAvecGoogle() {

    console.log(
        "🔵 Connexion Google..."
    );

    try {

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );

        const user =
            result.user;


        console.log(
            "✅ Connexion réussie !"
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


        // Firebase s'occupe maintenant
        // automatiquement du compte.


    } catch (error) {

        console.error(
            "❌ Erreur Google :",
            error
        );


        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            console.log(
                "ℹ️ La fenêtre Google a été fermée."
            );

        }


        if (
            error.code ===
            "auth/cancelled-popup-request"
        ) {

            console.log(
                "ℹ️ Une autre connexion Google est déjà en cours."
            );

        }

    }

}


// ============================================================
// 🚪 DÉCONNEXION
// ============================================================

async function deconnecter() {

    console.log(
        "🚪 Déconnexion..."
    );

    try {

        await signOut(auth);

        console.log(
            "✅ Déconnecté !"
        );

    } catch (error) {

        console.error(
            "❌ Erreur déconnexion :",
            error
        );

    }

}


// ============================================================
// 🔵 BOUTON CONNEXION
// ============================================================

if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        connecterAvecGoogle
    );

}


// ============================================================
// ☁️ CHARGER LES PARAMÈTRES
// ============================================================

async function chargerParametres(user) {

    if (!user) {
        return;
    }


    try {

        const userRef =
            ref(
                db,
                "users/" + user.uid
            );


        const snapshot =
            await get(userRef);


        // ----------------------------------------------------
        // 🆕 PREMIÈRE CONNEXION
        // ----------------------------------------------------

        if (!snapshot.exists()) {

            console.log(
                "🆕 Création du profil..."
            );


            await set(
                userRef,
                parametresParDefaut
            );


            parametresUtilisateur =
                {
                    ...parametresParDefaut
                };


            console.log(
                "✅ Profil créé !"
            );

        }


        // ----------------------------------------------------
        // ☁️ PROFIL EXISTANT
        // ----------------------------------------------------

        else {

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

        }


        appliquerParametres();


    } catch (error) {

        console.error(
            "❌ Erreur paramètres :",
            error
        );

    }

}


// ============================================================
// 🎨 APPLIQUER PARAMÈTRES
// ============================================================

function appliquerParametres() {

    // --------------------------------------------------------
    // 🎨 FOND
    // --------------------------------------------------------

    if (
        parametresUtilisateur.background
    ) {

        document.body.style.backgroundColor =
            parametresUtilisateur.background;

    }


    // --------------------------------------------------------
    // 🟦 COULEUR
    // --------------------------------------------------------

    if (
        parametresUtilisateur.accentColor
    ) {

        document.documentElement.style
            .setProperty(
                "--accent-color",
                parametresUtilisateur.accentColor
            );

    }


    // --------------------------------------------------------
    // 🌙 THÈME
    // --------------------------------------------------------

    if (
        parametresUtilisateur.theme
    ) {

        document.documentElement
            .setAttribute(
                "data-theme",
                parametresUtilisateur.theme
            );

    }


    // --------------------------------------------------------
    // 🔊 VOLUME
    // --------------------------------------------------------

    if (
        typeof parametresUtilisateur.volume ===
        "number"
    ) {

        audio.volume =
            parametresUtilisateur.volume;


        if (volumeBar) {

            volumeBar.value =
                parametresUtilisateur.volume;

        }

    }


    console.log(
        "🎨 Paramètres appliqués !"
    );

}


// ============================================================
// 💾 SAUVEGARDER PARAMÈTRE
// ============================================================

async function sauvegarderParametre(
    nom,
    valeur
) {

    const user =
        auth.currentUser;


    if (!user) {

        return;

    }


    try {

        const userRef =
            ref(
                db,
                "users/" + user.uid
            );


        await update(
            userRef,
            {
                [nom]: valeur
            }
        );


        parametresUtilisateur[nom] =
            valeur;


        console.log(
            "💾 Sauvegardé :",
            nom,
            valeur
        );


    } catch (error) {

        console.error(
            "❌ Erreur sauvegarde :",
            error
        );

    }

}


// ============================================================
// 👤 SURVEILLER LA CONNEXION
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        // ====================================================
        // 👤 CONNECTÉ
        // ====================================================

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
            // ☁️ CHARGER PARAMÈTRES
            // ------------------------------------------------

            await chargerParametres(
                user
            );


            // ------------------------------------------------
            // 🔵 CHANGER LE BOUTON
            // ------------------------------------------------

            if (googleLoginButton) {

                googleLoginButton.textContent =
                    "👤 " +
                    (
                        user.displayName ||
                        "Mon compte"
                    ) +
                    " · Déconnexion";


                // On enlève l'ancien événement

                googleLoginButton.removeEventListener(
                    "click",
                    connecterAvecGoogle
                );


                // On met celui de déconnexion

                googleLoginButton.addEventListener(
                    "click",
                    deconnecter
                );

            }

        }


        // ====================================================
        // 🚪 PAS CONNECTÉ
        // ====================================================

        else {

            console.log(
                "🚪 Aucun utilisateur connecté"
            );


            if (googleLoginButton) {

                googleLoginButton.textContent =
                    "🔵 Se connecter avec Google";


                googleLoginButton.removeEventListener(
                    "click",
                    deconnecter
                );


                googleLoginButton.addEventListener(
                    "click",
                    connecterAvecGoogle
                );

            }

        }

    }
);


// ============================================================
// 🕐 TEMPS
// ============================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
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
            .padStart(2, "0")
    );

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


        if (radioStatus) {

            radioStatus.textContent =
                "🤖 PROGRAMME AUTOMATIQUE";

        }


    } catch (error) {

        console.error(
            "❌ Erreur lecture :",
            error
        );

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
// 🔄 INTERFACE LECTEUR
// ============================================================

function updatePlayer() {

    if (isPlaying) {

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
// ⏭️ SUIVANT
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
// ▶️ BOUTON PLAY HERO
// ============================================================

if (playButton) {

    playButton.addEventListener(
        "click",
        () => {

            if (isPlaying) {

                pauseRadio();

            }

            else {

                playRadio();

            }

        }
    );

}


// ============================================================
// ▶️ BOUTON PLAY LECTEUR
// ============================================================

if (mainPlay) {

    mainPlay.addEventListener(
        "click",
        () => {

            if (isPlaying) {

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

if (nextButton) {

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
                        "❌ Playlist inconnue :",
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

    volumeBar.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    volumeBar.value
                );


            audio.volume =
                volume;


            sauvegarderParametre(
                "volume",
                volume
            );

        }
    );

}


// ============================================================
// ⏱️ MÉTADONNÉES AUDIO
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


        const pourcentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressBar.value =
            pourcentage;


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
// 🎚️ BARRE DE PROGRESSION
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
// 🎵 FIN DE MUSIQUE
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
            "Impossible de charger ce morceau.";

    }
);


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

loadSong(0);

updatePlayer();


console.log(
    "📻 GaloulouRadio est démarré !"
);

console.log(
    "🔥 Firebase Authentication est chargé !"
);

console.log(
    "☁️ Firebase Database est chargé !"
);
