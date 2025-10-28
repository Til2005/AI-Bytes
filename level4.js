// ===============================
//   LEVEL 4: VISION CHALLENGE
//   AI Image Understanding
// ===============================

// Game State
const Level4State = {
    currentChallengeIndex: 0,
    score: 0,
    challengeResults: [false, false, false, false], // Track correct/incorrect for each challenge
    challenges: [
        {
            id: 1,
            type: 'promptComparison',
            completed: false,
            correct: false
        },
        {
            id: 2,
            type: 'promptToImage',
            completed: false,
            correct: false
        },
        {
            id: 3,
            type: 'imageMatching',
            completed: false,
            correct: false
        },
        {
            id: 4,
            type: 'realVsAI',
            completed: false,
            correct: false
        }
    ]
};

// Challenge Data Configuration
// IMPORTANT: Update these with correct answers after adding real images
const ChallengeData = {
    challenge1: {
        imageUrl: 'assets/level4/placeholder_target.png',
        caption: 'Ein futuristisches Mercedes-Konzeptauto',
        promptA: 'Ein Auto',
        promptB: 'Futuristisches Mercedes Vision AVTR Konzeptauto, silberne Lackierung, in modernem Showroom mit LED-Beleuchtung, Studiofotografie, Weitwinkel-Aufnahme, 4K hochauflösend',
        correctAnswer: 'B' // Change this to 'A' or 'B' based on your images
    },
    challenge2: {
        imageUrl: 'assets/level4/placeholder_generated.png',
        options: [
            'Mercedes EQS auf einer Landstraße, sonniger Tag',
            'Mercedes EQS in Cyberpunk-Stadt bei Nacht, Neonlichter, futuristisch, Regen auf Straße, kinoreifer Look',
            'Schwarzes Auto in der Stadt'
        ],
        correctAnswer: 2 // Index 0, 1, or 2 - UPDATE THIS
    },
    challenge3: {
        prompt: 'Mercedes G-Klasse in der Wüste, goldene Stunde, Sanddünen im Hintergrund, dramatische Beleuchtung, professionelle Fotografie',
        images: [
            'assets/level4/placeholder_option1.png',
            'assets/level4/placeholder_option2.png',
            'assets/level4/placeholder_option3.png'
        ],
        correctAnswer: 1 // Index 0, 1, or 2 - UPDATE THIS
    },
    challenge4: {
        images: [
            'assets/level4/placeholder_real1.png',
            'assets/level4/placeholder_real2.png',
            'assets/level4/placeholder_real3.png'
        ],
        correctAnswer: 2 // Index 0, 1, or 2 (which one is the REAL photo) - UPDATE THIS
    }
};

// Character Animation State
const CharacterState = {
    moMan: {
        totalRunFrames: 48, // Lauf-Animation hat 48 Frames
        runAnimationSpeed: 8, // Sehr schnelle Animation
        runInterval: null // Interval für wiederkehrende Läufe
    },
    txp: {
        currentFrame: 0,
        totalStandFrames: 24,
        totalTalkFrames: 24,
        animationSpeed: 50,
        animationInterval: null,
        currentAnimation: 'stand' // stand, talk
    },
    runningMoMans: [] // Array für aktive laufende MoMans
};

// ===============================
//   INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeLevel4();
    initializeCharacterAnimations();
    setupEventListeners();
    loadProgress();
});

function initializeLevel4() {
    console.log('Level 4: Vision Challenge initialized');

    // Load challenge data into HTML
    loadChallengeData();

    // Show intro screen
    showScreen('introScreen');

    // Initialize character speech
    showMoManSpeech('Hey! Bereit für die Welt der KI-Bilder? Ich zeig dir, wie\'s geht!', true);
}

function loadChallengeData() {
    // Challenge 1
    document.getElementById('challenge1Image').src = ChallengeData.challenge1.imageUrl;
    document.getElementById('challenge1Caption').textContent = 'Beschreibung: ' + ChallengeData.challenge1.caption;
    document.getElementById('challenge1PromptA').textContent = ChallengeData.challenge1.promptA;
    document.getElementById('challenge1PromptB').textContent = ChallengeData.challenge1.promptB;

    // Challenge 2
    document.getElementById('challenge2Image').src = ChallengeData.challenge2.imageUrl;
    document.getElementById('challenge2Option1').textContent = ChallengeData.challenge2.options[0];
    document.getElementById('challenge2Option2').textContent = ChallengeData.challenge2.options[1];
    document.getElementById('challenge2Option3').textContent = ChallengeData.challenge2.options[2];

    // Challenge 3
    document.getElementById('challenge3Prompt').textContent = ChallengeData.challenge3.prompt;
    const imageOptions = document.querySelectorAll('#challenge3Screen .option-image');
    imageOptions.forEach((img, index) => {
        img.src = ChallengeData.challenge3.images[index];
    });

    // Challenge 4
    const realImages = document.querySelectorAll('#challenge4Screen .option-image');
    realImages.forEach((img, index) => {
        img.src = ChallengeData.challenge4.images[index];
    });
}

// ===============================
//   EVENT LISTENERS
// ===============================
function setupEventListeners() {
    // Start button
    const startBtn = document.getElementById('startLevel');
    if (startBtn) {
        startBtn.addEventListener('click', startLevel);
    }

    // Back to home
    const backBtn = document.getElementById('backToHome');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Results buttons
    const retryBtn = document.getElementById('retryLevel');
    if (retryBtn) {
        retryBtn.addEventListener('click', retryLevel);
    }

    const backToLevelsBtn = document.getElementById('backToLevels');
    if (backToLevelsBtn) {
        backToLevelsBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Mo Man understood button
    const understoodBtn = document.getElementById('understoodButton');
    if (understoodBtn) {
        understoodBtn.addEventListener('click', () => {
            hideMoManSpeech();
        });
    }

    // Character click handlers
    // MoMan ist nicht mehr sichtbar, also nur TXP
    const txpHost = document.getElementById('txpHost');
    if (txpHost) {
        txpHost.addEventListener('click', () => {
            const messages = [
                'Beep boop! Als KI-Roboter kenne ich mich mit Bildern aus! 🤖',
                'Tipp: Achte auf Farben, Beleuchtung und Komposition!',
                'KI-Bilder können täuschend echt aussehen! 👀',
                'Analysiere jedes Detail sorgfältig!',
                'Du bist auf dem richtigen Weg! 🎯'
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            showTXPSpeech(randomMsg);
        });
    }

    // Image load handlers
    setupImageLoadHandlers();
}

function setupImageLoadHandlers() {
    const allImages = document.querySelectorAll('.challenge-image, .option-image');
    allImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('image-placeholder')) {
                placeholder.style.display = 'none';
            }
        });

        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // Keep placeholder visible on error
        });
    });
}

// ===============================
//   GAME FLOW
// ===============================
function startLevel() {
    Level4State.currentChallengeIndex = 0;
    Level4State.score = 0;
    Level4State.challengeResults = [false, false, false, false];

    showMoManSpeech('Los geht\'s! Erste Challenge: Erkenne den besseren Prompt!', false);

    setTimeout(() => {
        showChallenge(1);
        updateProgressDisplay();
    }, 2000);
}

function showChallenge(challengeNumber) {
    const screens = ['challenge1Screen', 'challenge2Screen', 'challenge3Screen', 'challenge4Screen'];
    showScreen(screens[challengeNumber - 1]);

    Level4State.currentChallengeIndex = challengeNumber - 1;
    updateProgressDisplay();

    // Character feedback
    const messages = [
        'Challenge 1: Welcher Prompt ist besser?',
        'Challenge 2: Welcher Prompt passt zum Bild?',
        'Challenge 3: Welches Bild passt zum Prompt?',
        'Challenge 4: Finde das echte Foto!'
    ];
    showMoManSpeech(messages[challengeNumber - 1], false);

    // TXP hints
    const txpHints = [
        'Tipp: Gute Prompts sind detailliert und spezifisch!',
        'Schau dir das Bild genau an! Was siehst du alles?',
        'Vergleiche den Prompt mit jedem Detail im Bild!',
        'Achte auf Unrealistische Details bei KI-Bildern!'
    ];
    setTimeout(() => {
        showTXPSpeech(txpHints[challengeNumber - 1]);
    }, 3000);
}

function nextChallenge() {
    const nextIndex = Level4State.currentChallengeIndex + 1;

    if (nextIndex < 4) {
        setTimeout(() => {
            showChallenge(nextIndex + 1);
        }, 1500);
    } else {
        // All challenges completed
        setTimeout(() => {
            showResults();
        }, 1500);
    }
}

function showResults() {
    showScreen('resultsScreen');

    // Calculate final score
    const finalScore = Level4State.score;
    const rank = getRank(finalScore);

    // Animate score display
    animateScore(finalScore);

    // Display rank
    displayRank(rank);

    // Update challenge breakdown
    updateChallengeBreakdown();

    // Save progress
    saveProgress(finalScore, rank);

    // Character celebration
    if (finalScore >= 40) {
        showMoManSpeech('🎉 PERFEKT! Du bist ein KI-Bild-Meister!', true);
        showTXPSpeech('Beep boop! Gold-Rang erreicht! Unglaublich! 🏆');
    } else if (finalScore >= 30) {
        showMoManSpeech('Super gemacht! Silber-Rang! 🥈', true);
        showTXPSpeech('Tolle Leistung! Fast perfekt! 👏');
    } else if (finalScore >= 20) {
        showMoManSpeech('Gut gemacht! Bronze-Rang! 🥉', true);
        showTXPSpeech('Guter Start! Mit mehr Übung wird\'s noch besser! 💪');
    } else {
        showMoManSpeech('Nicht aufgeben! Versuch\'s nochmal! 💪', true);
        showTXPSpeech('Übung macht den Meister! Du schaffst das! 🤖');
    }
}

function retryLevel() {
    // Reset state
    Level4State.score = 0;
    Level4State.currentChallengeIndex = 0;
    Level4State.challengeResults = [false, false, false, false];
    Level4State.challenges.forEach(c => {
        c.completed = false;
        c.correct = false;
    });

    // Reset UI
    resetAllChallenges();

    // Start again
    startLevel();
}

function resetAllChallenges() {
    // Remove all selection/result classes
    document.querySelectorAll('.prompt-card, .prompt-option, .image-option').forEach(el => {
        el.classList.remove('selected', 'correct', 'incorrect');
    });

    // Re-enable all buttons
    document.querySelectorAll('.select-prompt-btn').forEach(btn => {
        btn.disabled = false;
    });
}

// ===============================
//   CHALLENGE 1: PROMPT COMPARISON
// ===============================
function selectPrompt(challengeNum, promptLetter) {
    if (Level4State.challenges[challengeNum - 1].completed) return;

    const isCorrect = promptLetter === ChallengeData.challenge1.correctAnswer;

    // Mark as completed
    Level4State.challenges[challengeNum - 1].completed = true;
    Level4State.challenges[challengeNum - 1].correct = isCorrect;

    // Update score
    if (isCorrect) {
        Level4State.score += 10;
        Level4State.challengeResults[challengeNum - 1] = true;
    }

    // Visual feedback
    const cards = document.querySelectorAll('#challenge1Screen .prompt-card');
    const selectedCard = promptLetter === 'A' ? cards[0] : cards[1];
    const correctCard = ChallengeData.challenge1.correctAnswer === 'A' ? cards[0] : cards[1];

    selectedCard.classList.add('selected');

    setTimeout(() => {
        correctCard.classList.add('correct');
        if (!isCorrect) {
            selectedCard.classList.add('incorrect');
        }

        // Disable buttons
        document.querySelectorAll('#challenge1Screen .select-prompt-btn').forEach(btn => {
            btn.disabled = true;
        });

        // Character feedback
        if (isCorrect) {
            showMoManSpeech('✓ Richtig! Gute Prompts sind detailliert und spezifisch! +10 Punkte', false);
            showTXPSpeech('Beep boop! Korrekt! Der bessere Prompt enthält alle wichtigen Details! 🎯');
        } else {
            showMoManSpeech('✗ Nicht ganz. Der bessere Prompt ist detaillierter und spezifischer!', false);
            showTXPSpeech('Merke dir: Je mehr relevante Details, desto besser das Ergebnis! 📝');
        }

        updateProgressDisplay();

        // Move to next challenge
        nextChallenge();
    }, 800);
}

// ===============================
//   CHALLENGE 2: PROMPT TO IMAGE
// ===============================
function selectPromptOption(challengeNum, optionNum) {
    if (Level4State.challenges[challengeNum - 1].completed) return;

    const isCorrect = (optionNum - 1) === ChallengeData.challenge2.correctAnswer;

    // Mark as completed
    Level4State.challenges[challengeNum - 1].completed = true;
    Level4State.challenges[challengeNum - 1].correct = isCorrect;

    // Update score
    if (isCorrect) {
        Level4State.score += 10;
        Level4State.challengeResults[challengeNum - 1] = true;
    }

    // Visual feedback
    const options = document.querySelectorAll('#challenge2Screen .prompt-option');
    const selectedOption = options[optionNum - 1];
    const correctOption = options[ChallengeData.challenge2.correctAnswer];

    selectedOption.classList.add('selected');

    setTimeout(() => {
        correctOption.classList.add('correct');
        if (!isCorrect) {
            selectedOption.classList.add('incorrect');
        }

        // Character feedback
        if (isCorrect) {
            showMoManSpeech('✓ Perfekt! Du hast den richtigen Prompt erkannt! +10 Punkte', false);
            showTXPSpeech('Excellent analysis! Alle Details stimmen überein! 🎨');
        } else {
            showMoManSpeech('✗ Leider falsch. Vergleiche die Bilddetails genau mit dem Prompt!', false);
            showTXPSpeech('Tipp: Achte auf Farben, Setting und Stimmung! 🔍');
        }

        updateProgressDisplay();

        // Move to next challenge
        nextChallenge();
    }, 800);
}

// ===============================
//   CHALLENGE 3: IMAGE MATCHING
// ===============================
function selectImageOption(challengeNum, imageNum) {
    if (Level4State.challenges[challengeNum - 1].completed) return;

    const isCorrect = (imageNum - 1) === ChallengeData.challenge3.correctAnswer;

    // Mark as completed
    Level4State.challenges[challengeNum - 1].completed = true;
    Level4State.challenges[challengeNum - 1].correct = isCorrect;

    // Update score
    if (isCorrect) {
        Level4State.score += 10;
        Level4State.challengeResults[challengeNum - 1] = true;
    }

    // Visual feedback
    const options = document.querySelectorAll('#challenge3Screen .image-option');
    const selectedOption = options[imageNum - 1];
    const correctOption = options[ChallengeData.challenge3.correctAnswer];

    selectedOption.classList.add('selected');

    setTimeout(() => {
        correctOption.classList.add('correct');
        if (!isCorrect) {
            selectedOption.classList.add('incorrect');
        }

        // Character feedback
        if (isCorrect) {
            showMoManSpeech('✓ Exzellent! Das ist das richtige Bild! +10 Punkte', false);
            showTXPSpeech('Beep boop! Perfekte Übereinstimmung! Alle Elemente passen! 🖼️');
        } else {
            showMoManSpeech('✗ Nicht das richtige Bild. Lies den Prompt nochmal genau!', false);
            showTXPSpeech('Vergleiche jedes Element: Objekt, Setting, Licht, Stil! 🎯');
        }

        updateProgressDisplay();

        // Move to next challenge
        nextChallenge();
    }, 800);
}

// ===============================
//   CHALLENGE 4: REAL VS AI
// ===============================
function selectRealImage(challengeNum, imageNum) {
    if (Level4State.challenges[challengeNum - 1].completed) return;

    const isCorrect = (imageNum - 1) === ChallengeData.challenge4.correctAnswer;

    // Mark as completed
    Level4State.challenges[challengeNum - 1].completed = true;
    Level4State.challenges[challengeNum - 1].correct = isCorrect;

    // Update score
    if (isCorrect) {
        Level4State.score += 10;
        Level4State.challengeResults[challengeNum - 1] = true;
    }

    // Visual feedback
    const options = document.querySelectorAll('#challenge4Screen .image-option');
    const selectedOption = options[imageNum - 1];
    const correctOption = options[ChallengeData.challenge4.correctAnswer];

    selectedOption.classList.add('selected');

    setTimeout(() => {
        correctOption.classList.add('correct');
        if (!isCorrect) {
            selectedOption.classList.add('incorrect');
        }

        // Character feedback
        if (isCorrect) {
            showMoManSpeech('✓ Richtig erkannt! Das ist ein echtes Foto! +10 Punkte 📸', false);
            showTXPSpeech('Wow! Gutes Auge für Details! Du hast das echte Bild gefunden! ✨');
        } else {
            showMoManSpeech('✗ Das war KI-generiert! Achte auf kleine Ungereimtheiten!', false);
            showTXPSpeech('KI-Bilder haben oft Fehler bei Händen, Text oder Schatten! 🤖');
        }

        updateProgressDisplay();

        // Move to results
        nextChallenge();
    }, 800);
}

// ===============================
//   UI UPDATES
// ===============================
function updateProgressDisplay() {
    const challengeDisplay = document.getElementById('currentChallenge');
    const scoreDisplay = document.getElementById('totalScore');

    if (challengeDisplay) {
        challengeDisplay.textContent = `${Level4State.currentChallengeIndex + 1}/4`;
    }

    if (scoreDisplay) {
        scoreDisplay.textContent = Level4State.score;
    }
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function getRank(score) {
    if (score >= 40) return { name: 'Gold 🥇', icon: '🥇', message: 'Perfekt! Du bist ein KI-Bild-Meister!' };
    if (score >= 30) return { name: 'Silber 🥈', icon: '🥈', message: 'Sehr gut! Du verstehst KI-Bilder!' };
    if (score >= 20) return { name: 'Bronze 🥉', icon: '🥉', message: 'Gut gemacht! Du bist auf dem richtigen Weg!' };
    return { name: 'Kein Rang', icon: '📝', message: 'Weiter üben! Du schaffst das!' };
}

function displayRank(rank) {
    const rankBadge = document.querySelector('.rank-icon-large');
    const rankName = document.querySelector('.rank-name-large');
    const rankMessage = document.getElementById('rankMessage');

    if (rankBadge) rankBadge.textContent = rank.icon;
    if (rankName) rankName.textContent = rank.name;
    if (rankMessage) rankMessage.textContent = rank.message;
}

function animateScore(finalScore) {
    const scoreElement = document.getElementById('finalScore');
    if (!scoreElement) return;

    let currentScore = 0;
    const increment = finalScore / 30; // 30 frames

    const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(interval);
        }
        scoreElement.textContent = Math.floor(currentScore);
    }, 30);
}

function updateChallengeBreakdown() {
    const breakdownItems = [
        document.getElementById('breakdown1'),
        document.getElementById('breakdown2'),
        document.getElementById('breakdown3'),
        document.getElementById('breakdown4')
    ];

    breakdownItems.forEach((item, index) => {
        if (!item) return;

        const isCorrect = Level4State.challengeResults[index];
        const scoreElement = item.querySelector('.breakdown-score');

        if (isCorrect) {
            item.classList.add('correct');
            scoreElement.textContent = '✓ 10/10';
            scoreElement.style.color = '#22c55e';
        } else {
            item.classList.add('incorrect');
            scoreElement.textContent = '✗ 0/10';
            scoreElement.style.color = '#ef4444';
        }
    });
}

// ===============================
//   CHARACTER ANIMATIONS
// ===============================
function initializeCharacterAnimations() {
    // Nur TXP Animation starten
    startTXPAnimation();

    // Laufenden MoMan alle 20 Sekunden spawnen
    startRunningMoManInterval();

    // Ersten MoMan sofort spawnen (für sofortiges Feedback)
    setTimeout(() => spawnRunningMoMan(), 1000);
}

function startRunningMoManInterval() {
    // Alle 20 Sekunden einen laufenden MoMan spawnen
    CharacterState.moMan.runInterval = setInterval(() => {
        spawnRunningMoMan();
    }, 20000); // 20 Sekunden
}

function spawnRunningMoMan() {
    // Random Richtung wählen
    const goingRight = Math.random() > 0.5;

    // Zufällige Höhe wählen (zwischen 50px und 400px vom unteren Rand)
    const randomBottom = Math.floor(Math.random() * 350) + 50; // 50-400px

    // MoMan Element erstellen
    const moManDiv = document.createElement('div');
    moManDiv.className = 'running-moman';
    moManDiv.style.bottom = randomBottom + 'px'; // Zufällige Höhe setzen

    const moManImg = document.createElement('img');
    moManImg.className = 'running-moman-img';
    moManDiv.appendChild(moManImg);

    // Startposition setzen
    if (goingRight) {
        moManDiv.style.left = '-150px'; // Start außerhalb links
    } else {
        moManDiv.style.right = '-150px'; // Start außerhalb rechts
        moManImg.style.transform = 'scaleX(-1)'; // Spiegeln für links-Richtung
    }

    document.body.appendChild(moManDiv);

    // Animation State für diesen MoMan
    const runState = {
        element: moManDiv,
        img: moManImg,
        currentFrame: 0,
        direction: goingRight ? 'right' : 'left',
        position: goingRight ? -150 : window.innerWidth + 150,
        animationInterval: null,
        animationFrame: null
    };

    CharacterState.runningMoMans.push(runState);

    // Click-Handler für Achievement
    moManDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        console.log('MoMan clicked!'); // Debug
        alert('MoMan wurde angeklickt!'); // Sichtbare Bestätigung

        // Achievement freischalten
        if (typeof achievements !== 'undefined') {
            const speedhunterAchievement = achievements.normal.find(a => a.id === 'speedhunter');
            console.log('Achievement found:', speedhunterAchievement); // Debug

            if (speedhunterAchievement && !speedhunterAchievement.unlocked) {
                speedhunterAchievement.progress = 1;

                if (typeof saveAchievements === 'function') {
                    saveAchievements();
                }

                if (typeof checkAchievement === 'function') {
                    checkAchievement('speedhunter');
                }
            }
        }

        // MoMan entfernen mit Animation
        moManDiv.style.transform = 'scale(1.3) rotate(360deg)';
        setTimeout(() => {
            removeRunningMoMan(runState);
        }, 300);
    });

    // Test: Auch mousedown probieren
    moManDiv.addEventListener('mousedown', function(e) {
        console.log('MoMan mousedown!');
    });

    // Frame-Animation starten
    runState.animationInterval = setInterval(() => {
        const frame = String(runState.currentFrame).padStart(5, '0');
        runState.img.src = `Mo man Lauf 2s 24fps 48 frames/Mo man Lauf Pose_${frame}.png`;
        runState.currentFrame = (runState.currentFrame + 1) % CharacterState.moMan.totalRunFrames;
    }, CharacterState.moMan.runAnimationSpeed);

    // Position-Animation starten (mit requestAnimationFrame für flüssige Bewegung)
    const speed = 22; // Pixel pro Frame

    function animatePosition() {
        if (goingRight) {
            runState.position += speed;
            moManDiv.style.left = runState.position + 'px';

            // Wenn komplett rechts raus, entfernen
            if (runState.position > window.innerWidth + 150) {
                removeRunningMoMan(runState);
                return;
            }
        } else {
            runState.position -= speed;
            moManDiv.style.left = runState.position + 'px';

            // Wenn komplett links raus, entfernen
            if (runState.position < -150) {
                removeRunningMoMan(runState);
                return;
            }
        }

        // Weiter animieren
        runState.animationFrame = requestAnimationFrame(animatePosition);
    }

    // Animation starten
    runState.animationFrame = requestAnimationFrame(animatePosition);
}

function removeRunningMoMan(runState) {
    // Animations stoppen
    if (runState.animationInterval) clearInterval(runState.animationInterval);
    if (runState.animationFrame) cancelAnimationFrame(runState.animationFrame);

    // Element entfernen
    if (runState.element && runState.element.parentNode) {
        runState.element.parentNode.removeChild(runState.element);
    }

    // Aus Array entfernen
    const index = CharacterState.runningMoMans.indexOf(runState);
    if (index > -1) {
        CharacterState.runningMoMans.splice(index, 1);
    }
}

function startTXPAnimation() {
    const txpImg = document.querySelector('.txp-host-img');
    if (!txpImg) return;

    CharacterState.txp.animationInterval = setInterval(() => {
        const frame = String(CharacterState.txp.currentFrame).padStart(5, '0');

        if (CharacterState.txp.currentAnimation === 'talk') {
            // TXP Talk Animation (24 frames - Note: filename has space!)
            txpImg.src = `TXP/TXP_Talk_Pose/TXP_Talk Pose_${frame}.png`;
            CharacterState.txp.currentFrame = (CharacterState.txp.currentFrame + 1) % CharacterState.txp.totalTalkFrames;
        } else {
            // TXP Stand Animation (24 frames)
            txpImg.src = `TXP/TXP_Stand_Pose/TXP Stand Pose_${frame}.png`;
            CharacterState.txp.currentFrame = (CharacterState.txp.currentFrame + 1) % CharacterState.txp.totalStandFrames;
        }
    }, CharacterState.txp.animationSpeed);
}

function showMoManSpeech(message, showButton = false) {
    // MoMan hat keine feste Position mehr, also keine Sprechblase
    // Stattdessen TXP sprechen lassen
    showTXPSpeech(message);
}

function hideMoManSpeech() {
    // Nicht mehr benötigt, da MoMan keine feste Position hat
    hideTXPSpeech();
}

function showTXPSpeech(message) {
    const bubble = document.getElementById('txpSpeech');

    if (bubble) {
        bubble.querySelector('p').textContent = message;
        bubble.style.display = 'block';

        // Switch to talk animation
        CharacterState.txp.currentAnimation = 'talk';
        CharacterState.txp.currentFrame = 0;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideTXPSpeech();
        }, 5000);
    }
}

function hideTXPSpeech() {
    const bubble = document.getElementById('txpSpeech');
    if (bubble) {
        bubble.style.display = 'none';
        CharacterState.txp.currentAnimation = 'stand';
        CharacterState.txp.currentFrame = 0;
    }
}

// ===============================
//   PROGRESS SAVE/LOAD
// ===============================
function saveProgress(score, rank) {
    const progress = {
        completed: true,
        score: score,
        rank: rank.name,
        timestamp: new Date().toISOString(),
        challengeResults: Level4State.challengeResults
    };

    localStorage.setItem('aiBytes_level4_progress', JSON.stringify(progress));
    console.log('Level 4 progress saved:', progress);
}

function loadProgress() {
    const saved = localStorage.getItem('aiBytes_level4_progress');
    if (saved) {
        const progress = JSON.parse(saved);
        console.log('Level 4 progress loaded:', progress);
        // Progress is loaded but we don't restore the game state
        // Just use it for displaying rank on main menu
    }
}

// ===============================
//   CLEANUP
// ===============================
window.addEventListener('beforeunload', () => {
    // Clear running MoMan interval
    if (CharacterState.moMan.runInterval) {
        clearInterval(CharacterState.moMan.runInterval);
    }

    // Clear all active running MoMans
    CharacterState.runningMoMans.forEach(runState => {
        removeRunningMoMan(runState);
    });

    // Clear TXP animation interval
    if (CharacterState.txp.animationInterval) {
        clearInterval(CharacterState.txp.animationInterval);
    }
});

console.log('Level 4: Vision Challenge loaded successfully! 🎨');
