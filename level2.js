/* ===============================
   Level 2: KI-Feature Memory Game
   =============================== */

// Game State Management
const gameState = {
    difficulty: null,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    moves: 0,
    startTime: null,
    gameTime: 0,
    timeInterval: null,
    isProcessing: false,
    currentCards: []
};

// KI Features Database with MBUX Icons
const kiFeatures = {
    // Easy Level Features (4 pairs)
    distronic: {
        id: 'distronic',
        name: 'Distronic',
        application: 'Automatisches Bremsen',
        icon: 'SVG/Distronic.svg',
        description: 'Intelligente Abstandsregelung mit automatischer Geschwindigkeitsanpassung',
        subtitle: 'Adaptive Geschwindigkeitsregelung',
        benefits: [
            'Hält automatisch sicheren Abstand',
            'Reduziert Stress im Stau',
            'Verhindert Auffahrunfälle',
            'Funktioniert bis zum Stillstand'
        ],
        difficulty: ['easy', 'medium', 'hard']
    },
    laneAssist: {
        id: 'laneAssist',
        name: 'Spurhalte-Assistent',
        application: 'Automatische Lenkkorrektur',
        icon: 'SVG/Assist.svg',
        description: 'Erkennt Fahrbahnmarkierungen und korrigiert die Fahrtrichtung sanft',
        subtitle: 'Aktive Spurführung',
        benefits: [
            'Verhindert unbeabsichtigtes Verlassen der Spur',
            'Reduziert Ermüdung bei langen Fahrten',
            'Erhöht die Sicherheit bei Nachtfahrten',
            'Warnt vor Spurwechsel ohne Blinker'
        ],
        difficulty: ['easy', 'medium', 'hard']
    },
    parkAssist: {
        id: 'parkAssist',
        name: 'Park-Assistent',
        application: 'Automatisches Einparken',
        icon: 'SVG/Park.svg',
        description: 'Findet Parkplätze und parkt das Fahrzeug automatisch ein',
        subtitle: 'Intelligentes Parken',
        benefits: [
            'Parkt in enge Lücken ein',
            'Spart Zeit bei der Parkplatzsuche',
            'Vermeidet Parkschäden',
            'Funktioniert parallel und quer'
        ],
        difficulty: ['easy', 'medium', 'hard']
    },
    navigation: {
        id: 'navigation',
        name: 'Intelligente Navigation',
        application: 'Route vorhersagen',
        icon: 'SVG/Karte.svg',
        description: 'Lernt deine Fahrgewohnheiten und schlägt Routen proaktiv vor',
        subtitle: 'Predictive Navigation',
        benefits: [
            'Berücksichtigt Verkehrslage in Echtzeit',
            'Lernt bevorzugte Routen',
            'Schlägt optimale Abfahrtszeiten vor',
            'Integriert Kalendertermine'
        ],
        difficulty: ['easy', 'medium', 'hard']
    },

    // Medium Level Features (additional 4 pairs)
    energyManagement: {
        id: 'energyManagement',
        name: 'Energie-management',
        application: 'Optimale Ladestrategie',
        icon: 'SVG/Energie.svg',
        description: 'KI-gesteuerte Optimierung von Batterie und Reichweite',
        subtitle: 'Intelligente Energie-Optimierung',
        benefits: [
            'Maximiert die Reichweite',
            'Plant optimale Ladestopps',
            'Berücksichtigt Wetter und Topografie',
            'Vorkonditionierung der Batterie'
        ],
        difficulty: ['medium', 'hard']
    },
    heyMercedes: {
        id: 'heyMercedes',
        name: 'Hey Mercedes',
        application: 'Sprachsteuerung',
        icon: 'SVG/Sprach.svg',
        description: 'Natürliche Sprachsteuerung für alle Fahrzeugfunktionen',
        subtitle: 'MBUX Sprachassistent',
        benefits: [
            'Versteht natürliche Sprache',
            'Lernt persönliche Präferenzen',
            'Hands-free Bedienung',
            'Kontinuierliche Verbesserung durch Updates'
        ],
        difficulty: ['medium', 'hard']
    },
    cameraSystem: {
        id: 'cameraSystem',
        name: '360°-Kamera-System',
        application: 'Rundumsicht',
        icon: 'SVG/Kamera.svg',
        description: 'KI-gestützte Bildverarbeitung für optimale Sicht',
        subtitle: 'Intelligente Kameraüberwachung',
        benefits: [
            'Erkennt Hindernisse automatisch',
            'Transparente Motorhaube',
            '3D-Ansicht des Fahrzeugs',
            'Nachtsicht-Funktion'
        ],
        difficulty: ['medium', 'hard']
    },
    lightControl: {
        id: 'lightControl',
        name: 'Adaptive Lichtsteuerung',
        application: 'Intelligente Beleuchtung',
        icon: 'SVG/Licht.svg',
        description: 'Automatische Anpassung der Beleuchtung an Fahrsituation',
        subtitle: 'MULTIBEAM LED',
        benefits: [
            'Blendet andere Verkehrsteilnehmer nicht',
            'Optimale Ausleuchtung der Fahrbahn',
            'Erkennt Verkehrsschilder',
            'Reagiert auf Wetter und Tageszeit'
        ],
        difficulty: ['medium', 'hard']
    },

    // Hard Level Features (additional 4 pairs)
    analytics: {
        id: 'analytics',
        name: 'Predictive Analytics',
        application: 'Vorausschauende Wartung',
        icon: 'SVG/KI.svg',
        description: 'KI analysiert Fahrzeugdaten für präventive Wartung',
        subtitle: 'Mercedes me Insights',
        benefits: [
            'Erkennt Wartungsbedarf frühzeitig',
            'Verhindert unerwartete Ausfälle',
            'Optimiert Fahrzeugperformance',
            'Senkt Betriebskosten'
        ],
        difficulty: ['hard']
    },
    compass: {
        id: 'compass',
        name: 'Intelligenter Kompass',
        application: 'Orientierungshilfe',
        icon: 'SVG/Kompass.svg',
        description: 'KI-gestützte Navigation mit erweiterten Orientierungsfunktionen',
        subtitle: 'Augmented Reality Navigation',
        benefits: [
            'AR-Anzeige in der Windschutzscheibe',
            'Präzise Positionsbestimmung',
            'Landmarks-Erkennung',
            'Intuitive Richtungsanzeigen'
        ],
        difficulty: ['hard']
    },
    distronicCurve: {
        id: 'distronicCurve',
        name: 'Distronic Kurven-Assistent',
        application: 'Intelligente Kurvenfahrt',
        icon: 'SVG/Distronic Kurve.svg',
        description: 'Erweiterte Distronic-Funktion für optimale Kurvenfahrt',
        subtitle: 'Adaptive Kurvengeschwindigkeit',
        benefits: [
            'Reduziert Geschwindigkeit vor Kurven',
            'Berücksichtigt Kurvenverlauf',
            'Komfortable Kurvenfahrt',
            'Erhöht Sicherheit bei unübersichtlichen Strecken'
        ],
        difficulty: ['hard']
    }
};

// Mo Man Animation System (Enhanced from Level 3)
class MoManHost {
    constructor() {
        this.element = document.getElementById('moHost');
        this.img = this.element.querySelector('.mo-host-img');
        this.speechBubble = document.getElementById('moSpeech');
        this.speechText = this.speechBubble.querySelector('p');
        this.currentFrame = 0;
        this.animationFrames = 23; // 0-23 = 24 frames total
        this.animationSpeed = 50;
        this.animationInterval = null;
        this.speechTimeout = null;
        this.typewriterInterval = null;
        this.typewriterSpeed = 30;
        this.targetText = '';
        this.currentText = '';

        this.startAnimation();
        this.setupUnderstoodButton();
    }

    startAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.animationInterval = setInterval(() => {
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            const framePath = `Mo man Stand Pose/Mo man Stand Pose_${frameNumber}.png`;
            this.img.src = framePath;

            this.currentFrame++;
            if (this.currentFrame > this.animationFrames) {
                this.currentFrame = 0;
            }
        }, this.animationSpeed);
    }

    speak(text, persistentMode = false) {
        // Stop any current speech/animation
        this.stopSpeaking();

        this.targetText = text;
        this.currentText = '';
        this.speechText.textContent = '';
        this.speechBubble.classList.add('visible');

        // Start typewriter effect
        this.startTypewriter();

        // Auto-hide after text is complete + buffer time (unless in persistent mode)
        if (!persistentMode) {
            const totalDuration = (text.length * this.typewriterSpeed) + 2000;
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(() => {
                this.stopSpeaking();
            }, totalDuration);
        }
    }

    startTypewriter() {
        let charIndex = 0;

        this.typewriterInterval = setInterval(() => {
            if (charIndex < this.targetText.length) {
                this.currentText += this.targetText[charIndex];
                this.speechText.textContent = this.currentText;
                charIndex++;
            } else {
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
            }
        }, this.typewriterSpeed);
    }

    stopSpeaking() {
        // Stop typewriter
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        // Stop speech timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }

        // Hide speech bubble
        this.speechBubble.classList.remove('visible');

        // Hide understood button
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.style.display = 'none';
        }
    }

    celebrate() {
        this.element.classList.add('celebrating');
        setTimeout(() => {
            this.element.classList.remove('celebrating');
        }, 600);
    }

    setupUnderstoodButton() {
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.addEventListener('click', () => {
                this.stopSpeaking();
            });
        }
    }

    showUnderstoodButton(callback) {
        const understoodBtn = document.getElementById('understoodButton');
        if (understoodBtn) {
            understoodBtn.style.display = 'block';

            // Remove any existing click handlers
            understoodBtn.replaceWith(understoodBtn.cloneNode(true));
            const newBtn = document.getElementById('understoodButton');

            // Add new click handler
            newBtn.addEventListener('click', () => {
                newBtn.style.display = 'none';
                this.stopSpeaking();
                if (callback) callback();
            });
        }
    }

    destroy() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
    }
}

// Memory Game Logic
class MemoryGame {
    constructor() {
        this.moHost = new MoManHost();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;

                // Check if difficulty is unlocked
                if (this.isDifficultyLocked(difficulty)) {
                    this.moHost.speak('Schließe erst den vorherigen Schwierigkeitsgrad ab!', 3000);
                    return;
                }

                this.startGame(difficulty);
            });
        });

        // Control buttons
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('backToDifficulty').addEventListener('click', () => {
            this.showDifficultySelection();
        });


        // Victory screen buttons
        document.getElementById('playAgain').addEventListener('click', () => {
            this.restartGame();
        });

        document.getElementById('chooseDifficulty').addEventListener('click', () => {
            this.showDifficultySelection();
        });

        document.getElementById('backToHome').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('backToLevels').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal('featureModal');
        });

        document.getElementById('continueGame').addEventListener('click', () => {
            this.closeModal('featureModal');
        });


        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });
    }

    startGame(difficulty) {
        gameState.difficulty = difficulty;
        gameState.flippedCards = [];
        gameState.matchedPairs = 0;
        gameState.moves = 0;
        gameState.startTime = Date.now();
        gameState.gameTime = 0;
        gameState.isProcessing = false;

        // Set total pairs based on difficulty
        switch (difficulty) {
            case 'easy':
                gameState.totalPairs = 4;
                break;
            case 'medium':
                gameState.totalPairs = 8;
                break;
            case 'hard':
                gameState.totalPairs = 12;
                break;
        }

        this.generateCards();
        this.updateUI();
        this.startTimer();
        this.showGameBoard();

        this.moHost.speak(`${difficulty === 'easy' ? 'Perfekt für den Einstieg!' : difficulty === 'medium' ? 'Eine gute Herausforderung!' : 'Das wird schwierig!'} Viel Erfolg!`);
    }

    generateCards() {
        // Select features based on difficulty
        const availableFeatures = Object.values(kiFeatures).filter(feature =>
            feature.difficulty.includes(gameState.difficulty)
        );

        // Randomly select the required number of features
        const selectedFeatures = availableFeatures.sort(() => Math.random() - 0.5)
            .slice(0, gameState.totalPairs);

        // Create card pairs
        const cards = [];
        selectedFeatures.forEach(feature => {
            // Feature card
            cards.push({
                id: feature.id + '_feature',
                type: 'feature',
                featureId: feature.id,
                content: feature.name,
                icon: feature.icon,
                matched: false
            });

            // Application card
            cards.push({
                id: feature.id + '_application',
                type: 'application',
                featureId: feature.id,
                content: feature.application,
                icon: feature.icon,
                matched: false
            });
        });

        // Shuffle cards
        gameState.currentCards = cards.sort(() => Math.random() - 0.5);
    }

    createCard(cardData, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.cardId = cardData.id;
        card.dataset.featureId = cardData.featureId;
        card.dataset.type = cardData.type;

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <div class="card-icon">
                    <img src="${cardData.icon}" alt="${cardData.content}" />
                </div>
                <div class="card-text">${cardData.content}</div>
            </div>
        `;

        card.addEventListener('click', () => this.flipCard(card, cardData));
        return card;
    }

    flipCard(cardElement, cardData) {
        if (gameState.isProcessing ||
            cardElement.classList.contains('flipped') ||
            cardElement.classList.contains('matched') ||
            gameState.flippedCards.length >= 2) {
            return;
        }

        cardElement.classList.add('flipped');
        gameState.flippedCards.push({ element: cardElement, data: cardData });
        gameState.moves++;

        this.updateUI();

        if (gameState.flippedCards.length === 2) {
            gameState.isProcessing = true;
            setTimeout(() => this.checkMatch(), 600);
        }
    }

    checkMatch() {
        const [card1, card2] = gameState.flippedCards;

        if (card1.data.featureId === card2.data.featureId) {
            // Match found!
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            gameState.matchedPairs++;

            this.moHost.celebrate();
            this.moHost.speak('Perfekt! Das passt zusammen!', 2000);

            // Show feature information
            setTimeout(() => {
                this.showFeatureInfo(card1.data.featureId);
            }, 300);

            // Check if game is won
            if (gameState.matchedPairs === gameState.totalPairs) {
                setTimeout(() => this.gameWon(), 1500);
            }
        } else {
            // No match
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
            }, 500);

            this.moHost.speak('Nicht ganz... Versuch es nochmal! 🤔', 2000);
        }

        gameState.flippedCards = [];
        gameState.isProcessing = false;
    }

    showFeatureInfo(featureId) {
        const feature = kiFeatures[featureId];
        if (!feature) return;

        document.getElementById('featureTitle').textContent = feature.name;
        document.getElementById('featureSubtitle').textContent = feature.subtitle;
        document.getElementById('featureDesc').textContent = feature.description;

        // Load SVG icon
        const iconContainer = document.getElementById('featureIconLarge');
        iconContainer.innerHTML = `<img src="${feature.icon}" alt="${feature.name}" />`;

        // Populate benefits
        const benefitsList = document.getElementById('featureBenefits');
        benefitsList.innerHTML = '';
        feature.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            benefitsList.appendChild(li);
        });

        this.showModal('featureModal');
    }


    gameWon() {
        this.stopTimer();

        // Save completion status
        this.saveCompletionStatus(gameState.difficulty);

        // Update victory screen
        document.getElementById('finalMoves').textContent = gameState.moves;
        document.getElementById('finalTime').textContent = this.formatTime(gameState.gameTime);

        // Show learned features
        this.showLearnedFeatures();

        this.showVictoryScreen();
        this.moHost.speak('Fantastisch! Du hast alle KI-Features gefunden!', 4000);
    }


    showLearnedFeatures() {
        const learnedList = document.getElementById('learnedList');
        learnedList.innerHTML = '';

        gameState.currentCards.forEach(card => {
            if (card.type === 'feature') {
                const feature = kiFeatures[card.featureId];
                const item = document.createElement('div');
                item.className = 'learned-item';
                item.innerHTML = `
                    <div class="learned-icon">
                        <img src="${feature.icon}" alt="${feature.name}" />
                    </div>
                    <div class="learned-text">
                        <strong>${feature.name}:</strong> ${feature.description}
                    </div>
                `;
                learnedList.appendChild(item);
            }
        });
    }

    restartGame() {
        this.stopTimer();
        this.startGame(gameState.difficulty);
    }

    showDifficultySelection() {
        this.stopTimer();

        // Reset game state for UI display
        gameState.totalPairs = 0;
        gameState.matchedPairs = 0;
        gameState.moves = 0;
        gameState.gameTime = 0;

        this.updateDifficultyStatus();
        this.updateUI(); // Update UI to show dashes
        this.showPhase('difficultySelection');
        this.moHost.speak('Wähle einen neuen Schwierigkeitsgrad!');
    }

    showGameBoard() {
        this.showPhase('gameBoard');
        const board = document.getElementById('memoryBoard');
        board.className = `memory-board ${gameState.difficulty}`;
        board.innerHTML = '';

        gameState.currentCards.forEach((cardData, index) => {
            const cardElement = this.createCard(cardData, index);
            board.appendChild(cardElement);
        });
    }

    showVictoryScreen() {
        this.showPhase('victoryScreen');
    }

    showPhase(phaseName) {
        document.querySelectorAll('.game-phase').forEach(phase => {
            phase.classList.remove('active');
        });

        const targetPhase = document.getElementById(phaseName);
        if (targetPhase) {
            targetPhase.classList.add('active');
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    startTimer() {
        this.stopTimer();
        gameState.timeInterval = setInterval(() => {
            gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
            this.updateUI();
        }, 1000);
    }

    stopTimer() {
        if (gameState.timeInterval) {
            clearInterval(gameState.timeInterval);
            gameState.timeInterval = null;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateUI() {
        document.getElementById('moveCount').textContent = gameState.moves;

        // Show dash if no game started, otherwise show pairs
        if (gameState.totalPairs === 0) {
            document.getElementById('pairCount').textContent = '-';
            document.getElementById('pairTotal').style.display = 'none';
        } else {
            document.getElementById('pairCount').textContent = gameState.matchedPairs;
            document.getElementById('totalPairs').textContent = gameState.totalPairs;
            document.getElementById('pairTotal').style.display = 'inline';
        }

        document.getElementById('timeDisplay').textContent = this.formatTime(gameState.gameTime);
    }

    saveCompletionStatus(difficulty) {
        const completions = this.getCompletions();
        completions[difficulty] = {
            completed: true,
            bestTime: gameState.gameTime,
            bestMoves: gameState.moves,
            completedAt: Date.now()
        };
        localStorage.setItem('level2_completions', JSON.stringify(completions));

        // Save rank based on difficulty
        this.saveLevel2Rank(difficulty);
    }

    saveLevel2Rank(difficulty) {
        let rank = '';
        switch(difficulty) {
            case 'easy':
                rank = 'Bronze 🥉';
                break;
            case 'medium':
                rank = 'Silber 🥈';
                break;
            case 'hard':
                rank = 'Gold 🥇';
                break;
        }

        const level2Progress = {
            completed: true,
            difficulty: difficulty,
            rank: rank,
            completedAt: Date.now()
        };

        localStorage.setItem('aiBytes_level2_progress', JSON.stringify(level2Progress));
    }

    getCompletions() {
        const saved = localStorage.getItem('level2_completions');
        return saved ? JSON.parse(saved) : {};
    }

    isDifficultyLocked(difficulty) {
        const completions = this.getCompletions();

        switch(difficulty) {
            case 'easy':
                return false; // Easy is always unlocked
            case 'medium':
                return !(completions['easy'] && completions['easy'].completed);
            case 'hard':
                return !(completions['medium'] && completions['medium'].completed);
            default:
                return false;
        }
    }

    updateDifficultyStatus() {
        const completions = this.getCompletions();

        ['easy', 'medium', 'hard'].forEach(difficulty => {
            const statusElement = document.getElementById(`${difficulty}Status`);
            const btnElement = document.querySelector(`[data-difficulty="${difficulty}"]`);

            if (this.isDifficultyLocked(difficulty)) {
                statusElement.textContent = 'Gesperrt';
                statusElement.className = 'difficulty-status locked';
                btnElement.classList.add('locked');
                btnElement.classList.remove('completed');
            } else if (completions[difficulty] && completions[difficulty].completed) {
                statusElement.textContent = 'Geschafft!';
                statusElement.className = 'difficulty-status completed';
                btnElement.classList.add('completed');
                btnElement.classList.remove('locked');
            } else {
                statusElement.textContent = '';
                statusElement.className = 'difficulty-status';
                btnElement.classList.remove('completed', 'locked');
            }
        });
    }
}

// Initialize Game
let memoryGame;

document.addEventListener('DOMContentLoaded', () => {
    memoryGame = new MemoryGame();
    memoryGame.updateDifficultyStatus(); // Show completion status on load
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (memoryGame && memoryGame.moHost) {
        memoryGame.moHost.destroy();
    }
});