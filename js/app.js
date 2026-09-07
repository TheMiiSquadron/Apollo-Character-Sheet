const campaignSections = window.campaignSections || [];
const campaignTools = window.campaignTools || [];
const roster = window.characterRoster || [];
const characterDetails = window.characterDetails || {};

const appState = {
    activeCampaignView: "home",
    selectedCharacterId: "apollo",
    selectedToolId: "dice-roller"
};


function getCampaignSection(viewId) {
    return campaignSections.find((section) => {
        return section.id === viewId;
    }) || campaignSections[0];
}


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


function renderHeaderForCampaign(section) {
    const eyebrowElement = document.querySelector(".character-title .eyebrow");
    const nameElement = document.querySelector(".character-title h1");
    const subtitleElement = document.querySelector(".character-subtitle");

    if (eyebrowElement) {
        eyebrowElement.textContent = section.eyebrow;
    }

    if (nameElement) {
        nameElement.textContent = section.title;
    }

    if (subtitleElement) {
        subtitleElement.textContent = section.subtitle;
    }
}


function renderHeaderForCharacter(character) {
    const eyebrowElement = document.querySelector(".character-title .eyebrow");
    const nameElement = document.querySelector(".character-title h1");
    const subtitleElement = document.querySelector(".character-subtitle");

    if (eyebrowElement) {
        eyebrowElement.textContent = `Player: ${character.player}`;
    }

    if (nameElement) {
        nameElement.textContent = character.name;
    }

    if (subtitleElement) {
        subtitleElement.innerHTML =
            character.subtitle || "Character data coming soon";
    }
}


function renderCampaignNavigation() {
    const nav = document.querySelector(".campaign-nav");

    if (!nav) {
        return;
    }

    nav.innerHTML = "";

    campaignSections.forEach((section) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "campaign-nav-button";
        button.dataset.campaignView = section.id;
        button.setAttribute("aria-pressed", "false");
        button.textContent = section.label;

        button.addEventListener("click", () => {
            selectCampaignView(section.id);
        });

        nav.appendChild(button);
    });
}


function updateCampaignNavigation() {
    const buttons = document.querySelectorAll(".campaign-nav-button");

    buttons.forEach((button) => {
        const isActive =
            button.dataset.campaignView === appState.activeCampaignView;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
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


function renderCampaignTools() {
    const toolGrid = document.querySelector(".tool-grid");

    if (!toolGrid) {
        return;
    }

    toolGrid.innerHTML = "";

    campaignTools.forEach((tool) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "tool-card card";
        button.dataset.tool = tool.id;
        button.setAttribute("aria-pressed", "false");
        button.textContent = tool.label;

        button.addEventListener("click", () => {
            selectCampaignTool(tool.id);
        });

        toolGrid.appendChild(button);
    });

    renderCampaignToolDetail();
}


function getSelectedTool() {
    return campaignTools.find((tool) => {
        return tool.id === appState.selectedToolId;
    }) || campaignTools[0];
}


function renderCampaignToolDetail() {
    const tool = getSelectedTool();
    const titleElement = document.querySelector(".tool-detail-title");
    const descriptionElement =
        document.querySelector(".tool-detail-description");
    const diceRollerPanel = document.querySelector(".dice-roller-panel");
    const buttons = document.querySelectorAll(".tool-card");

    if (!tool) {
        return;
    }

    buttons.forEach((button) => {
        const isActive = button.dataset.tool === tool.id;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    if (titleElement) {
        titleElement.textContent = tool.label;
    }

    if (descriptionElement) {
        descriptionElement.textContent = tool.placeholder;
        descriptionElement.hidden = tool.id === "dice-roller";
    }

    if (diceRollerPanel) {
        diceRollerPanel.hidden = tool.id !== "dice-roller";
    }
}


function selectCampaignTool(toolId) {
    appState.selectedToolId = toolId;
    renderCampaignToolDetail();
}


function getDiceColorValue() {
    const diceColor = document.getElementById("diceColor");
    const customDiceColor = document.getElementById("customDiceColor");
    const colorValue = diceColor ? diceColor.value : "white";
    const customColor = customDiceColor ? customDiceColor.value : "#8bb8ff";
    const diceColors = {
        red: "#ff7b7b",
        orange: "#ffb366",
        yellow: "#ffe680",
        green: "#9cffb2",
        blue: "#8bb8ff",
        purple: "#d5a3ff",
        white: "#ffffff",
        custom: customColor
    };

    return diceColors[colorValue] || diceColors.white;
}


function setRollResultColor(color) {
    document.documentElement.style.setProperty(
        "--roll-result-color",
        color
    );
}


function getRollMode() {
    const selectedModeInput =
        document.querySelector('input[name="rollMode"]:checked');

    return selectedModeInput ? selectedModeInput.value : "normal";
}


function clearDcOutcome() {
    const dcOutcome = document.getElementById("dcOutcome");

    if (!dcOutcome) {
        return;
    }

    dcOutcome.textContent = "";
    dcOutcome.classList.remove("show", "success", "failure", "impossible");
}


function showDcOutcome(result) {
    const dcOutcome = document.getElementById("dcOutcome");

    if (!dcOutcome) {
        return;
    }

    dcOutcome.textContent = result.label;
    dcOutcome.classList.remove("show", "success", "failure", "impossible");
    void dcOutcome.offsetWidth;
    dcOutcome.classList.add("show", result.className);
}


function rollSingleDie(numberOfSides) {
    return Math.floor(Math.random() * numberOfSides) + 1;
}


function rollDice() {
    const inputField = document.getElementById("diceInput");
    const resultArea = document.getElementById("resultArea");
    const dcInput = document.getElementById("dcTarget");

    if (!inputField || !resultArea || !dcInput) {
        return;
    }

    const input = inputField.value.replace(/\s+/g, "");
    const parsed = input.match(/^(\d+)d(\d+)([+-]\d+)?$/i);

    if (!parsed) {
        resultArea.value =
            "Invalid input. Use a dice expression like 2d6+3 or 1d20-1.";
        clearDcOutcome();
        return;
    }

    const numberOfDice = parseInt(parsed[1], 10);
    const numberOfSides = parseInt(parsed[2], 10);
    const modifier = parsed[3] ? parseInt(parsed[3], 10) : 0;

    if (
        Number.isNaN(numberOfDice) ||
        Number.isNaN(numberOfSides) ||
        Number.isNaN(modifier) ||
        numberOfDice <= 0 ||
        numberOfSides <= 0
    ) {
        resultArea.value =
            "Invalid numbers. Dice count and side count must be positive.";
        clearDcOutcome();
        return;
    }

    const rollMode = getRollMode();
    const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    const modeLabel = rollMode === "normal" ? "" : ` (${rollMode})`;
    let result =
        `Rolling ${numberOfDice}d${numberOfSides}` +
        `${modifier !== 0 ? modifierText : ""}${modeLabel}...\n\n`;
    let total = 0;

    for (let i = 1; i <= numberOfDice; i++) {
        if (rollMode === "normal") {
            const roll = rollSingleDie(numberOfSides);
            result += `Die ${i}: ${roll}\n`;
            total += roll;
        } else {
            const rollA = rollSingleDie(numberOfSides);
            const rollB = rollSingleDie(numberOfSides);
            const kept =
                rollMode === "advantage"
                    ? Math.max(rollA, rollB)
                    : Math.min(rollA, rollB);

            result += `Die ${i}: ${rollA} / ${rollB} -> ${kept}\n`;
            total += kept;
        }
    }

    total += modifier;
    result += `\nModifier: ${modifier}\n`;
    result += `Total: ${total}\n`;

    const dcRaw = dcInput.value.trim();

    if (dcRaw) {
        const dcValue = parseInt(dcRaw, 10);

        if (Number.isNaN(dcValue) || dcValue < 0) {
            resultArea.value = "Invalid number to pass. Use 0 or higher.";
            clearDcOutcome();
            return;
        }

        const maxPossibleTotal = (numberOfDice * numberOfSides) + modifier;
        const impossible = dcValue > maxPossibleTotal;
        const passed = total >= dcValue;
        const outcome = impossible
            ? {
                label: "IMPOSSIBLE",
                className: "impossible"
            }
            : {
                label: passed ? "SUCCESS" : "FAILURE",
                className: passed ? "success" : "failure"
            };

        result += `Number To Pass: ${dcValue}`;
        result += ` (${outcome.label})\n`;
        showDcOutcome(outcome);
    } else {
        clearDcOutcome();
    }

    result += `Highest Possible Roll: ${(numberOfDice * numberOfSides) + modifier}`;
    resultArea.value = result;
    setRollResultColor(getDiceColorValue());
}


function setupDiceRoller() {
    const rollButton = document.getElementById("rollBtn");
    const diceInput = document.getElementById("diceInput");
    const diceColor = document.getElementById("diceColor");
    const customDiceColor = document.getElementById("customDiceColor");
    const customColorWrap = document.getElementById("customColorWrap");

    if (rollButton) {
        rollButton.addEventListener("click", rollDice);
    }

    if (diceInput) {
        diceInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                rollDice();
            }
        });
    }

    document.querySelectorAll("[data-dice]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!diceInput) {
                return;
            }

            diceInput.value = button.dataset.dice;
            diceInput.focus();
        });
    });

    if (diceColor) {
        diceColor.addEventListener("change", () => {
            if (customColorWrap) {
                customColorWrap.classList.toggle(
                    "show",
                    diceColor.value === "custom"
                );
            }

            setRollResultColor(getDiceColorValue());
        });
    }

    if (customDiceColor) {
        customDiceColor.addEventListener("input", () => {
            if (diceColor && diceColor.value === "custom") {
                setRollResultColor(getDiceColorValue());
            }
        });
    }

    setRollResultColor(getDiceColorValue());
}


function updateCharacterSelector(character) {
    const buttons = document.querySelectorAll(".character-selector-button");

    buttons.forEach((button) => {
        const isActive = button.dataset.character === character.id;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}


function setCampaignViewsVisible() {
    const views = document.querySelectorAll(".campaign-view");

    views.forEach((view) => {
        view.hidden =
            view.dataset.campaignView !== appState.activeCampaignView;
    });
}


function setCharacterAreaVisible(isVisible) {
    const characterSelectorSection =
        document.querySelector(".character-selector-section");

    if (characterSelectorSection) {
        characterSelectorSection.hidden = !isVisible;
    }

    if (!isVisible) {
        setApolloContentVisible(false);
        renderPlaceholder(null);
    }
}


function setApolloContentVisible(isVisible) {
    const apolloOnlySections = document.querySelectorAll(".apollo-only");

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

    placeholderSection.hidden =
        !character || character.status !== "placeholder";

    if (!character) {
        return;
    }

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

    mainNav.hidden = appState.activeCampaignView !== "characters";
}


function renderCharacter(character) {
    const details = characterDetails[character.id] || {};
    const isApollo = character.id === "apollo";

    setCharacterAccent(character);
    renderHeaderForCharacter(character);
    updateCharacterSelector(character);
    updateMainNavigation(character);
    setApolloContentVisible(isApollo);
    renderPlaceholder(isApollo ? null : character);

    if (isApollo) {
        renderHP(details.stats);
        renderSouls(details.souls);
    }
}


function renderCampaignView() {
    const activeSection = getCampaignSection(appState.activeCampaignView);
    const isCharacterView = appState.activeCampaignView === "characters";

    updateCampaignNavigation();
    setCampaignViewsVisible();
    setCharacterAreaVisible(isCharacterView);

    if (isCharacterView) {
        renderCharacter(getSelectedCharacter());
        return;
    }

    setCharacterAccent({
        accent: "#FF0000"
    });
    updateMainNavigation({
        id: ""
    });
    renderHeaderForCampaign(activeSection);
}


function selectCampaignView(viewId) {
    appState.activeCampaignView = viewId;
    renderCampaignView();
}


function selectCharacter(characterId) {
    appState.selectedCharacterId = characterId;
    appState.activeCampaignView = "characters";
    renderCampaignView();
}


document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => {
        selectCampaignView(button.dataset.viewTarget);
    });
});

renderCampaignNavigation();
renderCharacterSelector();
renderCampaignTools();
setupDiceRoller();
renderCampaignView();
