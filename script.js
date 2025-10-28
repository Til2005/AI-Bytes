// ===============================
//   CONSTANTS & CONFIGURATION
// ===============================
const CONFIG = {
    PHYSICS: {
        GRAVITY: 0.4,
        JUMP_POWER: -9,
        MOVE_SPEED: 3,
        FALL_THRESHOLD: 300,
        COLLISION_TOLERANCE: 30
    },
    MOMAN: {
        WIDTH: 60,
        HEIGHT: 60,
        SPAWN_OFFSET_Y: 42
    },
    ANIMATIONS: {
        MOMAN_STAND_FRAMES: 24,
        MOMAN_RUN_FRAMES: 48,
        MOMAN_JUMP_FRAMES: 42,
        COIN_FRAMES: 24,
        FRAME_RATE: 16, // ~60 FPS
        MOMAN_ANIM_SPEED: 25,
        COIN_ANIM_SPEED: 83
    },
    PATHS: {
        MOMAN_STAND: 'Mo_man_Stand_Pose/',
        MOMAN_RUN: 'Mo man Lauf 2s 24fps 48 frames/',
        MOMAN_JUMP: 'Mo_man_Sprung_Pose/',
        COINS: 'Coin_animation/',
        TXP_STAND: 'TXP/TXP_Stand_Pose/',
        TXP_TALK: 'TXP/TXP_Talk_Pose/',
        TXP_LAUF: 'TXP/TXP_Lauf_Pose/',
        TXP_SPRUNG: 'TXP/TXP_Sprung_Pose/'
    },
    ACHIEVEMENTS: {
        M_KEY_TARGET: 30,
        ANIMATOR_TARGET: 6,
        COIN_TARGET: 3,
        GOLD_RANK_TARGET: 1
    }
};

// ===============================
//   GAME STATE
// ===============================
const GameState = {
    moMan: {
        x: 0,
        y: 0,
        velocityY: 0,
        isGrounded: false,
        visible: true,
        facingRight: true,
        currentAnimation: 'standing',
        animationFrame: 0,
        jumpAnimationFrame: 0,
        jumpAnimationCounter: 0
    },
    input: {
        keysPressed: {}
    },
    game: {
        coins: [],
        coinsCollected: 0,
        platforms: [],
        gameLoop: null,
        animationLoop: null
    },
    dom: {
        // Cached DOM elements
        moCharacter: null,
        container: null,
        mainTitle: null,
        levelsTitle: null,
        firstLetter: null,
        titleContainer: null,
        settingsPopup: null,
        achievementsPopup: null
    }
};

// ===============================
//   DOM CACHE INITIALIZATION
// ===============================
function initDOMCache() {
    GameState.dom.moCharacter = document.getElementById('moCharacter');
    GameState.dom.container = document.querySelector('.container');
    GameState.dom.mainTitle = document.querySelector('.main-title');
    GameState.dom.levelsTitle = document.querySelector('.levels-title');
    GameState.dom.titleContainer = document.querySelector('.title-container');
    GameState.dom.settingsPopup = document.getElementById('settingsPopup');
    GameState.dom.achievementsPopup = document.getElementById('achievementsPopup');
    GameState.dom.firstLetter = document.querySelector('.main-title span[data-index="0"]');
}

// Settings popup functionality
function openSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        settingsPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        settingsPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Background switching functionality
function changeBackground(backgroundName) {
    const body = document.body;

    // Remove any existing background classes
    body.classList.remove('bg-gradient', 'bg-image');

    if (backgroundName === 'gradient') {
        // Use CSS gradient
        body.classList.add('bg-gradient');
        body.style.backgroundImage = 'none';
    } else {
        // Use image background
        body.classList.add('bg-image');
        body.style.backgroundImage = `url('assets/images/${backgroundName}')`;
    }

    // Update active selection (only if bg-options exist)
    document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.remove('active');
    });

    const bgOption = document.querySelector(`[data-bg="${backgroundName}"]`);
    if (bgOption) {
        bgOption.classList.add('active');
    }

    // Save selection to localStorage
    localStorage.setItem('selectedBackground', backgroundName);

    // Close settings (only if settings popup exists)
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) {
        closeSettings();
    }
}

// Load saved background on page load
function loadSavedBackground() {
    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
        changeBackground(savedBackground);
    } else {
        // Set default gradient as active (only if bg-options exist)
        const gradientOption = document.querySelector('[data-bg="gradient"]');
        if (gradientOption) {
            gradientOption.classList.add('active');
        }
    }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('settingsPopup');
    const popupContent = document.querySelector('.popup-content');
    const settingsBtn = document.querySelector('.settings-btn');

    if (event.target === popup && !popupContent.contains(event.target)) {
        closeSettings();
    }
});

// Prevent popup close when clicking inside popup content (only if popup exists)
const popupContent = document.querySelector('.popup-content');
if (popupContent) {
    popupContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Function to get level rank from stored progress
function getRank(score) {
    if (score >= 50) return { title: "Gold 🥇", description: "Perfekte Prompt-Meisterschaft!" };
    if (score >= 40) return { title: "Silber 🥈", description: "Sehr gute Leistung!" };
    if (score >= 25) return { title: "Bronze 🥉", description: "Solider Prompt-Anfang!" };
    return { title: "Kein Rang", description: "Weiter üben!" };
}

// Load and display level ranks
function loadLevelRanks() {
    // Load Level 1 progress
    const level1Progress = localStorage.getItem('aiBytes_level1_progress');
    if (level1Progress) {
        const progress = JSON.parse(level1Progress);
        if (progress.completed && progress.score !== undefined) {
            const rank = getRank(progress.score);
            const level1Status = document.querySelector('.level-1 .level-status');
            if (level1Status) {
                level1Status.textContent = rank.title;
                level1Status.style.background = 'var(--saffron)';
                level1Status.style.color = 'var(--russian-blue)';
            }
        }
    }

    // Load Level 2 progress
    const level2Progress = localStorage.getItem('aiBytes_level2_progress');
    if (level2Progress) {
        const progress = JSON.parse(level2Progress);
        if (progress.completed && progress.rank) {
            const level2Status = document.querySelector('.level-2 .level-status');
            if (level2Status) {
                level2Status.textContent = progress.rank;
                level2Status.style.background = 'var(--saffron)';
                level2Status.style.color = 'var(--russian-blue)';
            }
        }
    }

    // Load Level 3 progress
    const level3Progress = localStorage.getItem('aiBytes_level3_progress');
    if (level3Progress) {
        const progress = JSON.parse(level3Progress);
        if (progress.completed && progress.rank) {
            const level3Status = document.querySelector('.level-3 .level-status');
            if (level3Status) {
                level3Status.textContent = progress.rank;
                level3Status.style.background = 'var(--saffron)';
                level3Status.style.color = 'var(--russian-blue)';
            }
        }
    }

    // Load Level 4 progress
    const level4Progress = localStorage.getItem('aiBytes_level4_progress');
    if (level4Progress) {
        const progress = JSON.parse(level4Progress);
        if (progress.completed && progress.rank) {
            const level4Status = document.querySelector('.level-4 .level-status');
            if (level4Status) {
                level4Status.textContent = progress.rank;
                level4Status.style.background = 'var(--saffron)';
                level4Status.style.color = 'var(--russian-blue)';
            }
        }
    }

    // Check if secret level should be unlocked
    checkSecretLevel();
}

// Check if all levels have Gold rank to unlock secret level
function checkSecretLevel() {
    const secretLevel = document.querySelector('.level-9');
    if (!secretLevel) return;

    // For now, only check Level 1 since it's the only one implemented
    // Later this can be expanded to check all levels 1-8
    const level1Progress = localStorage.getItem('aiBytes_level1_progress');
    let hasAllGold = false;

    if (level1Progress) {
        const progress = JSON.parse(level1Progress);
        // Check if Level 1 has Gold rank
        hasAllGold = progress.rank === "Gold 🥇";
    }

    // Update secret level appearance
    if (hasAllGold) {
        secretLevel.classList.remove('locked');
        secretLevel.classList.add('unlocked');
        secretLevel.style.cursor = 'pointer';

        const status = secretLevel.querySelector('.level-status');
        if (status) {
            status.textContent = 'Freigeschaltet!';
            status.style.background = 'linear-gradient(45deg, var(--saffron), var(--amethyst))';
            status.style.color = 'var(--russian-blue)';
        }

        const description = secretLevel.querySelector('.level-description');
        if (description) {
            description.textContent = '🎉 Herzlichen Glückwunsch! Du hast das geheime Level freigeschaltet!';
        }

        // Add click handler for unlocked secret level
        secretLevel.onclick = function() {
            alert('🎉 Das geheime Level ist noch in Entwicklung! Bleib dran für mehr Prompt-Abenteuer!');
        };
    } else {
        // Keep locked state
        secretLevel.onclick = function() {
            alert('🔒 Erreiche erst Gold-Rang in allen Leveln um dieses geheime Level freizuschalten!');
        };
    }
}

// ===============================
//   MO MAN CHARACTER SYSTEM
// ===============================
// Mo Man Character Controls - Mario Bros style with Animation and Physics
// (All state now managed in GameState object)

function initializeMoMan() {
    const moChar = GameState.dom.moCharacter;
    if (!moChar) return;

    // Position Mo Man over the L (first letter)
    const firstLetter = GameState.dom.firstLetter;
    const containerRect = GameState.dom.titleContainer;

    if (firstLetter && containerRect) {
        const letterRect = firstLetter.getBoundingClientRect();
        const contRect = containerRect.getBoundingClientRect();
        GameState.moMan.x = letterRect.left - contRect.left + (letterRect.width / 2) - (CONFIG.MOMAN.WIDTH / 2);

        // Start Mo Man directly on the first letter
        const letterTop = letterRect.top - contRect.top;
        GameState.moMan.y = letterTop - CONFIG.MOMAN.SPAWN_OFFSET_Y;
        GameState.moMan.isGrounded = true;
        moChar.style.left = GameState.moMan.x + 'px';
        moChar.style.top = GameState.moMan.y + 'px';

        // Highlight the L
        firstLetter.classList.add('highlighted');
    }

    // Start Mo Man animation
    startMoManAnimation();

    // Start game loop
    startGameLoop();
}

function startMoManAnimation() {
    GameState.game.animationLoop = setInterval(() => {
        updateMoManAnimation();
    }, CONFIG.ANIMATIONS.MOMAN_ANIM_SPEED);
}

function updateMoManAnimation() {
    const moChar = GameState.dom.moCharacter;
    if (!moChar) return;

    const state = GameState.moMan;

    if (state.currentAnimation === 'jumping') {
        // Update jump animation slower (every 3rd call)
        state.jumpAnimationCounter++;
        if (state.jumpAnimationCounter >= 3) {
            state.jumpAnimationCounter = 0;

            // Handle jumping animation with special frame names
            let jumpFrameName;
            if (state.jumpAnimationFrame === 27) {
                jumpFrameName = 'Mo man Sprung_00027_a.png';
            } else if (state.jumpAnimationFrame === 28) {
                jumpFrameName = 'Mo man Sprung_00028_b.png';
            } else {
                const frameNumber = String(state.jumpAnimationFrame).padStart(5, '0');
                jumpFrameName = `Mo man Sprung_${frameNumber}.png`;
            }

            moChar.src = `${CONFIG.PATHS.MOMAN_JUMP}${jumpFrameName}`;
        }
    } else if (state.currentAnimation === 'running') {
        const frameNumber = String(state.animationFrame).padStart(5, '0');
        moChar.src = `${CONFIG.PATHS.MOMAN_RUN}Mo man Lauf Pose_${frameNumber}.png`;
        state.animationFrame = (state.animationFrame + 1) % CONFIG.ANIMATIONS.MOMAN_RUN_FRAMES;
    } else {
        const frameNumber = String(state.animationFrame).padStart(5, '0');
        moChar.src = `${CONFIG.PATHS.MOMAN_STAND}Mo man Stand Pose_${frameNumber}.png`;
        state.animationFrame = (state.animationFrame + 1) % CONFIG.ANIMATIONS.MOMAN_STAND_FRAMES;
    }

    // Apply direction (flip horizontally if facing left)
    moChar.style.transform = state.facingRight ? 'scaleX(1)' : 'scaleX(-1)';
}

function updateJumpFrame() {
    // Map jump velocity to animation frame (42 frames total, 0-41)
    // Frame 27-28 is the peak of the jump
    const state = GameState.moMan;
    const maxJumpVelocity = Math.abs(CONFIG.PHYSICS.JUMP_POWER);

    if (state.velocityY <= 0) {
        // Rising phase: map velocity -9 to 0 → frames 0 to 27
        const progress = 1 - (Math.abs(state.velocityY) / maxJumpVelocity);
        state.jumpAnimationFrame = Math.floor(progress * 27);
        state.jumpAnimationFrame = Math.max(0, Math.min(27, state.jumpAnimationFrame));
    } else {
        // Falling phase: map velocity 0 to +9 → frames 27 to 41
        const progress = Math.min(state.velocityY / maxJumpVelocity, 1);
        state.jumpAnimationFrame = 27 + Math.floor(progress * 14);
        state.jumpAnimationFrame = Math.max(27, Math.min(41, state.jumpAnimationFrame));
    }
}

function startGameLoop() {
    GameState.game.gameLoop = setInterval(() => {
        updateGamePhysics();
    }, CONFIG.ANIMATIONS.FRAME_RATE);
}

function updateGamePhysics() {
    const state = GameState.moMan;
    const moChar = GameState.dom.moCharacter;

    // Skip physics if Mo Man is not visible
    if (!state.visible || !moChar) return;

    // Handle horizontal movement
    let isMoving = false;
    const keys = GameState.input.keysPressed;

    if (keys['ArrowLeft']) {
        state.x -= CONFIG.PHYSICS.MOVE_SPEED;
        state.facingRight = false;
        isMoving = true;
    }
    if (keys['ArrowRight']) {
        state.x += CONFIG.PHYSICS.MOVE_SPEED;
        state.facingRight = true;
        isMoving = true;
    }

    // Update animation based on movement and physics
    const newAnimation = determineAnimation(state, isMoving);
    if (newAnimation !== state.currentAnimation) {
        state.currentAnimation = newAnimation;
        if (newAnimation !== 'jumping') {
            state.animationFrame = 0;
        }
        if (newAnimation === 'jumping') {
            state.jumpAnimationFrame = 0;
        }
    }

    // Apply gravity and movement
    state.velocityY += CONFIG.PHYSICS.GRAVITY;
    state.y += state.velocityY;

    // Handle collisions
    handleCollisions(state);

    // Check if fallen too far
    if (state.y > CONFIG.PHYSICS.FALL_THRESHOLD) {
        handleMoManFall(moChar);
        return;
    }

    // Update DOM
    moChar.style.left = state.x + 'px';
    moChar.style.top = state.y + 'px';

    // Update game state
    updateHighlighting();
    checkCoinCollisions();
}

function determineAnimation(state, isMoving) {
    if (!state.isGrounded && Math.abs(state.velocityY) > 0.5) {
        updateJumpFrame();
        return 'jumping';
    } else if (isMoving) {
        return 'running';
    } else {
        return 'standing';
    }
}

function handleCollisions(state) {
    // Check for platform collision first (higher priority)
    const platformLevel = checkPlatformCollisions(state.x, state.y);

    if (platformLevel !== null && state.velocityY >= 0) {
        if (state.y >= platformLevel) {
            state.y = platformLevel;
            state.velocityY = 0;
            state.isGrounded = true;
        } else {
            state.isGrounded = false;
        }
    } else {
        // Check for letter collision
        const groundLevel = checkLetterCollision(state.x, state.y);

        if (groundLevel !== null && state.velocityY >= 0) {
            if (state.y >= groundLevel) {
                state.y = groundLevel;
                state.velocityY = 0;
                state.isGrounded = true;
            } else {
                state.isGrounded = false;
            }
        } else if (groundLevel === null) {
            state.isGrounded = false;
        }
    }
}

function handleMoManFall(moChar) {
    GameState.moMan.visible = false;
    moChar.style.display = 'none';
    showRespawnUI();
}

// Collision detection with letters
// Cache letters on initialization to avoid repeated queries
let cachedLetters = null;

function getCachedLetters() {
    if (!cachedLetters) {
        cachedLetters = Array.from(document.querySelectorAll('.main-title span[data-index], .levels-title span[data-index]'));
    }
    return cachedLetters;
}

function checkLetterCollision(x, y) {
    const letters = getCachedLetters();
    const moManBottom = y + CONFIG.MOMAN.HEIGHT;

    for (let letter of letters) {
        const letterRect = letter.getBoundingClientRect();

        // Use different containers based on which title the letter belongs to
        let containerRect;
        if (letter.closest('.main-title')) {
            containerRect = GameState.dom.titleContainer?.getBoundingClientRect();
        } else {
            const levelsContainer = document.querySelector('.levels');
            containerRect = levelsContainer?.getBoundingClientRect();
        }

        if (!containerRect) continue;

        // Convert to relative coordinates
        const letterLeft = letterRect.left - containerRect.left;
        const letterRight = letterLeft + letterRect.width;
        const letterTop = letterRect.top - containerRect.top;

        // Check if Mo Man is horizontally over this letter
        const moManLeft = x;
        const moManRight = x + CONFIG.MOMAN.WIDTH;

        if (moManRight > letterLeft && moManLeft < letterRight) {
            // Calculate the ground level for this letter
            let groundLevel;
            if (letter.closest('.levels-title')) {
                groundLevel = letterTop + 75;
            } else {
                groundLevel = letterTop - CONFIG.MOMAN.SPAWN_OFFSET_Y;
            }

            // Only return collision if Mo Man is close to this letter
            const distanceToGround = Math.abs(y - groundLevel);
            if (distanceToGround < CONFIG.PHYSICS.COLLISION_TOLERANCE) {
                return groundLevel;
            }
        }
    }

    return null; // No collision
}

// ===============================
//   EVENT LISTENERS
// ===============================
const EventHandlers = {
    keydown: null,
    keyup: null,
    settingsClick: null
};

function initEventListeners() {
    // Key down handler
    EventHandlers.keydown = function(event) {
        if (!GameState.dom.mainTitle) return;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            GameState.input.keysPressed[event.key] = true;
        }

        // Jump with Arrow Up
        if (event.key === 'ArrowUp' && GameState.moMan.isGrounded) {
            event.preventDefault();
            GameState.moMan.velocityY = CONFIG.PHYSICS.JUMP_POWER;
            GameState.moMan.isGrounded = false;
        }

        // Track M key presses for achievement
        if (event.key.toLowerCase() === 'm') {
            achievementData.mKeyPresses++;
            const keymasterAchievement = achievements.easy.find(a => a.id === 'keymaster');
            if (keymasterAchievement) {
                keymasterAchievement.progress = achievementData.mKeyPresses;
                saveAchievements();
                checkAchievement('keymaster');
            }
        }
    };

    // Key up handler
    EventHandlers.keyup = function(event) {
        if (!GameState.dom.mainTitle) return;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            GameState.input.keysPressed[event.key] = false;
        }

        // Respawn with R key
        if (event.key === 'R' || event.key === 'r') {
            if (!GameState.moMan.visible) {
                respawnMoMan();
            }
        }
    };

    document.addEventListener('keydown', EventHandlers.keydown);
    document.addEventListener('keyup', EventHandlers.keyup);
}

function cleanupEventListeners() {
    if (EventHandlers.keydown) {
        document.removeEventListener('keydown', EventHandlers.keydown);
    }
    if (EventHandlers.keyup) {
        document.removeEventListener('keyup', EventHandlers.keyup);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupEventListeners);

// Respawn UI functions
function showRespawnUI() {
    // Create respawn message if it doesn't exist
    let respawnUI = document.getElementById('respawnUI');
    if (!respawnUI) {
        respawnUI = document.createElement('div');
        respawnUI.id = 'respawnUI';
        respawnUI.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, rgba(75, 0, 116, 0.95), rgba(60, 58, 165, 0.95));
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            z-index: 10000;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            backdrop-filter: blur(20px);
            animation: respawnPulse 2s ease-in-out infinite;
            transition: all 0.3s ease;
        `;
        respawnUI.innerHTML = 'Drücke <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-weight: bold;">R</span> zum Respawnen';
        document.body.appendChild(respawnUI);
    }
    respawnUI.style.display = 'block';
}

function hideRespawnUI() {
    const respawnUI = document.getElementById('respawnUI');
    if (respawnUI) {
        respawnUI.style.display = 'none';
    }
}

function respawnMoMan() {
    const firstLetter = GameState.dom.firstLetter;
    const moChar = GameState.dom.moCharacter;
    const containerRect = GameState.dom.titleContainer;

    if (!firstLetter || !moChar || !containerRect) return;

    // Reset Mo Man to starting position
    const letterRect = firstLetter.getBoundingClientRect();
    const contRect = containerRect.getBoundingClientRect();

    GameState.moMan.x = letterRect.left - contRect.left + (letterRect.width / 2) - (CONFIG.MOMAN.WIDTH / 2);
    const letterTop = letterRect.top - contRect.top;
    GameState.moMan.y = letterTop - CONFIG.MOMAN.SPAWN_OFFSET_Y;
    GameState.moMan.velocityY = 0;
    GameState.moMan.isGrounded = true;
    GameState.moMan.visible = true;

    // Show Mo Man again
    moChar.style.display = 'block';
    moChar.style.left = GameState.moMan.x + 'px';
    moChar.style.top = GameState.moMan.y + 'px';

    // Hide respawn UI
    hideRespawnUI();

    // Reset all coins
    resetCoins();

    // Highlight the L again
    const letters = getCachedLetters();
    letters.forEach(span => span.classList.remove('highlighted'));
    firstLetter.classList.add('highlighted');
}

function getCurrentLetter() {
    const letters = getCachedLetters();
    const state = GameState.moMan;
    let closestLetter = null;
    let closestDistance = Infinity;

    letters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        let containerRect;

        if (letter.closest('.main-title')) {
            containerRect = GameState.dom.titleContainer?.getBoundingClientRect();
        } else {
            const levelsContainer = document.querySelector('.levels');
            containerRect = levelsContainer?.getBoundingClientRect();
        }

        if (!containerRect) return;

        const letterCenter = letterRect.left - containerRect.left + (letterRect.width / 2);
        const moCenter = state.x + (CONFIG.MOMAN.WIDTH / 2);
        const distance = Math.abs(letterCenter - moCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestLetter = letter;
        }
    });

    return closestLetter;
}

function updateHighlighting() {
    // Remove all highlights
    const letters = getCachedLetters();
    letters.forEach(span => span.classList.remove('highlighted'));

    // Highlight closest letter
    const closestLetter = getCurrentLetter();
    if (closestLetter) {
        closestLetter.classList.add('highlighted');
    }
}

// ===============================
//   INITIALIZATION
// ===============================
function initializeGame() {
    try {
        // Initialize DOM cache first
        initDOMCache();

        // Initialize event listeners
        initEventListeners();

        // Load saved data
        loadSavedBackground();
        loadLevelRanks();
        loadAchievements();

        // Initialize game systems with delays to ensure layout is ready
        setTimeout(() => {
            try {
                initializePlatforms();
            } catch (e) {
                console.error('Platform initialization failed:', e);
            }
        }, 150);

        setTimeout(() => {
            try {
                initializeMoMan();
            } catch (e) {
                console.error('MoMan initialization failed:', e);
            }
        }, 100);

        setTimeout(() => {
            try {
                initializeCoins();
            } catch (e) {
                console.error('Coin initialization failed:', e);
            }
        }, 200);

        // Initialize logo easter egg
        initializeLogoAnimation();
    } catch (error) {
        console.error('Game initialization failed:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGame);

// Platform System
function initializePlatforms() {
    // No platforms - removed
}

function createPlatform(id, x, y, width = 64) {
    const platform = document.createElement('div');
    platform.id = id;
    platform.className = 'platform';
    platform.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${width}px;
        z-index: 50;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;

    // Use single PNG image, no tiling
    platform.innerHTML = `<img src="AI Bytes Asset/Münze bbox.png" style="width: 100%; height: 100%; image-rendering: pixelated;">`;

    document.querySelector('.container').appendChild(platform);

    // Store platform data for collision detection
    platforms.push({
        element: platform,
        id: id,
        x: x,
        y: y,
        width: width,
        height: width
    });
}

function checkPlatformCollisions(moManX, moManY) {
    const moManBottom = moManY + CONFIG.MOMAN.HEIGHT;
    const moManLeft = moManX;
    const moManRight = moManX + CONFIG.MOMAN.WIDTH;

    for (let platform of GameState.game.platforms) {
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;
        const platformTop = platform.y;

        const horizontalOverlap = moManRight > platformLeft && moManLeft < platformRight;
        const verticalNear = moManBottom >= platformTop - 10 && moManBottom <= platformTop + 30;

        if (horizontalOverlap && verticalNear) {
            return platformTop - CONFIG.MOMAN.HEIGHT;
        }
    }

    return null;
}

// ===============================
//   COINS SYSTEM
// ===============================
function initializeCoins() {
    // Only create coins on the main page (not in levels)
    if (!GameState.dom.mainTitle) return;

    // Coin positions
    const coinPositions = [
        { id: 'coin1', x: -100, y: 120 },   // Above main title center
        { id: 'coin2', x: 600, y: 180 },    // Between titles
        { id: 'coin3', x: 800, y: 300 }     // Centered above "Wähle dein Level"
    ];

    coinPositions.forEach(pos => createCoin(pos.id, pos.x, pos.y));
}

function createCoin(id, x, y) {
    const container = GameState.dom.container;
    if (!container) return;

    const coin = document.createElement('div');
    coin.id = id;
    coin.className = 'coin';
    coin.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 32px;
        height: 32px;
        z-index: 100;
        animation: coinFloat 3s ease-in-out infinite;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;

    // Create animated coin image
    const coinImg = document.createElement('img');
    coinImg.style.cssText = 'width: 100%; height: 100%; image-rendering: pixelated;';
    coin.appendChild(coinImg);

    container.appendChild(coin);

    // Store coin data with animation properties
    const coinData = {
        element: coin,
        id: id,
        x: x,
        y: y,
        collected: false,
        animationFrame: 0,
        img: coinImg
    };

    GameState.game.coins.push(coinData);
    startCoinAnimation(coinData);
}

function startCoinAnimation(coin) {
    const animationInterval = setInterval(() => {
        if (coin.collected) {
            clearInterval(animationInterval);
            return;
        }

        coin.animationFrame = (coin.animationFrame + 1) % CONFIG.ANIMATIONS.COIN_FRAMES;
        const frameNumber = String(coin.animationFrame + 1).padStart(4, '0');
        coin.img.src = `${CONFIG.PATHS.COINS}${frameNumber}.png`;
    }, CONFIG.ANIMATIONS.COIN_ANIM_SPEED);
}

function resetCoins() {
    // Remove all existing coins from DOM
    GameState.game.coins.forEach(coin => {
        if (coin.element && coin.element.parentNode) {
            coin.element.remove();
        }
    });

    // Clear coins array and counters
    GameState.game.coins = [];
    GameState.game.coinsCollected = 0;
    achievementData.coinsThisRun = 0;

    // Recreate all coins
    initializeCoins();
}

function checkCoinCollisions() {
    const moChar = GameState.dom.moCharacter;
    if (!GameState.moMan.visible || !moChar) return;

    const moManRect = moChar.getBoundingClientRect();

    GameState.game.coins.forEach(coin => {
        if (coin.collected) return;

        const coinRect = coin.element.getBoundingClientRect();

        // Check collision (with some tolerance)
        const collisionTolerance = 5;
        if (moManRect.right > coinRect.left + collisionTolerance &&
            moManRect.left < coinRect.right - collisionTolerance &&
            moManRect.bottom > coinRect.top + collisionTolerance &&
            moManRect.top < coinRect.bottom - collisionTolerance) {
            collectCoin(coin);
        }
    });
}

function collectCoin(coin) {
    coin.collected = true;
    GameState.game.coinsCollected++;
    achievementData.coinsThisRun++;

    // Coin collect animation
    coin.element.style.animation = 'coinCollect 0.5s ease-out forwards';

    // Remove coin after animation
    setTimeout(() => {
        coin.element.remove();
    }, 500);

    // Show collection effect
    showCoinCollectEffect(coin.x, coin.y);

    // Check for coin master achievement
    if (achievementData.coinsThisRun >= CONFIG.ACHIEVEMENTS.COIN_TARGET) {
        setTimeout(() => {
            if (achievementData.coinsThisRun >= CONFIG.ACHIEVEMENTS.COIN_TARGET) {
                const coinmasterAchievement = achievements.normal.find(a => a.id === 'coinmaster');
                if (coinmasterAchievement && !coinmasterAchievement.unlocked) {
                    coinmasterAchievement.progress = CONFIG.ACHIEVEMENTS.COIN_TARGET;
                    achievementData.coinsThisRun = 0;
                    saveAchievements();
                    checkAchievement('coinmaster');
                }
            }
        }, 1000);
    }
}

function showCoinCollectEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        color: #FFD700;
        font-size: 20px;
        font-weight: bold;
        z-index: 200;
        pointer-events: none;
        animation: collectEffect 1s ease-out forwards;
    `;
    effect.textContent = '+1';

    document.querySelector('.container').appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Professional Logo Animation Easter Egg
function initializeLogoAnimation() {
    const logoContainer = document.querySelector('.logo-container');
    if (!logoContainer) return;

    logoContainer.addEventListener('click', triggerRandomLogoAnimation);
}

function triggerRandomLogoAnimation() {
    const animations = [
        'explodeConfetti',
        'matrixRain',
        'cosmicWarp',
        'glitchMode',
        'fireworks',
        'particleWave'
    ];

    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    // Track animation for achievement
    achievementData.viewedAnimations.add(randomAnimation);
    const animatorAchievement = achievements.easy.find(a => a.id === 'animator');
    if (animatorAchievement) {
        animatorAchievement.viewedAnimations.add(randomAnimation);
        animatorAchievement.progress = animatorAchievement.viewedAnimations.size;
        saveAchievements();
        checkAchievement('animator');
    }

    // Prevent rapid clicking
    const logoContainer = document.querySelector('.logo-container');
    logoContainer.style.pointerEvents = 'none';

    // Execute the chosen animation
    switch(randomAnimation) {
        case 'explodeConfetti':
            explodeConfettiAnimation();
            break;
        case 'matrixRain':
            matrixRainAnimation();
            break;
        case 'cosmicWarp':
            cosmicWarpAnimation();
            break;
        case 'glitchMode':
            glitchModeAnimation();
            break;
        case 'fireworks':
            fireworksAnimation();
            break;
        case 'particleWave':
            particleWaveAnimation();
            break;
    }

    // Re-enable clicking after animation
    setTimeout(() => {
        logoContainer.style.pointerEvents = 'auto';
    }, 4000);
}

// Animation 1: Confetti Explosion
function explodeConfettiAnimation() {
    const container = document.body;
    const colors = ['#F5C03B', '#A86AFF', '#67C7FF', '#4b0074', '#3c3aa5'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: 50%;
                left: 50%;
                z-index: 9999;
                pointer-events: none;
                transform: translate(-50%, -50%);
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;

            container.appendChild(confetti);

            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 200 + Math.random() * 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(1) rotate(720deg)`, opacity: 0 }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 20);
    }
}

// Animation 2: Matrix Rain
function matrixRainAnimation() {
    const container = document.body;
    const chars = '10AI🤖💡⚡🚀';

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.textContent = chars[Math.floor(Math.random() * chars.length)];
            drop.style.cssText = `
                position: fixed;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: ${16 + Math.random() * 16}px;
                top: -50px;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                pointer-events: none;
                text-shadow: 0 0 10px #00ff00;
                font-weight: bold;
            `;

            container.appendChild(drop);

            drop.animate([
                { transform: 'translateY(-50px)', opacity: 0 },
                { transform: 'translateY(50px)', opacity: 1 },
                { transform: 'translateY(100vh)', opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'linear'
            }).onfinish = () => drop.remove();
        }, i * 100);
    }
}

// Animation 3: Cosmic Warp
function cosmicWarpAnimation() {
    const container = document.body;
    const overlay = document.createElement('div');

    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at center, transparent 0%, #4b0074 50%, #000 100%);
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
    `;

    container.appendChild(overlay);

    // Create warp lines
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const line = document.createElement('div');
            line.style.cssText = `
                position: fixed;
                width: 2px;
                height: 100vh;
                background: linear-gradient(to bottom, transparent, #67C7FF, transparent);
                top: 0;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                pointer-events: none;
                transform: scaleY(0);
            `;

            container.appendChild(line);

            line.animate([
                { transform: 'scaleY(0) translateX(0)', opacity: 1 },
                { transform: 'scaleY(1) translateX(-200px)', opacity: 1 },
                { transform: 'scaleY(0) translateX(-400px)', opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => line.remove();
        }, i * 50);
    }

    // Animate overlay
    overlay.animate([
        { opacity: 0 },
        { opacity: 0.8 },
        { opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-in-out'
    }).onfinish = () => overlay.remove();
}

// Animation 4: Glitch Mode
function glitchModeAnimation() {
    const logo = document.querySelector('.logo-container');
    const originalHTML = document.body.innerHTML;

    // Create glitch overlay
    const glitchOverlay = document.createElement('div');
    glitchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,0,0,0.1) 2px,
            rgba(255,0,0,0.1) 4px
        );
        z-index: 9999;
        pointer-events: none;
        animation: glitchScan 0.5s infinite;
    `;

    document.body.appendChild(glitchOverlay);

    // Glitch the logo
    if (logo) {
        logo.style.animation = 'logoGlitch 2s ease-in-out';
    }

    // Add random glitch effects
    const intervals = [];
    for (let i = 0; i < 10; i++) {
        intervals.push(setInterval(() => {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random()}`;
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 50);
        }, 200 + Math.random() * 300));
    }

    // Cleanup
    setTimeout(() => {
        intervals.forEach(interval => clearInterval(interval));
        glitchOverlay.remove();
        document.body.style.filter = 'none';
        if (logo) logo.style.animation = 'none';
    }, 3000);
}

// Animation 5: Fireworks
function fireworksAnimation() {
    const container = document.body;
    const colors = ['#F5C03B', '#A86AFF', '#67C7FF', '#ff6b6b', '#51cf66'];

    for (let firework = 0; firework < 5; firework++) {
        setTimeout(() => {
            const x = 20 + Math.random() * 60; // 20% to 80% of screen width
            const y = 20 + Math.random() * 40; // 20% to 60% of screen height

            // Create firework explosion
            for (let particle = 0; particle < 12; particle++) {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: ${y}vh;
                    left: ${x}vw;
                    z-index: 9999;
                    pointer-events: none;
                    border-radius: 50%;
                    box-shadow: 0 0 10px currentColor;
                `;

                container.appendChild(spark);

                const angle = (Math.PI * 2 * particle) / 12;
                const distance = 100 + Math.random() * 100;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                spark.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => spark.remove();
            }
        }, firework * 400);
    }
}

// Animation 6: Particle Wave
function particleWaveAnimation() {
    const container = document.body;

    for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 40; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: fixed;
                        width: 6px;
                        height: 6px;
                        background: linear-gradient(45deg, #A86AFF, #67C7FF);
                        top: 50%;
                        left: -10px;
                        z-index: 9999;
                        pointer-events: none;
                        border-radius: 50%;
                        box-shadow: 0 0 15px #A86AFF;
                    `;

                    container.appendChild(particle);

                    const amplitude = 100 + wave * 50;
                    const frequency = 0.02;
                    const waveOffset = wave * Math.PI / 3;

                    particle.animate([
                        {
                            transform: 'translate(0, 0) scale(0)',
                            opacity: 0
                        },
                        {
                            transform: `translate(calc(50vw), ${Math.sin(waveOffset) * amplitude}px) scale(1)`,
                            opacity: 1
                        },
                        {
                            transform: `translate(calc(100vw + 10px), ${Math.sin(Math.PI + waveOffset) * amplitude}px) scale(0)`,
                            opacity: 0
                        }
                    ], {
                        duration: 2000,
                        easing: 'ease-in-out'
                    }).onfinish = () => particle.remove();
                }, i * 30);
            }
        }, wave * 200);
    }
}

// Keyboard shortcuts and easter eggs
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSettings();
    }

    // Matrix Rain Easter Egg - Press 'M'
    if (event.key === 'M' || event.key === 'm') {
        // Prevent if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        event.preventDefault();
        matrixRainAnimation();
    }
});

// ===============================
//   ACHIEVEMENT SYSTEM
// ===============================
const achievements = {
    easy: [
        {
            id: 'keymaster',
            name: 'Tastenmeister',
            description: `Drücke ${CONFIG.ACHIEVEMENTS.M_KEY_TARGET}x die "M" Taste`,
            icon: '⌨️',
            progress: 0,
            target: CONFIG.ACHIEVEMENTS.M_KEY_TARGET,
            unlocked: false
        },
        {
            id: 'animator',
            name: 'Animationsexperte',
            description: 'Sieh alle Logo-Animationen',
            icon: '🎬',
            progress: 0,
            target: CONFIG.ACHIEVEMENTS.ANIMATOR_TARGET,
            unlocked: false,
            viewedAnimations: new Set()
        }
    ],
    normal: [
        {
            id: 'coinmaster',
            name: 'Münzsammler',
            description: `Sammle alle ${CONFIG.ACHIEVEMENTS.COIN_TARGET} Münzen ohne zu sterben`,
            icon: '🪙',
            progress: 0,
            target: CONFIG.ACHIEVEMENTS.COIN_TARGET,
            unlocked: false
        },
        {
            id: 'goldrank',
            name: 'Goldmeister',
            description: 'Erreiche deinen ersten Gold-Rang',
            icon: '🏆',
            progress: 0,
            target: CONFIG.ACHIEVEMENTS.GOLD_RANK_TARGET,
            unlocked: false
        },
        {
            id: 'speedhunter',
            name: 'Blitzfänger',
            description: 'Fange den rennenden MoMan in Level 4',
            icon: '⚡',
            progress: 0,
            target: 1,
            unlocked: false
        }
    ],
    hard: []
};

let achievementData = {
    mKeyPresses: 0,
    viewedAnimations: new Set(),
    coinsThisRun: 0,
    hasGoldRank: false
};

// Load achievements from localStorage
function loadAchievements() {
    const saved = localStorage.getItem('aiBytes_achievements');
    if (saved) {
        const data = JSON.parse(saved);

        // Merge saved data with default structure
        for (let category in achievements) {
            achievements[category].forEach(achievement => {
                const savedAchievement = data[category]?.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.progress = savedAchievement.progress || 0;
                    achievement.unlocked = savedAchievement.unlocked || false;
                    if (achievement.viewedAnimations && savedAchievement.viewedAnimations) {
                        achievement.viewedAnimations = new Set(savedAchievement.viewedAnimations);
                    }
                }
            });
        }
    }

    const savedData = localStorage.getItem('aiBytes_achievementData');
    if (savedData) {
        const data = JSON.parse(savedData);
        achievementData.mKeyPresses = data.mKeyPresses || 0;
        achievementData.viewedAnimations = new Set(data.viewedAnimations || []);
        achievementData.coinsThisRun = data.coinsThisRun || 0;
        achievementData.hasGoldRank = data.hasGoldRank || false;
    }
}

// Save achievements to localStorage
function saveAchievements() {
    const saveData = {};
    for (let category in achievements) {
        saveData[category] = achievements[category].map(achievement => ({
            id: achievement.id,
            progress: achievement.progress,
            unlocked: achievement.unlocked,
            viewedAnimations: achievement.viewedAnimations ? Array.from(achievement.viewedAnimations) : undefined
        }));
    }
    localStorage.setItem('aiBytes_achievements', JSON.stringify(saveData));

    localStorage.setItem('aiBytes_achievementData', JSON.stringify({
        mKeyPresses: achievementData.mKeyPresses,
        viewedAnimations: Array.from(achievementData.viewedAnimations),
        coinsThisRun: achievementData.coinsThisRun,
        hasGoldRank: achievementData.hasGoldRank
    }));
}

// Check and unlock achievements
function checkAchievement(achievementId) {
    let achievement = null;
    let category = null;

    for (let cat in achievements) {
        const found = achievements[cat].find(a => a.id === achievementId);
        if (found) {
            achievement = found;
            category = cat;
            break;
        }
    }

    if (!achievement || achievement.unlocked) return;

    if (achievement.progress >= achievement.target) {
        achievement.unlocked = true;
        showAchievementUnlock(achievement, category);
        saveAchievements();
    }
}

// Show achievement unlock animation
function showAchievementUnlock(achievement, category) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, var(--indigo), var(--persian-blue));
        border: 3px solid var(--saffron);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        z-index: 10000;
        color: white;
        font-family: 'Ithaca', serif;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        animation: achievementPop 6s ease-out forwards;
        min-width: 350px;
    `;

    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">${achievement.icon}</div>
        <div style="font-size: 1.5rem; color: var(--saffron); margin-bottom: 10px;">Achievement Unlocked!</div>
        <div style="font-size: 1.2rem; margin-bottom: 8px;">${achievement.name}</div>
        <div style="color: var(--maya-blue); font-size: 0.9rem; text-transform: uppercase;">${category}</div>
        <div style="color: var(--maya-blue); font-size: 0.9rem; margin-top: 5px;">${achievement.description}</div>
    `;

    document.body.appendChild(notification);

    // Confetti effect
    createConfettiEffect();

    setTimeout(() => {
        notification.remove();
    }, 6000);
}

// Create confetti effect for achievement unlock
function createConfettiEffect() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#A86AFF', '#67C7FF', '#F5C03B', '#FF4500'][Math.floor(Math.random() * 4)]};
                top: 30%;
                left: ${50 + (Math.random() - 0.5) * 20}%;
                z-index: 9999;
                animation: confettiFall 2s ease-out forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 2000);
        }, i * 20);
    }
}

// Achievement popup functions
function openAchievements() {
    document.getElementById('achievementsPopup').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderAchievements();
}

function closeAchievements() {
    document.getElementById('achievementsPopup').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function renderAchievements() {
    for (let category in achievements) {
        const container = document.getElementById(`${category}Achievements`);
        if (!container) continue;

        container.innerHTML = '';

        achievements[category].forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;

            let progressText = '';
            if (!achievement.unlocked) {
                progressText = `<div class="achievement-progress">${achievement.progress}/${achievement.target}</div>`;
            } else {
                progressText = '<div class="achievement-progress">✓ Unlocked</div>';
            }

            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${progressText}
            `;

            container.appendChild(card);
        });
    }
}

function resetAllAchievements() {
    if (confirm('Möchtest du wirklich alle Achievements zurücksetzen? Dies kann nicht rückgängig gemacht werden.')) {
        // Reset all achievements
        for (let category in achievements) {
            achievements[category].forEach(achievement => {
                achievement.progress = 0;
                achievement.unlocked = false;
                if (achievement.viewedAnimations) {
                    achievement.viewedAnimations.clear();
                }
            });
        }

        // Reset achievement data
        achievementData.mKeyPresses = 0;
        achievementData.viewedAnimations.clear();
        achievementData.coinsThisRun = 0;
        achievementData.hasGoldRank = false;

        // Save reset achievements
        saveAchievements();

        // Re-render achievements
        renderAchievements();

        alert('Alle Achievements wurden zurückgesetzt!');
    }
}

// ===============================
//   TXP Character Animation
// ===============================
class TXPCharacter {
    constructor() {
        this.img = document.querySelector('.txp-character-img');
        this.character = document.getElementById('txpCharacter');
        this.speechBubble = document.getElementById('txpSpeech');
        this.speechText = document.getElementById('txpSpeechText');

        this.currentFrame = 0;
        this.totalFrames = 24; // Stand/Talk frames
        this.laufFrames = 24; // Lauf animation frames
        this.sprungFrames = 120; // Sprung animation frames

        this.animationSpeed = 40; // milliseconds per frame (50% faster: 80 → 40)
        this.speechAnimationSpeed = 42; // 70% of original: 60 → 42
        this.laufAnimationSpeed = 36; // 40% faster: 60 → 36
        this.sprungAnimationSpeed = 40; // jumping speed (unchanged)

        this.animationInterval = null;
        this.movementInterval = null;
        this.isAnimating = false;
        this.isSpeaking = false;
        this.isMoving = false;
        this.isJumping = false;

        this.currentAnimation = 'stand'; // stand, talk, lauf, sprung
        this.position = { x: 50, y: 60 }; // bottom left position
        this.direction = 1; // 1 = right, -1 = left
        this.movementDistance = 150; // pixels to move (reduced)

        this.speeches = [
            "Hey! Ich bin TXP, dein KI-Assistent! 🤖",
            "Bereit für deine AI-Bytes Reise? 🚀",
            "Diese Levels bringen dir AI richtig bei! 💡",
            "Vergiss nicht: Übung macht den Meister! 💪",
            "KI ist die Zukunft - und du bist dabei! ⭐",
            "Klick mich wieder für mehr Motivation! 😊",
            "Du schaffst das! Weiter so! 🎯",
            "AI-Bytes macht KI lernen zum Vergnügen! 🎮",
            "Benutze die Pfeiltasten um MoMan zu bewegen! ⬅️➡️⬆️⬇️",
            "Klick auf das Logo für Überraschungen! ✨"
        ];


        this.init();
    }

    init() {
        if (this.img && this.character) {
            this.startStandAnimation();
            this.character.addEventListener('click', () => this.speak());
            this.setupLogoClick();
            this.startAutomaticBehavior();
        }
    }

    startAutomaticBehavior() {
        // Start automatic movement every 8-15 seconds (much slower)
        setInterval(() => {
            if (!this.isSpeaking && !this.isMoving && !this.isJumping) {
                if (Math.random() < 0.3) {
                    this.jump();
                } else {
                    this.moveRandomly();
                }
            }
        }, 8000 + Math.random() * 7000);
    }

    setupLogoClick() {
        const logos = document.querySelectorAll('.logo');
        logos.forEach(logo => {
            logo.addEventListener('click', () => {
                this.logoClicked();
            });
            logo.style.cursor = 'pointer';
        });
    }

    logoClicked() {
        const logoSpeeches = [
            "Du hast das AI-Bytes Logo entdeckt! 🎯",
            "AI-Bytes - Deine Zukunft beginnt hier! 🚀",
            "Willkommen in der Welt der künstlichen Intelligenz! 🤖",
            "Logo-Geheimnis entdeckt! Du bist aufmerksam! 👁️",
            "AI-Bytes: Wo Lernen auf Innovation trifft! ⚡"
        ];

        if (!this.isSpeaking) {
            const randomLogoSpeech = logoSpeeches[Math.floor(Math.random() * logoSpeeches.length)];
            this.speechBubble.style.display = 'block';
            this.startSpeechAnimation();
            this.typewriterEffect(randomLogoSpeech);
        }
    }

    startStandAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'stand';
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Stand_Pose/TXP Stand Pose_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }, this.animationSpeed);
    }

    startSpeechAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'talk';
        this.isSpeaking = true;
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Talk_Pose/TXP_Talk Pose_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }, this.speechAnimationSpeed);
    }

    startLaufAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'lauf';
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `TXP/TXP_Lauf_Pose/TXP Lauf Loop_${frameNumber}.png`;

            this.currentFrame = (this.currentFrame + 1) % this.laufFrames;
        }, this.laufAnimationSpeed);
    }

    startSprungAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.currentAnimation = 'sprung';
        this.isJumping = true;
        this.isAnimating = true;
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');

            // Handle special filenames for frames 14 and 15
            let filename;
            if (this.currentFrame === 14) {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}A.png`;
            } else if (this.currentFrame === 15) {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}B.png`;
            } else {
                filename = `TXP/TXP_Sprung_Pose/TXP Sprung_${frameNumber}.png`;
            }

            this.img.src = filename;

            this.currentFrame++;
            if (this.currentFrame >= this.sprungFrames) {
                // Jump animation finished, return to stand
                this.isJumping = false;
                // Don't call startStandAnimation() here - just set the first stand frame directly
                clearInterval(this.animationInterval);
                this.currentAnimation = 'stand';
                this.currentFrame = 0;
                this.img.src = `TXP/TXP_Stand_Pose/TXP Stand Pose_00000.png`;

                // Start normal stand animation after a brief delay
                setTimeout(() => {
                    this.startStandAnimation();
                }, this.animationSpeed);
            }
        }, this.sprungAnimationSpeed);
    }

    speak() {
        if (this.isSpeaking) return; // Prevent overlapping speeches

        // Show speech bubble with typewriter effect
        const randomSpeech = this.speeches[Math.floor(Math.random() * this.speeches.length)];
        this.speechBubble.style.display = 'block';

        // Start speech animation
        this.startSpeechAnimation();

        // Start typewriter effect
        this.typewriterEffect(randomSpeech);
    }

    typewriterEffect(text) {
        this.speechText.textContent = '';
        let charIndex = 0;
        const typingSpeed = 50; // milliseconds per character

        const typeChar = () => {
            if (charIndex < text.length) {
                this.speechText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                // Add blinking cursor at the end
                this.speechText.innerHTML += '<span class="typing-cursor"></span>';

                // Hide speech bubble and return to stand animation after text is complete
                setTimeout(() => {
                    this.speechBubble.style.display = 'none';
                    this.isSpeaking = false;
                    this.startStandAnimation();
                }, 2000); // Show complete text for 2 seconds
            }
        };

        typeChar();
    }

    moveRandomly() {
        if (this.isMoving || this.isSpeaking || this.isJumping) return;

        this.isMoving = true;
        this.direction = Math.random() < 0.5 ? 1 : -1; // Random direction
        const targetX = this.position.x + (this.direction * this.movementDistance);

        // Ensure we don't move off screen (more restrictive on the right)
        const maxRightPosition = Math.min(window.innerWidth - 300, 400); // Don't go too far right
        const clampedX = Math.max(20, Math.min(maxRightPosition, targetX));
        this.direction = clampedX > this.position.x ? 1 : -1;

        // Update CSS transform for direction
        this.updateDirection();

        // Start lauf animation
        this.startLaufAnimation();

        // Move TXP smoothly
        const moveStep = 2; // pixels per step
        const moveInterval = setInterval(() => {
            if (this.direction === 1) {
                this.position.x += moveStep;
                if (this.position.x >= clampedX) {
                    this.position.x = clampedX;
                    this.finishMovement(moveInterval);
                }
            } else {
                this.position.x -= moveStep;
                if (this.position.x <= clampedX) {
                    this.position.x = clampedX;
                    this.finishMovement(moveInterval);
                }
            }

            this.updatePosition();
        }, 20);
    }

    updateDirection() {
        if (this.direction === -1) {
            this.img.style.transform = 'scaleX(-1)'; // Face left
        } else {
            this.img.style.transform = 'scaleX(1)'; // Face right
        }
    }

    updatePosition() {
        this.character.parentElement.style.left = this.position.x + 'px';
        this.character.parentElement.style.bottom = this.position.y + 'px';
    }

    finishMovement(moveInterval) {
        clearInterval(moveInterval);
        this.isMoving = false;
        this.startStandAnimation();
    }

    jump() {
        if (this.isJumping || this.isSpeaking || this.isMoving) return;
        this.startSprungAnimation();
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.isAnimating = false;
        this.currentAnimation = 'stand';
    }
}

// Initialize TXP Character when page loads
let txpCharacter;
document.addEventListener('DOMContentLoaded', function() {
    txpCharacter = new TXPCharacter();
});