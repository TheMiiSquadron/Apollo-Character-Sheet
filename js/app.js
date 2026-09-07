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
    }
}


function selectCampaignTool(toolId) {
    appState.selectedToolId = toolId;
    renderCampaignToolDetail();
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
renderCampaignView();
