const roster = window.characterRoster || [];
const characterDetails = window.characterDetails || {};

const appState = {
    selectedCharacterId: "apollo"
};


function getSelectedCharacter() {
    return roster.find((character) => {
        return character.id === appState.selectedCharacterId;
    }) || roster[0];
}


function setCharacterAccent(character) {
    document.documentElement.style.setProperty(
        "--character-accent",
        character.accent
    );
}


function renderHeader(character) {
    const playerElement = document.querySelector(".character-title .eyebrow");
    const nameElement = document.querySelector(".character-title h1");
    const subtitleElement = document.querySelector(".character-subtitle");

    if (playerElement) {
        playerElement.textContent = `Player: ${character.player}`;
    }

    if (nameElement) {
        nameElement.textContent = character.name;
    }

    if (subtitleElement) {
        subtitleElement.innerHTML =
            character.subtitle || "Character data coming soon";
    }
}


function renderCharacterSelector() {
    const selector = document.querySelector(".character-selector");

    if (!selector) {
        return;
    }

    selector.innerHTML = "";

    roster.forEach((character) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "character-selector-button";
        button.dataset.character = character.id;
        button.style.setProperty("--selector-accent", character.accent);
        button.setAttribute("aria-pressed", "false");

        button.innerHTML = `
            <span class="selector-name">${character.name}</span>
            <span class="selector-player">${character.player}</span>
        `;

        button.addEventListener("click", () => {
            selectCharacter(character.id);
        });

        selector.appendChild(button);
    });
}


function updateCharacterSelector(character) {
    const buttons = document.querySelectorAll(".character-selector-button");

    buttons.forEach((button) => {
        const isActive = button.dataset.character === character.id;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}


function setApolloContentVisible(isVisible) {
    const apolloView = document.querySelector(".apollo-view");
    const apolloOnlySections = document.querySelectorAll(".apollo-only");

    if (apolloView) {
        apolloView.hidden = !isVisible;
    }

    apolloOnlySections.forEach((section) => {
        section.hidden = !isVisible;
    });
}


function renderPlaceholder(character) {
    const placeholderSection = document.querySelector(".placeholder-section");
    const nameElement = document.querySelector(".placeholder-name");
    const playerElement = document.querySelector(".placeholder-player");
    const accentElement = document.querySelector(".placeholder-accent");
    const accentSwatch = document.querySelector(".accent-swatch");
    const temporaryLink = document.querySelector(".temporary-character-link");

    if (!placeholderSection) {
        return;
    }

    placeholderSection.hidden = character.status !== "placeholder";

    if (nameElement) {
        nameElement.textContent = character.name;
    }

    if (playerElement) {
        playerElement.textContent = character.player;
    }

    if (accentElement) {
        accentElement.textContent = character.accent;
    }

    if (accentSwatch) {
        accentSwatch.style.background = character.accent;
    }

    if (temporaryLink) {
        temporaryLink.hidden = !character.temporaryLink;

        if (character.temporaryLink) {
            temporaryLink.href = character.temporaryLink.url;
            temporaryLink.textContent = character.temporaryLink.label;
        }
    }
}


function renderHP(stats) {
    const currentHPElement = document.querySelector(".hp-current");
    const maxHPElement = document.querySelector(".hp-max");
    const hpBarFill = document.querySelector(".hp-bar-fill");

    if (!stats) {
        return;
    }

    const hpPercent =
        (stats.currentHP / stats.maxHP) * 100;

    if (currentHPElement) {
        currentHPElement.textContent = stats.currentHP;
    }

    if (maxHPElement) {
        maxHPElement.textContent = stats.maxHP;
    }

    if (hpBarFill) {
        hpBarFill.style.width = `${hpPercent}%`;
    }
}


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


function renderSouls(souls) {
    if (!souls) {
        return;
    }

    Object.entries(souls).forEach(([soulName, soul]) => {
        updateSoulCard(soulName, soul);
    });
}


function updateMainNavigation(character) {
    const mainNav = document.querySelector(".main-nav");

    if (!mainNav) {
        return;
    }

    mainNav.hidden = character.status !== "complete";
}


function renderCharacter(character) {
    const details = characterDetails[character.id] || {};
    const isApollo = character.id === "apollo";

    setCharacterAccent(character);
    renderHeader(character);
    updateCharacterSelector(character);
    updateMainNavigation(character);
    setApolloContentVisible(isApollo);
    renderPlaceholder(character);

    if (isApollo) {
        renderHP(details.stats);
        renderSouls(details.souls);
    }
}


function selectCharacter(characterId) {
    appState.selectedCharacterId = characterId;
    renderCharacter(getSelectedCharacter());
}


renderCharacterSelector();
renderCharacter(getSelectedCharacter());
