// ============================================================
// 📻 GALOULOURADIO
// 🎵 LECTEUR
// 🔐 FIREBASE AUTHENTICATION
// ☁️ FIREBASE REALTIME DATABASE
// ⚙️ SETTINGS
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

const googleLoginButton = document.getElementById("googleLoginButton");
const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const settingsLoginMessage = document.getElementById("settingsLoginMessage");

const themeSetting = document.getElementById("themeSetting");
const accentColorSetting = document.getElementById("accentColorSetting");
const backgroundSetting = document.getElementById("backgroundSetting");
const settingsVolume = document.getElementById("settingsVolume");
const autoplaySetting = document.getElementById("autoplaySetting");

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
// ⚙️ ÉTAT DU LECTEUR
// ============================================================

let currentPlaylist = playlists.hits;
let currentIndex = 0;
let isPlaying = false;


// ============================================================
// ☁️ PARAMÈTRES PAR DÉFAUT
// ============================================================

const parametresParDefaut = {
    theme: "system",
    accentColor: "#2563eb",
    background: "#050b18",
    volume: 1,
    autoplay: true,
    favorites: []
};

let parametresUtilisateur = {
    ...parametresParDefaut
};


// ============================================================
// 🛡️ UTILISATEUR
// ============================================================

function utilisateurConnecte() {
    return Boolean(auth.currentUser);
}


// ============================================================
// 🔐 CONNEXION GOOGLE
// ============================================================

async function connecterAvecGoogle() {

    if (utilisateurConnecte()) {
        return;
    }

    try {

        await signInWithPopup(
            auth,
            googleProvider
        );

        console.log("✅ Connexion Google réussie.");

    } catch (error) {

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

        await signOut(auth);

        console.log("🚪 Déconnexion réussie.");

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

    googleLoginButton.onclick = null;

    if (user) {

        googleLoginButton.textContent =
            "👤 Mon compte · Déconnexion";

        googleLoginButton.onclick =
            deconnecter;

    } else {

        googleLoginButton.textContent =
            "🔵 Se connecter avec Google";

        googleLoginButton.onclick =
            connecterAvecGoogle;

    }
}


// ============================================================
// 🎨 APPLIQUER LE THÈME
// ============================================================

function appliquerTheme(theme) {

    if (theme === "system") {

        document.documentElement
            .removeAttribute("data-theme");

    } else {

        document.documentElement
            .setAttribute(
                "data-theme",
                theme
            );

    }
}


// ============================================================
// 🎨 APPLIQUER LES PARAMÈTRES
// ============================================================

function appliquerParametres() {

    const p = parametresUtilisateur;


    // 🎨 COULEUR

    if (p.accentColor) {

        document.documentElement.style
            .setProperty(
                "--accent-color",
                p.accentColor
            );

        document.documentElement.style
            .setProperty(
                "--blue",
                p.accentColor
            );

    }


    // 🖼️ FOND

    if (p.background) {

        document.body.style.background =
            p.background;

    }


    // 🌙 THÈME

    if (p.theme) {

        appliquerTheme(p.theme);

    }


    // 🔊 VOLUME

    if (typeof p.volume === "number") {

        const volume =
            Math.max(
                0,
                Math.min(
                    1,
                    p.volume
                )
            );

        if (audio) {
            audio.volume = volume;
        }

        if (volumeBar) {
            volumeBar.value = volume;
        }

        if (settingsVolume) {
            settingsVolume.value = volume;
        }
    }


    // ▶️ AUTOPLAY

    if (autoplaySetting) {

        autoplaySetting.checked =
            p.autoplay === true;

    }


    // 🔄 INPUTS

    if (themeSetting) {
        themeSetting.value =
            p.theme || "system";
    }

    if (accentColorSetting) {
        accentColorSetting.value =
            p.accentColor || "#2563eb";
    }

    if (backgroundSetting) {
        backgroundSetting.value =
            p.background || "#050b18";
    }

}


// ============================================================
// ☁️ CHARGER PARAMÈTRES
// ============================================================

async function chargerParametres(user) {

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
                `users/${user.uid}`
            );

        const snapshot =
            await get(userRef);


        if (!snapshot.exists()) {

            await set(
                userRef,
                parametresParDefaut
            );

            parametresUtilisateur = {
                ...parametresParDefaut
            };

        } else {

            parametresUtilisateur = {
                ...parametresParDefaut,
                ...snapshot.val()
            };

        }

        appliquerParametres();

        console.log(
            "☁️ Paramètres chargés."
        );

    } catch (error) {

        console.error(
            "❌ Erreur chargement paramètres :",
            error
        );

        appliquerParametres();

    }
}


// ============================================================
// 💾 SAUVEGARDER PARAMÈTRE
// ============================================================

async function sauvegarderParametre(
    nom,
    valeur
) {

    const user = auth.currentUser;

    // On applique quand même localement
    parametresUtilisateur[nom] =
        valeur;


    // Pas connecté → pas de sauvegarde Firebase
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
                `users/${user.uid}`
            );

        await update(
            userRef,
            {
                [nom]: valeur
            }
        );

        console.log(
            `💾 ${nom} sauvegardé.`
        );

    } catch (error) {

        console.error(
            "❌ Erreur sauvegarde :",
            error
        );

    }
}


// ============================================================
// 👤 FIREBASE AUTH
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        mettreAJourBoutonCompte(user);

        if (user) {

            console.log(
                "👤 Compte connecté :",
                user.email
            );

            if (settingsLoginMessage) {

                settingsLoginMessage.textContent =
                    "☁️ Tes paramètres sont sauvegardés sur ton compte.";

            }

            await chargerParametres(user);

        } else {

            console.log(
                "🚪 Aucun compte connecté."
            );

            if (settingsLoginMessage) {

                settingsLoginMessage.textContent =
                    "🔐 Connecte-toi avec Google pour sauvegarder tes paramètres.";

            }

            await chargerParametres(null);

        }

    }
);


// ============================================================
// ⚙️ SETTINGS — OUVRIR
// ============================================================

function ouvrirSettings() {

    if (!settingsPanel) {
        return;
    }

    settingsPanel.hidden = false;
    settingsPanel.style.display = "block";

}


// ============================================================
// ❌ SETTINGS — FERMER
// ============================================================

function fermerSettings() {

    if (!settingsPanel) {
        return;
    }

    settingsPanel.hidden = true;
    settingsPanel.style.display = "none";

}


if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        ouvrirSettings
    );

}


if (closeSettingsButton) {

    closeSettingsButton.addEventListener(
        "click",
        fermerSettings
    );

}


if (settingsPanel) {

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

if (themeSetting) {

    themeSetting.addEventListener(
        "change",
        () => {

            const theme =
                themeSetting.value;

            appliquerTheme(theme);

            sauvegarderParametre(
                "theme",
                theme
            );

        }
    );

}


// ============================================================
// 🎨 COULEUR
// ============================================================

if (accentColorSetting) {

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

            document.documentElement.style
                .setProperty(
                    "--blue",
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
// 🖼️ FOND
// ============================================================

if (backgroundSetting) {

    backgroundSetting.addEventListener(
        "input",
        () => {

            document.body.style.background =
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

if (settingsVolume) {

    settingsVolume.addEventListener(
        "input",
        () => {

            const volume =
                Number(
                    settingsVolume.value
                );

            if (audio) {
                audio.volume = volume;
            }

            if (volumeBar) {
                volumeBar.value = volume;
            }

        }
    );


    settingsVolume.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "volume",
                Number(settingsVolume.value)
            );

        }
    );

}


// ============================================================
// ▶️ AUTOPLAY
// ============================================================

if (autoplaySetting) {

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
// 🕐 FORMAT TEMPS
// ============================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
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
// 🎵 CHARGER MUSIQUE
// ============================================================

function loadSong(index) {

    if (
        !audio ||
        !currentPlaylist ||
        currentPlaylist.length === 0
    ) {

        return;

    }

    currentIndex = index;

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
        progressBar.value = 0;
    }


    if (currentTime) {
        currentTime.textContent = "0:00";
    }


    if (duration) {
        duration.textContent = "0:00";
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

        await audio.play();

        isPlaying = true;

        updatePlayer();


        if (radioStatus) {

            radioStatus.textContent =
                "🔴 EN LECTURE";

        }

    } catch (error) {

        isPlaying = false;

        updatePlayer();

        console.error(
            "❌ Lecture impossible :",
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

    isPlaying = false;

    updatePlayer();


    if (radioStatus) {

        radioStatus.textContent =
            "🤖 PROGRAMME AUTOMATIQUE";

    }

}


// ============================================================
// 🔄 INTERFACE
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


// ============================================================
// ▶️ BOUTON PRINCIPAL
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
// ▶️ BOUTON LECTEUR
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
                    !playlists[playlistName]
                ) {

                    console.error(
                        "❌ Playlist inconnue :",
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

    }
);


// ============================================================
// 🔊 VOLUME LECTEUR
// ============================================================

if (volumeBar) {

    volumeBar.addEventListener(
        "input",
        () => {

            const volume =
                Number(volumeBar.value);

            if (audio) {
                audio.volume = volume;
            }

            if (settingsVolume) {
                settingsVolume.value = volume;
            }

        }
    );


    volumeBar.addEventListener(
        "change",
        () => {

            sauvegarderParametre(
                "volume",
                Number(volumeBar.value)
            );

        }
    );

}


// ============================================================
// ⏱️ DURÉE
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


            const pourcentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            if (progressBar) {

                progressBar.value =
                    pourcentage;

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

            isPlaying = false;

            updatePlayer();


            if (currentTitle) {

                currentTitle.textContent =
                    "Erreur audio ❌";

            }


            if (currentArtist) {

                currentArtist.textContent =
                    "Impossible de charger ce morceau.";

            }

        }
    );

}


// ============================================================
// 🚀 DÉMARRAGE
// ============================================================

loadSong(0);

updatePlayer();


if (settingsPanel) {

    settingsPanel.hidden = true;
    settingsPanel.style.display = "none";

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
