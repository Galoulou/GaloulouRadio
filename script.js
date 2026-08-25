function showChristmasMessage() {

    const message = document.createElement("div");

    message.className = "christmas-message";

    message.innerHTML = `
        🎁 <strong>VOTRE CADEAU DE NOËL 2026 !</strong>
        <span>GaloulouRadio arrive bientôt...</span>
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.classList.add("hide");
    }, 4500);

    setTimeout(() => {
        message.remove();
    }, 5000);
}
const playButton = document.getElementById("playButton");
const mainPlay = document.getElementById("mainPlay");

const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const radioAudio = document.getElementById("radioAudio");

let playing = false;


/*
    GALoulouRadio V1

    Pour l'instant aucune source audio réelle
    n'est branchée.

    Quand ton flux radio sera prêt, on mettra
    son URL dans radioAudio.src.
*/


if (!radioAudio.src) {

    currentTitle.textContent = "GaloulouRadio";

    currentArtist.textContent =
        "Le direct sera bientôt disponible 🎙️";

    showChristmasMessage();

    return;

}
    radioAudio.play();

    playing = true;

    updateButtons();

}


function stopRadio() {

    radioAudio.pause();

    playing = false;

    updateButtons();

}


function updateButtons() {

    if (playing) {

        playButton.textContent = "⏸ Mettre en pause";

        mainPlay.textContent = "⏸";

    } else {

        playButton.textContent =
            "▶ Écouter GaloulouRadio";

        mainPlay.textContent = "▶";

    }

}


playButton.addEventListener("click", () => {

    if (playing) {

        stopRadio();

    } else {

        startRadio();

    }

});


mainPlay.addEventListener("click", () => {

    if (playing) {

        stopRadio();

    } else {

        startRadio();

    }

});


radioAudio.addEventListener("ended", () => {

    playing = false;

    updateButtons();

});
