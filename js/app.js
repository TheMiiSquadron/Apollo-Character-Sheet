const soulData = {
    determination: {
        level: 2,
        progress: 6,
        threshold: 35
    },

    bravery: {
        level: 0,
        progress: 11,
        threshold: 35
    },

    justice: {
        level: 0,
        progress: 3,
        threshold: 35
    },

    kindness: {
        level: 1,
        progress: 7,
        threshold: 35
    },

    patience: {
        level: 0,
        progress: 3,
        threshold: 35
    },

    integrity: {
        level: 0,
        progress: 2,
        threshold: 35
    },

    perseverance: {
        level: 0,
        progress: 1,
        threshold: 35
    },

    fear: {
        level: 0,
        progress: 2,
        threshold: 50
    },

    hate: {
        level: 0,
        progress: 0,
        threshold: 100
    }
};


function updateSoulCard(soulName, soul) {
    const card = document.querySelector(`.soul-card.${soulName}`);

    if (!card) {
        console.warn(`Soul card not found: ${soulName}`);
        return;
    }

    const levelElement = card.querySelector(".soul-level");
    const progressFill = card.querySelector(".progress-fill");
    const progressText = card.querySelector(".progress-text");

    const progressPercent =
        (soul.progress / soul.threshold) * 100;

    if (levelElement) {
        levelElement.textContent = `Level ${soul.level}`;
    }

    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }

    if (progressText) {
        progressText.textContent =
            `${soul.progress} / ${soul.threshold}`;
    }
}


function renderSouls() {
    Object.entries(soulData).forEach(([soulName, soul]) => {
        updateSoulCard(soulName, soul);
    });
}


renderSouls();
