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

// Mo Man Character Controls - Mario Bros style with Animation and Physics
let moManX = 0;
let moManY = 0;
let moManVelocityY = 0;
const gravity = 0.4; // Slightly faster falling for quicker jumps
const jumpPower = -9; // Higher jump for platform reaching
let isGrounded = false;
let moManVisible = true;
let isMoving = false;
let facingRight = true;
const moCharacter = document.getElementById('moCharacter');
let keysPressed = {};
let gameLoop;
let animationFrame = 0;
let jumpAnimationFrame = 0;
let jumpAnimationCounter = 0; // Counter to slow down jump animation
let animationLoop;
let currentAnimation = 'standing'; // 'standing', 'running', or 'jumping'

// Coins system
let coins = [];
let coinsCollected = 0;

// Platform system
let platforms = [];

function initializeMoMan() {
    if (!moCharacter) return;

    // Position Mo Man over the L (first letter)
    const firstLetter = document.querySelector('.main-title span[data-index="0"]');
    if (firstLetter) {
        const letterRect = firstLetter.getBoundingClientRect();
        const containerRect = document.querySelector('.title-container').getBoundingClientRect();
        moManX = letterRect.left - containerRect.left + (letterRect.width / 2) - 30; // Center over L

        // Start Mo Man directly on the first letter
        const letterTop = letterRect.top - containerRect.top;
        moManY = letterTop - 42; // Start directly on the L
        isGrounded = true; // Start grounded
        moCharacter.style.left = moManX + 'px';
        moCharacter.style.top = moManY + 'px';

        // Highlight the L
        firstLetter.classList.add('highlighted');
    }

    // Start Mo Man animation
    startMoManAnimation();

    // Start game loop
    startGameLoop();
}

function startMoManAnimation() {
    animationLoop = setInterval(() => {
        updateMoManAnimation();
    }, 25); // Faster animation - increased from 42ms to 25ms
}

function updateMoManAnimation() {
    if (currentAnimation === 'jumping') {
        // Update jump animation slower (every 3rd call)
        jumpAnimationCounter++;
        if (jumpAnimationCounter >= 3) {
            jumpAnimationCounter = 0;

            // Handle jumping animation with special frame names
            let jumpFrameName;
            if (jumpAnimationFrame === 27) {
                jumpFrameName = 'Mo man Sprung_00027_a.png';
            } else if (jumpAnimationFrame === 28) {
                jumpFrameName = 'Mo man Sprung_00028_b.png';
            } else {
                const frameNumber = String(jumpAnimationFrame).padStart(5, '0');
                jumpFrameName = `Mo man Sprung_${frameNumber}.png`;
            }

            moCharacter.src = `Mo_man_Sprung_Pose/${jumpFrameName}`;
        }
        // Don't auto-increment jump frame - it will be controlled by physics
    } else if (currentAnimation === 'running') {
        const frameNumber = String(animationFrame).padStart(5, '0');
        moCharacter.src = `Mo man Lauf 2s 24fps 48 frames/Mo man Lauf Pose_${frameNumber}.png`;
        animationFrame = (animationFrame + 1) % 48; // 48 frames for running
    } else {
        const frameNumber = String(animationFrame).padStart(5, '0');
        moCharacter.src = `Mo_man_Stand_Pose/Mo man Stand Pose_${frameNumber}.png`;
        animationFrame = (animationFrame + 1) % 24; // 24 frames for standing
    }

    // Apply direction (flip horizontally if facing left)
    if (facingRight) {
        moCharacter.style.transform = 'scaleX(1)';
    } else {
        moCharacter.style.transform = 'scaleX(-1)';
    }
}

function updateJumpFrame() {
    // Map jump velocity to animation frame (42 frames total, 0-41)
    // Frame 27-28 is the peak of the jump
    const maxJumpVelocity = 9; // Same as jumpPower magnitude

    if (moManVelocityY <= 0) {
        // Rising phase: map velocity -9 to 0 → frames 0 to 27
        const progress = 1 - (Math.abs(moManVelocityY) / maxJumpVelocity); // Invert progress
        jumpAnimationFrame = Math.floor(progress * 27);
        jumpAnimationFrame = Math.max(0, Math.min(27, jumpAnimationFrame));
    } else {
        // Falling phase: map velocity 0 to +9 → frames 27 to 41
        const progress = Math.min(moManVelocityY / maxJumpVelocity, 1);
        jumpAnimationFrame = 27 + Math.floor(progress * 14); // 14 frames from 27 to 41
        jumpAnimationFrame = Math.max(27, Math.min(41, jumpAnimationFrame));
    }
}

function startGameLoop() {
    gameLoop = setInterval(() => {
        // Skip physics if Mo Man is not visible
        if (!moManVisible) return;

        const moveSpeed = 3; // pixels per frame

        // Check if Mo Man is moving
        isMoving = false;

        // Horizontal movement based on held keys
        if (keysPressed['ArrowLeft']) {
            moManX -= moveSpeed;
            facingRight = false;
            isMoving = true;
        }
        if (keysPressed['ArrowRight']) {
            moManX += moveSpeed;
            facingRight = true;
            isMoving = true;
        }

        // Update animation based on movement and physics
        let newAnimation;
        if (!isGrounded && Math.abs(moManVelocityY) > 0.5) {
            newAnimation = 'jumping';
            // Calculate jump frame based on jump phase
            updateJumpFrame();
        } else if (isMoving) {
            newAnimation = 'running';
        } else {
            newAnimation = 'standing';
        }

        if (newAnimation !== currentAnimation) {
            currentAnimation = newAnimation;
            if (newAnimation !== 'jumping') {
                animationFrame = 0; // Reset animation frame when switching to non-jump
            }
            if (newAnimation === 'jumping') {
                jumpAnimationFrame = 0; // Start jump animation from beginning
            }
        }

        // Apply gravity
        moManVelocityY += gravity;

        // Apply gravity and movement first
        moManY += moManVelocityY;

        // Check for platform collision first (higher priority)
        const platformLevel = checkPlatformCollisions(moManX, moManY);

        if (platformLevel !== null && moManVelocityY >= 0) {
            // Land on platform
            if (moManY >= platformLevel) {
                moManY = platformLevel;
                moManVelocityY = 0;
                isGrounded = true;
            } else {
                isGrounded = false;
            }
        } else {
            // Then check for letter collision if no platform collision
            const groundLevel = checkLetterCollision(moManX, moManY);

            if (groundLevel !== null && moManVelocityY >= 0) {
                // Only land on letter if Mo Man is actually falling onto it from above
                if (moManY >= groundLevel) {
                    moManY = groundLevel;
                    moManVelocityY = 0;
                    isGrounded = true;
                } else {
                    // Mo Man is below the letter level, don't teleport up
                    isGrounded = false;
                }
            } else if (groundLevel === null) {
                // No collision, continue falling
                isGrounded = false;
            }
        }

        // Check if Mo Man falls too far down (no letters below)
        if (moManY > 300) { // Increased threshold for disappearing
            moManVisible = false;
            moCharacter.style.display = 'none';
            showRespawnUI();
            return; // Stop physics when disappeared
        }

        // Update position
        moCharacter.style.left = moManX + 'px';
        moCharacter.style.top = moManY + 'px';

        // Update highlighting
        updateHighlighting();

        // Check coin collisions
        checkCoinCollisions();
    }, 16); // ~60 FPS
}

// Collision detection with letters
function checkLetterCollision(x, y) {
    // Check both main title and levels title
    const letters = document.querySelectorAll('.main-title span[data-index], .levels-title span[data-index]');
    const moManWidth = 60; // Mo Man's approximate width
    const moManBottom = y + 60; // Mo Man's bottom edge

    for (let letter of letters) {
        const letterRect = letter.getBoundingClientRect();
        // Use different containers based on which title the letter belongs to
        let containerRect;
        if (letter.closest('.main-title')) {
            containerRect = document.querySelector('.title-container').getBoundingClientRect();
        } else {
            containerRect = document.querySelector('.levels').getBoundingClientRect();
        }

        // Convert to relative coordinates
        const letterLeft = letterRect.left - containerRect.left;
        const letterRight = letterLeft + letterRect.width;
        const letterTop = letterRect.top - containerRect.top;

        // Check if Mo Man is horizontally over this letter
        const moManLeft = x;
        const moManRight = x + moManWidth;

        if (moManRight > letterLeft && moManLeft < letterRight) {
            // Mo Man is horizontally over this letter

            // Calculate the ground level for this letter
            let groundLevel;
            if (letter.closest('.levels-title')) {
                groundLevel = letterTop + 75; // Position Mo Man lower on "Wähle dein Level"
            } else {
                groundLevel = letterTop - 42; // Position Mo Man slightly higher on main title
            }

            // Only return collision if Mo Man is close to this letter (within smaller range)
            const distanceToGround = Math.abs(y - groundLevel);
            if (distanceToGround < 30) { // Reduced hitbox from 100px to 30px
                return groundLevel;
            }
        }
    }

    return null; // No collision
}

// Track key states
document.addEventListener('keydown', function(event) {
    if (!document.querySelector('.main-title')) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        keysPressed[event.key] = true;
    }

    // Jump with Arrow Up - can jump anytime
    if (event.key === 'ArrowUp' && isGrounded) {
        event.preventDefault();
        moManVelocityY = jumpPower;
        isGrounded = false;
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
});

document.addEventListener('keyup', function(event) {
    if (!document.querySelector('.main-title')) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        keysPressed[event.key] = false;
    }

    // Respawn with R key
    if (event.key === 'R' || event.key === 'r') {
        if (!moManVisible) {
            respawnMoMan();
        }
    }
});

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
    // Reset Mo Man to starting position
    const firstLetter = document.querySelector('.main-title span[data-index="0"]');
    if (firstLetter) {
        const letterRect = firstLetter.getBoundingClientRect();
        const containerRect = document.querySelector('.title-container').getBoundingClientRect();
        moManX = letterRect.left - containerRect.left + (letterRect.width / 2) - 30;
        const letterTop = letterRect.top - containerRect.top;
        moManY = letterTop - 42;
        moManVelocityY = 0;
        isGrounded = true;
        moManVisible = true;

        // Show Mo Man again
        moCharacter.style.display = 'block';
        moCharacter.style.left = moManX + 'px';
        moCharacter.style.top = moManY + 'px';

        // Hide respawn UI
        hideRespawnUI();

        // Reset all coins
        resetCoins();

        // Highlight the L again
        document.querySelectorAll('.main-title span[data-index], .levels-title span[data-index]').forEach(span => {
            span.classList.remove('highlighted');
        });
        firstLetter.classList.add('highlighted');
    }
}

function getCurrentLetter() {
    // Find closest letter to Mo Man
    const letters = document.querySelectorAll('.main-title span[data-index], .levels-title span[data-index]');
    let closestLetter = null;
    let closestDistance = Infinity;

    letters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        let containerRect;
        if (letter.closest('.main-title')) {
            containerRect = document.querySelector('.title-container').getBoundingClientRect();
        } else {
            containerRect = document.querySelector('.levels').getBoundingClientRect();
        }
        const letterCenter = letterRect.left - containerRect.left + (letterRect.width / 2);
        const moCenter = moManX + 30; // Mo Man center
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
    document.querySelectorAll('.main-title span[data-index], .levels-title span[data-index]').forEach(span => {
        span.classList.remove('highlighted');
    });

    // Highlight closest letter green
    const closestLetter = getCurrentLetter();
    if (closestLetter) {
        closestLetter.classList.add('highlighted');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedBackground();
    loadLevelRanks();
    loadAchievements(); // Initialize achievement system

    // Initialize Mo Man after a short delay to ensure layout is ready
    setTimeout(initializeMoMan, 100);

    // Initialize coins
    setTimeout(initializeCoins, 200);

    // Initialize platforms
    setTimeout(initializePlatforms, 150);

    // Initialize logo easter egg
    initializeLogoAnimation();
});

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
    const moManWidth = 60;
    const moManHeight = 60;
    const moManBottom = moManY + moManHeight;
    const moManLeft = moManX;
    const moManRight = moManX + moManWidth;

    for (let platform of platforms) {
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;
        const platformTop = platform.y;

        // Debug: Console log to see if we're detecting collision
        const horizontalOverlap = moManRight > platformLeft && moManLeft < platformRight;
        const verticalNear = moManBottom >= platformTop - 10 && moManBottom <= platformTop + 30;

        if (horizontalOverlap && verticalNear) {
            console.log('Platform collision detected!', {
                platform: platform.id,
                moManX, moManY, moManBottom,
                platformLeft, platformRight, platformTop
            });
            return platformTop - 60; // Landing position
        }
    }

    return null; // No platform collision
}

// Coins System
function initializeCoins() {
    // Only create coins on the main page (not in levels)
    if (!document.querySelector('.main-title')) return;

    // Create only 3 coins total, with one centered above "Wähle dein Level"
    createCoin('coin1', -100, 120);    // Above main title center
    createCoin('coin2', 600, 180);   // Between titles
    createCoin('coin3', 800, 300);   // Centered above "Wähle dein Level"
}

function createCoin(id, x, y) {
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
        cursor: pointer;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;

    // Create animated coin image
    const coinImg = document.createElement('img');
    coinImg.style.cssText = 'width: 100%; height: 100%; image-rendering: pixelated;';
    coin.appendChild(coinImg);

    document.querySelector('.container').appendChild(coin);

    // Store coin data with animation properties
    coins.push({
        element: coin,
        id: id,
        x: x,
        y: y,
        collected: false,
        animationFrame: 0,
        img: coinImg
    });

    // Start coin animation
    startCoinAnimation(coins[coins.length - 1]);
}

function startCoinAnimation(coin) {
    const animationInterval = setInterval(() => {
        if (coin.collected) {
            clearInterval(animationInterval);
            return;
        }

        coin.animationFrame = (coin.animationFrame + 1) % 24; // 24 frames
        const frameNumber = String(coin.animationFrame + 1).padStart(4, '0'); // 0001-0024
        coin.img.src = `Coin_animation/${frameNumber}.png`;
    }, 83); // ~12 FPS (1000ms / 12fps ≈ 83ms)
}

function resetCoins() {
    // Remove all existing coins from DOM
    coins.forEach(coin => {
        if (coin.element && coin.element.parentNode) {
            coin.element.remove();
        }
    });

    // Clear coins array
    coins = [];
    coinsCollected = 0;
    achievementData.coinsThisRun = 0; // Reset coin achievement progress

    // Recreate all coins
    initializeCoins();
}


function checkCoinCollisions() {
    if (!moManVisible) return;

    coins.forEach(coin => {
        if (coin.collected) return;

        const coinRect = coin.element.getBoundingClientRect();
        const moManRect = moCharacter.getBoundingClientRect();

        // Check collision (with some tolerance)
        if (moManRect.right > coinRect.left + 5 &&
            moManRect.left < coinRect.right - 5 &&
            moManRect.bottom > coinRect.top + 5 &&
            moManRect.top < coinRect.bottom - 5) {

            collectCoin(coin);
        }
    });
}

function collectCoin(coin) {
    coin.collected = true;
    coinsCollected++;
    achievementData.coinsThisRun++;

    // Coin collect animation
    coin.element.style.animation = 'coinCollect 0.5s ease-out forwards';

    // Remove coin after animation
    setTimeout(() => {
        coin.element.remove();
    }, 500);

    // Show collection effect
    showCoinCollectEffect(coin.x, coin.y);

    // Check for coin master achievement (all 3 coins collected)
    if (achievementData.coinsThisRun >= 3) {
        // Delay achievement check by 1 second to allow for potential death
        setTimeout(() => {
            if (achievementData.coinsThisRun >= 3) { // Still alive after 1 second
                const coinmasterAchievement = achievements.normal.find(a => a.id === 'coinmaster');
                if (coinmasterAchievement && !coinmasterAchievement.unlocked) {
                    coinmasterAchievement.progress = 3;
                    achievementData.coinsThisRun = 0; // Reset for next attempt
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

// Achievement System
const achievements = {
    easy: [
        {
            id: 'keymaster',
            name: 'Tastenmeister',
            description: 'Drücke 30x die "M" Taste',
            icon: '⌨️',
            progress: 0,
            target: 30,
            unlocked: false
        },
        {
            id: 'animator',
            name: 'Animationsexperte',
            description: 'Sieh alle Logo-Animationen',
            icon: '🎬',
            progress: 0,
            target: 6,
            unlocked: false,
            viewedAnimations: new Set()
        }
    ],
    normal: [
        {
            id: 'coinmaster',
            name: 'Münzsammler',
            description: 'Sammle alle 3 Münzen ohne zu sterben',
            icon: '🪙',
            progress: 0,
            target: 3,
            unlocked: false
        },
        {
            id: 'goldrank',
            name: 'Goldmeister',
            description: 'Erreiche deinen ersten Gold-Rang',
            icon: '🏆',
            progress: 0,
            target: 1,
            unlocked: false
        }
    ],
    hard: [
        // Placeholder for future hard achievements
    ]
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