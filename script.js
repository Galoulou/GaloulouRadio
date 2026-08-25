// ============================================================
// 📻 GALOULOURADIO
// 🎵 LECTEUR
// 🔐 FIREBASE AUTHENTICATION
// ☁️ FIREBASE REALTIME DATABASE
// ⚙️ SETTINGS
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


// ============================================================
// 📌 ÉLÉMENTS HTML
// ============================================================

const googleLoginButton =
    document.getElementById(
        "googleLoginButton"
    );


const settingsButton =
    document.getElementById(
        "settingsButton"
    );


const settingsPanel =
    document.getElementById(
        "settingsPanel"
    );


const closeSettingsButton =
    document.getElementById(
        "closeSettingsButton"
    );


const settingsLoginMessage =
    document.getElementById(
        "settingsLoginMessage"
    );


const themeSetting =
    document.getElementById(
        "themeSetting"
    );


const accentColorSetting =
    document.getElementById(
        "accentColorSetting"
    );


const backgroundSetting =
    document.getElementById(
        "backgroundSetting"
    );


const settingsVolume =
    document.getElementById(
        "settingsVolume"
    );


const autoplaySetting =
    document.getElementById(
        "autoplaySetting"
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


let parametresUtilisateur = {
    ...parametresParDefaut
};


// ============================================================
// 🛡️ OUTILS
// ============================================================

function utilisateurConnecte() {

    return Boolean(
        auth.currentUser
    );

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
            "❌ Connexion Google impossible."
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
            "❌ Déconnexion impossible."
        );

    }

}


// ============================================================
// 🔵 METTRE À JOUR LE BOUTON COMPTE
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


    if (user) {

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
// ☁️ CHARGER LES PARAMÈTRES
// ============================================================

async function chargerParametres(
    user
) {

    if (!user) {

        parametresUtilisateur = {
            ...parametresParDefaut
        };


        appliquerParametres();


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


        if (
            !snapshot.exists()
        ) {

            await set(
                userRef,
                parametresParDefaut
            );


            parametresUtilisateur = {
                ...parametresParDefaut
            };


            console.log(
                "🆕 Profil utilisateur créé."
            );

        }

        else {

            const donnees =
                snapshot.val();


            parametresUtilisateur = {

                ...parametresParDefaut,

                ...donnees

            };


            console.log(
                "☁️ Paramètres utilisateur chargés."
            );

        }


        appliquerParametres();


    } catch (error) {

        console.error(
            "❌ Impossible de charger les paramètres."
        );

    }

}


// ============================================================
// 🎨 APPLIQUER LES PARAMÈTRES
// ============================================================

function appliquerParametres() {

    const parametres =
        parametresUtilisateur;


    // --------------------------------------------------------
    // 🖼️ FOND
    // --------------------------------------------------------

    if (
        backgroundSetting &&
        parametres.background
    ) {

        backgroundSetting.value =
            parametres.background;

    }


    if (
        parametres.background
    ) {

        document.body.style.backgroundColor =
            parametres.background;

    }


    // --------------------------------------------------------
    // 🎨 ACCENT
    // --------------------------------------------------------

    if (
        accentColorSetting &&
        parametres.accentColor
    ) {

        accentColorSetting.value =
            parametres.accentColor;

    }


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
        themeSetting &&
        parametres.theme
    ) {

        themeSetting.value =
            parametres.theme;

    }


    if (
        parametres.theme ===
        "system"
    ) {

        document.documentElement
            .removeAttribute(
                "data-theme"
            );

    }

    else if (
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

        const volume =
            Math.max(
                0,
                Math.min(
                    1,
                    parametres.volume
                )
            );


        if (audio) {

            audio.volume =
                volume;

        }


        if (volumeBar) {

            volumeBar.value =
                volume;

        }


        if (settingsVolume) {

            settingsVolume.value =
                volume;

        }

    }


    // --------------------------------------------------------
    // ▶️ AUTOPLAY
    // --------------------------------------------------------

    if (
        autoplaySetting
    ) {

        autoplaySetting.checked =
            parametres.autoplay === true;

    }


    console.log(
        "🎨 Paramètres appliqués."
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


    // --------------------------------------------------------
    // 👤 PAS CONNECTÉ
    // --------------------------------------------------------

    if (!user) {

        console.log(
            "🔐 Connecte-toi pour sauvegarder tes paramètres."
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
            nom
        );


    } catch (error) {

        console.error(
            "❌ Impossible de sauvegarder le paramètre."
        );

    }

}


// ============================================================
// 👤 ÉTAT DE CONNEXION FIREBASE
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        mettreAJourBoutonCompte(
            user
        );


        if (user) {

            console.log(
                "👤 Compte connecté."
            );


            if (
                settingsLoginMessage
            ) {

                settingsLoginMessage.textContent =
                    "☁️ Tes paramètres sont sauvegardés sur ton compte.";

            }


            await chargerParametres(
                user
            );

        }

        else {

            console.log(
                "🚪 Aucun compte connecté."
            );


            if (
                settingsLoginMessage
            ) {

                settingsLoginMessage.textContent =
                    "🔐 Connecte-toi avec Google pour sauvegarder tes paramètres.";

            }


            chargerParametres(
                null
            );

        }

    }
);


// ============================================================
// ⚙️ OUVRIR LES SETTINGS
// ============================================================

function ouvrirSettings() {

    if (
        !settingsPanel
    ) {

        console.error(
            "❌ settingsPanel introuvable."
        );

        return;

    }


    settingsPanel.hidden =
        false;


    settingsPanel.style.display =
        "block";


    console.log(
        "⚙️ Paramètres ouverts."
    );

}


// ============================================================
// ❌ FERMER LES SETTINGS
// ============================================================

function fermerSettings() {

    if (
        !settingsPanel
    ) {

        return;

    }


    settingsPanel.hidden =
        true;


    settingsPanel.style.display =
        "none";


    console.log(
        "⚙️ Paramètres fermés."
    );

}


// ============================================================
// ⚙️ BOUTON SETTINGS
// ============================================================

if (
    settingsButton
) {

    settingsButton.addEventListener(
        "click",
        ouvrirSettings
    );

}

else {

    console.error(
        "❌ Bouton Settings introuvable."
    );

}


// ============================================================
// ❌ BOUTON FERMER
// ============================================================

if (
    closeSettingsButton
) {

    closeSettingsButton.addEventListener(
        "click",
        fermerSettings
    );

}


// ============================================================
// 🖱️ CLIC EN DEHORS
// ============================================================

if (
    settingsPanel
) {

    settingsPanel.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                settingsPanel
            ) {

                fermerSettings();

            }

        }
    );

}


// ============================================================
// 🌙 THÈME
// ============================================================

if (
    themeSetting
) {

    themeSetting.addEventListener(
        "change",
        () => {

            const theme =
                themeSetting.value;


            if (
                theme ===
                "system"
            ) {

                document.documentElement
                    .removeAttribute(
                        "data-theme"
                    );

            }

            else {

                document.documentElement
                    .setAttribute(
                        "data-theme",
                        theme
                    );

            }


            sauvegarderParametre(
                "theme",
                theme
            );

        }
    );

}


// ============================================================
// 🎨 COULEUR D'ACCENT
// ============================================================

if (
    accentColorSetting
) {

    accentColorSetting.addEventListener(
        "input",
        () => {

            const color =
                accentColorSetting.value;


            document.documentElement.style
                .setProperty(
                    "--accent-color",
                    color
                );

        }
    );


    accentColorSetting.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "accentColor",
                accentColorSetting.value
            );

        }
    );

}


// ============================================================
// 🖼️ COULEUR DU FOND
// ============================================================

if (
    backgroundSetting
) {

    backgroundSetting.addEventListener(
        "input",
        () => {

            document.body.style
                .backgroundColor =
                backgroundSetting.value;

        }
    );


    backgroundSetting.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "background",
                backgroundSetting.value
            );

        }
    );

}


// ============================================================
// 🔊 VOLUME SETTINGS
// ============================================================

if (
    settingsVolume
) {

    settingsVolume.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    settingsVolume.value
                );


            if (audio) {

                audio.volume =
                    volume;

            }


            if (volumeBar) {

                volumeBar.value =
                    volume;

            }

        }
    );


    settingsVolume.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "volume",
                Number(
                    settingsVolume.value
                )
            );

        }
    );

}


// ============================================================
// ▶️ AUTOPLAY
// ============================================================

if (
    autoplaySetting
) {

    autoplaySetting.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "autoplay",
                autoplaySetting.checked
            );

        }
    );

}


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
            "❌ Lecture audio impossible."
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
// 🔄 INTERFACE LECTEUR
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
// ▶️ BOUTON LECTEUR
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
// ⏭️ SUIVANT
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
// 🔊 VOLUME DU LECTEUR
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


            if (
                settingsVolume
            ) {

                settingsVolume.value =
                    volume;

            }

        }
    );


    volumeBar.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "volume",
                Number(
                    volumeBar.value
                )
            );

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
    settingsPanel
) {

    settingsPanel.hidden =
        true;


    settingsPanel.style.display =
        "none";

}


console.log(
    "📻 GaloulouRadio démarré."
);


console.log(
    "🔥 Firebase Authentication chargé."
);


console.log(
    "☁️ Firebase Realtime Database chargé."
);
