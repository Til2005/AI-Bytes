/* ===============================
   Level 3: Advanced Prompting Workshop
   =============================== */

// Game State Management
const gameState = {
    currentPhase: 'intro',
    currentSubGame: null,
    totalScore: 0,
    techniquesLearned: 0,
    completedChallenges: 0,
    techniqueStatuses: {
        fewshot: false,
        chainofthought: false,
        treeofthoughts: false
    },
    criticalChallenges: {
        bias: false,
        privacy: false,
        facts: false
    },
    currentQuizQuestion: 0,
    quizAnswers: [],
    quizScore: 0,
    bestRank: null,
    bestRankDescription: null
};

// Quiz Questions Database
const quizQuestions = [
    {
        id: 1,
        question: "Welche Prompting-Technik eignet sich am besten für komplexe Problemlösungen?",
        options: [
            { letter: "A", text: "Few Shot Prompting", correct: false },
            { letter: "B", text: "Chain-of-Thought", correct: true },
            { letter: "C", text: "Tree of Thoughts", correct: false },
            { letter: "D", text: "ReAct", correct: false }
        ],
        explanation: "Chain-of-Thought eignet sich am besten für komplexe Probleme, da es diese in logische Schritte unterteilt."
    },
    {
        id: 2,
        question: "Was ist der Hauptvorteil von Few Shot Prompting?",
        options: [
            { letter: "A", text: "Es löst Probleme schrittweise", correct: false },
            { letter: "B", text: "Es zeigt der KI durch Beispiele, was erwartet wird", correct: true },
            { letter: "C", text: "Es kombiniert Denken und Handeln", correct: false },
            { letter: "D", text: "Es erkundet verschiedene Ideenpfade", correct: false }
        ],
        explanation: "Few Shot Prompting funktioniert durch das Bereitstellen von Beispielen, die der KI zeigen, welche Art von Antwort gewünscht ist."
    },
    {
        id: 3,
        question: "Welche Technik kombiniert Denken, Handeln und Beobachten?",
        options: [
            { letter: "A", text: "Few Shot Prompting", correct: false },
            { letter: "B", text: "Chain-of-Thought", correct: false },
            { letter: "C", text: "Tree of Thoughts", correct: false },
            { letter: "D", text: "ReAct", correct: true }
        ],
        explanation: "ReAct (Reasoning and Acting) kombiniert systematisch Denken (Thought), Handeln (Action) und Beobachten (Observation)."
    },
    {
        id: 4,
        question: "Wann sollten Sie besonders kritisch bei KI-Antworten sein?",
        options: [
            { letter: "A", text: "Nur bei technischen Themen", correct: false },
            { letter: "B", text: "Bei Fakten, Bias und Datenschutz", correct: true },
            { letter: "C", text: "Nur bei kreativen Aufgaben", correct: false },
            { letter: "D", text: "Nie, KI ist immer korrekt", correct: false }
        ],
        explanation: "KI kann Fehler machen, Bias enthalten und Datenschutzprobleme verursachen. Kritisches Hinterfragen ist immer wichtig."
    },
    {
        id: 5,
        question: "Was macht einen guten Prompt aus?",
        options: [
            { letter: "A", text: "Er ist möglichst kurz", correct: false },
            { letter: "B", text: "Er ist klar, strukturiert und kontextreich", correct: true },
            { letter: "C", text: "Er verwendet viele Fachwörter", correct: false },
            { letter: "D", text: "Er ist möglichst lang", correct: false }
        ],
        explanation: "Ein guter Prompt ist klar formuliert, gut strukturiert und bietet ausreichend Kontext für die gewünschte Aufgabe."
    }
];

// Technique Training Data
const techniqueTrainingData = {
    fewshot: {
        task: "Erstelle einen Prompt für kreative Produktbeschreibungen",
        examples: [
            {
                text: "Smartwatch X1: Revolutioniert dein Leben mit KI-Power! ⚡",
                quality: "bad",
                reason: "Übertreibung, unprofessionell"
            },
            {
                text: "Ergonomischer Bürostuhl - 5 Jahre Garantie, verstellbare Höhe",
                quality: "good",
                reason: "Sachlich, konkrete Vorteile"
            },
            {
                text: "Das beste Produkt ever!!! Kaufen Sie jetzt!!!",
                quality: "bad",
                reason: "Spam-artig, keine Informationen"
            },
            {
                text: "Nachhaltige Bambuszahnbürste: Biologisch abbaubar, schont die Umwelt, weiche Borsten für empfindliches Zahnfleisch",
                quality: "good",
                reason: "Informativ, Zielgruppe angesprochen"
            },
            {
                text: "Bestseller Nr. 1 - Unglaubliche Qualität zu unschlagbaren Preisen",
                quality: "bad",
                reason: "Leere Versprechungen, keine Fakten"
            },
            {
                text: "Bio-Olivenöl aus Italien: Kaltgepresst, erste Güteklasse, ideal für Salate und Mediterrane Küche",
                quality: "good",
                reason: "Spezifisch, Anwendung erklärt"
            }
        ],
        correctSelection: ["good", "good", "good"],
        feedback: {
            perfect: "Excellent! Du hast die besten Beispiele ausgewählt - sachlich, informativ und zielgruppenspezifisch.",
            good: "Gut! Du verstehst die Grundlagen von Few Shot Prompting.",
            poor: "Die ausgewählten Beispiele zeigen nicht die gewünschte Qualität. Wähle konkrete, informative Beispiele."
        }
    },
    chainofthought: {
        task: "Entwickle eine Content-Strategie für ein neues AI-Startup",
        correctSteps: [
            { id: "target_analysis", text: "Tech-Entscheider und AI-Interessierte als Zielgruppe identifizieren", order: 1 },
            { id: "competitor_research", text: "Konkurrenz-Content analysieren und Differenzierungsmöglichkeiten finden", order: 2 },
            { id: "content_themes", text: "AI-Trends, Use Cases und Best Practices als Content-Themen festlegen", order: 3 },
            { id: "content_calendar", text: "Redaktionsplan mit Blog, Social Media und Webinaren erstellen", order: 4 }
        ],
        distractorSteps: [
            { id: "logo_design", text: "Corporate Design und Logo für die Content-Kanäle entwickeln" },
            { id: "seo_keywords", text: "Technische SEO-Optimierung und Keyword-Research durchführen" },
            { id: "influencer_outreach", text: "Influencer-Partnerships und Kooperationen aufbauen" },
            { id: "budget_planning", text: "Marketing-Budget aufteilen und Content-Kosten kalkulieren" },
            { id: "analytics_setup", text: "Tracking-Tools und Conversion-Metriken implementieren" },
            { id: "team_hiring", text: "Content-Team rekrutieren und Freelancer beauftragen" }
        ],
    },
    treeofthoughts: {
        questions: [
            {
                id: 1,
                question: "Wie optimiere ich die Performance meiner Prompts?",
                branches: [
                    {
                        id: "verbose_detail",
                        text: "Detaillierte Prompts mit vielen möglichen Parametern",
                        quality: "good"
                    },
                    {
                        id: "generic_prompts",
                        text: "Immer die gleichen Prompts für alle Aufgaben verwenden",
                        quality: "bad"
                    },
                    {
                        id: "template_reuse",
                        text: "Bewährte Template-Struktur adaptieren und anpassen",
                        quality: "good"
                    },
                    {
                        id: "emotion_injection",
                        text: "Emotionale Sprache für stärkere KI-Reaktionen verwenden",
                        quality: "good"
                    }
                ]
            },
            {
                id: 2,
                question: "Welcher Ansatz führt zu konsistenten Prompt-Ergebnissen?",
                branches: [
                    {
                        id: "constraint_heavy",
                        text: "Viele spezifische Constraints und Regeln definieren",
                        quality: "good"
                    },
                    {
                        id: "output_format",
                        text: "Klare Output-Format Spezifikation mit Beispielen",
                        quality: "excellent"
                    },
                    {
                        id: "multiple_attempts",
                        text: "Mehrere Varianten gleichzeitig testen und vergleichen",
                        quality: "good"
                    },
                    {
                        id: "natural_language",
                        text: "Natürliche Konversation ohne technische Struktur",
                        quality: "bad"
                    }
                ]
            },
            {
                id: 3,
                question: "Wie erkenne ich suboptimale Prompt-Strategien?",
                branches: [
                    {
                        id: "output_variance",
                        text: "Hohe Varianz in Output-Qualität bei ähnlichen Inputs",
                        quality: "excellent"
                    },
                    {
                        id: "token_efficiency",
                        text: "Ineffiziente Token-Nutzung bei gleichem Ergebnis",
                        quality: "good"
                    },
                    {
                        id: "context_bleeding",
                        text: "Ungewollte Einflüsse aus vorherigen Konversationen",
                        quality: "good"
                    },
                    {
                        id: "fast_results",
                        text: "Schnelle Ergebnisse sind immer ein Zeichen für Effizienz",
                        quality: "bad"
                    }
                ]
            }
        ]
    },
};

// Critical Thinking Challenges
const criticalChallenges = {
    bias: {
        example: "Ein KI-Assistent wurde gefragt: 'Wer ist besser für Führungspositionen geeignet?' Die Antwort war: 'Männer zeigen oft natürliche Führungsqualitäten wie Durchsetzungsvermögen und strategisches Denken, während Frauen eher für unterstützende Rollen geeignet sind.'",
        options: [
            { id: "gender", text: "Gender-Bias", correct: true },
            { id: "age", text: "Alters-Bias", correct: false },
            { id: "cultural", text: "Kultureller Bias", correct: false },
            { id: "no_bias", text: "Kein Bias erkennbar", correct: false }
        ],
        explanation: "Korrekt! Dies ist ein klarer Gender-Bias. Die KI reproduziert Geschlechterstereotype und diskriminierende Annahmen über Führungsfähigkeiten."
    },
    privacy: {
        examples: [
            { text: "Firmen-E-Mail Adresse: max.mustermann@firma.de", safe: false },
            { text: "Persönliche Bankdaten: DE89 3704 0044 0532 0130 00", safe: false },
            { text: "Öffentliche LinkedIn-Profil URL", safe: true },
            { text: "Interne Gehaltsstrukturen des Unternehmens", safe: false },
            { text: "Allgemeine Marketingstrategien", safe: true },
            { text: "Persönliche Krankenakte", safe: false }
        ],
        explanation: "Datenschutz ist kritisch! Teile niemals echte Namen, E-Mail-Adressen, Bankdaten, interne Firmendaten oder Gesundheitsinformationen mit KI-Tools."
    },
    facts: {
        claims: [
            {
                text: "ChatGPT wurde 2019 von OpenAI veröffentlicht",
                correct: false,
                fact: "ChatGPT wurde im November 2022 veröffentlicht"
            },
            {
                text: "Deutschland hat 83 Millionen Einwohner",
                correct: true,
                fact: "Korrekt, Deutschland hat etwa 83 Millionen Einwohner (Stand 2023)"
            },
            {
                text: "KI kann bereits alle menschlichen Fähigkeiten übertreffen",
                correct: false,
                fact: "KI übertrifft Menschen nur in spezifischen Bereichen, nicht in allen"
            }
        ],
        verification: [
            "Offizielle Quellen prüfen",
            "Mehrere Quellen vergleichen",
            "Aktualität der Information prüfen",
            "Expertenaussagen einbeziehen"
        ]
    }
};

// Master Challenge Scenarios
const masterScenarios = {
    business: {
        title: "Business-Strategie Entwicklung",
        description: "Ein mittelständisches Unternehmen möchte KI-Tools einführen, um die Effizienz zu steigern. Erstelle eine Implementierungsstrategie.",
        requirements: [
            "Bestandsanalyse der aktuellen Prozesse",
            "Geeignete KI-Tools identifizieren",
            "Implementierungsplan mit Zeitrahmen",
            "Schulungskonzept für Mitarbeiter",
            "ROI-Bewertung und Erfolgsmetriken"
        ],
        expectedTechniques: ["chainofthought", "react"],
        difficulty: 3
    },
    creative: {
        title: "Content-Strategie für Social Media",
        description: "Entwickle eine 3-Monats Content-Strategie für ein nachhaltiges Fashion-Startup auf Instagram.",
        requirements: [
            "Zielgruppenanalyse",
            "Content-Kategorien definieren",
            "Posting-Zeitplan erstellen",
            "Influencer-Kooperationen planen",
            "Engagement-Strategien entwickeln"
        ],
        expectedTechniques: ["fewshot", "treeofthoughts"],
        difficulty: 2
    },
    technical: {
        title: "KI-System Architektur",
        description: "Konzipiere ein KI-basiertes Empfehlungssystem für einen E-Commerce Store mit 100.000+ Produkten.",
        requirements: [
            "Datenquellen und -struktur definieren",
            "Machine Learning Algorithmus auswählen",
            "Skalierbarkeit und Performance planen",
            "A/B-Testing Strategie",
            "Datenschutz und Ethik berücksichtigen"
        ],
        expectedTechniques: ["chainofthought", "react", "treeofthoughts"],
        difficulty: 4
    }
};

// Mo Man Workshop Animation System
class MoWorkshopHost {
    constructor() {
        this.element = document.getElementById('moWorkshopHost');
        this.img = this.element.querySelector('.mo-workshop-img');
        this.speechBubble = document.getElementById('moWorkshopSpeech');
        this.speechText = this.speechBubble.querySelector('p');

        // Animation properties
        this.currentFrame = 0;
        this.celebrationFrames = 23;
        this.speechFrames = 12; // 00000 to 00011
        this.animationSpeed = 40;
        this.speechAnimationSpeed = 80; // Separate speed for speech animation
        this.animationInterval = null;
        this.speechTimeout = null;

        // Typewriter properties
        this.typewriterInterval = null;
        this.currentText = '';
        this.targetText = '';
        this.typewriterSpeed = 30; // milliseconds per character

        this.isIdle = true;
        this.startIdleAnimation();
    }

    startIdleAnimation() {
        this.stopAnimation();
        this.isIdle = true;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo man Stand Pose/Mo man Stand Pose_${frameNumber}.png`;
        }, this.animationSpeed);
    }

    speak(text, persistentMode = false) {
        // Stop any current speech/animation
        this.stopSpeaking();

        this.targetText = text;
        this.currentText = '';
        this.speechText.textContent = '';
        this.speechBubble.classList.add('visible');

        // Start speech animation
        this.startSpeechAnimation();

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

        // Return to idle animation
        this.startIdleAnimation();
    }

    celebrate() {
        this.stopSpeaking();
        this.startCelebrationAnimation();

        // No visual transform applied
        setTimeout(() => {
            this.startIdleAnimation();
        }, 2000);
    }

    startSpeechAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.speechFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Moman speech_animation/Moman Rede_${frameNumber}.png`;
        }, this.speechAnimationSpeed);
    }

    startCelebrationAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo man Stand Pose/Mo man Stand Pose_${frameNumber}.png`;
        }, this.animationSpeed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.currentFrame = 0;
    }

    destroy() {
        this.stopAnimation();
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
    }
}

// Main Workshop Game Class
class AdvancedPromptingWorkshop {
    constructor() {
        this.moHost = new MoWorkshopHost();
        this.selectedExamples = [];
        this.stepSequence = [];
        this.selectedThoughtNode = null;
        this.reactHistory = [];
        this.loadProgress(); // Load saved progress including best rank
        this.initializeEventListeners();
        this.updateUI();
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('aiBytes_level3_progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                // Load best rank if available
                if (progress.bestRank) {
                    gameState.bestRank = progress.bestRank;
                    gameState.bestRankDescription = progress.bestRankDescription;
                }
            } catch (e) {
                console.log('Could not load previous progress');
            }
        }
    }

    initializeEventListeners() {
        // Navigation
        const startBtn = document.getElementById('startWorkshop');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startTechniqueTrainingPhase();
            });
        }

        const backHomeBtn = document.getElementById('backToHome');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        const backHomeLevel3Btn = document.getElementById('backToHomeLevel3');
        if (backHomeLevel3Btn) {
            backHomeLevel3Btn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        const playAgainBtn = document.getElementById('playAgainLevel3');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.restartWorkshop();
            });
        }


        // Phase 2: Technique Training
        document.querySelectorAll('.technique-card.clickable').forEach(card => {
            card.addEventListener('click', (e) => {
                const technique = e.currentTarget.dataset.technique;
                this.startTechniqueTraining(technique);
            });
        });

        const continuePhase2Btn = document.getElementById('continueToPhase2');
        if (continuePhase2Btn) {
            continuePhase2Btn.addEventListener('click', () => {
                this.startCriticalThinking();
            });
        }

        // Technique Training Navigation
        const backBtns = ['backToTechniques1', 'backToTechniques2', 'backToTechniques3'];
        backBtns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.showTechniqueSelection();
                });
            }
        });

        // Technique Submissions
        const submitBtns = [
            {id: 'submitFewshot', handler: () => this.submitFewshotTraining()},
            {id: 'submitChainOfThought', handler: () => this.submitChainOfThoughtTraining()}
        ];
        submitBtns.forEach(({id, handler}) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });

        // Phase 3: Critical Thinking
        const criticalBtns = [
            {id: 'submitBias', handler: () => this.submitBiasChallenge()},
            {id: 'submitPrivacy', handler: () => this.submitPrivacyChallenge()},
            {id: 'submitFacts', handler: () => this.submitFactsChallenge()},
            {id: 'continueToPhase3', handler: () => this.startMasterChallenge()},

            // Critical Challenge Navigation
            {id: 'backToCriticalSelection1', handler: () => this.showCriticalSelection()},
            {id: 'backToCriticalSelection2', handler: () => this.showCriticalSelection()},
            {id: 'backToCriticalSelection3', handler: () => this.showCriticalSelection()}
        ];
        criticalBtns.forEach(({id, handler}) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });

        // Phase 4: Master Challenge
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const scenario = e.currentTarget.dataset.scenario;
                this.startMasterScenario(scenario);
            });
        });

        const masterBtns = [
            {id: 'backToScenarios', handler: () => this.showScenarioSelection()},
            {id: 'testMasterPrompt', handler: () => this.testMasterPrompt()},
            {id: 'submitMasterChallenge', handler: () => this.submitMasterChallenge()}
        ];
        masterBtns.forEach(({id, handler}) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });

        // Technique Tools (only if they exist)
        const techniqueTools = document.querySelectorAll('.technique-tool');
        if (techniqueTools.length > 0) {
            techniqueTools.forEach(tool => {
                tool.addEventListener('click', (e) => {
                    const toolType = e.currentTarget.dataset.tool;
                    this.insertTechniqueTool(toolType);
                });
            });
        }

        // Tree of Thoughts Controls
        const pruneBtn = document.getElementById('pruneNode');
        if (pruneBtn) {
            pruneBtn.addEventListener('click', () => {
                this.pruneBadNode();
            });
        }

        // Real-time prompt analysis
        const masterPrompt = document.getElementById('masterPrompt');
        if (masterPrompt) {
            masterPrompt.addEventListener('input', () => {
                this.analyzeMasterPrompt();
            });
        }


        // Quiz Controls
        const quizBtns = [
            {id: 'submitQuizAnswer', handler: () => this.submitQuizAnswer()},
            {id: 'nextQuizQuestion', handler: () => this.nextQuizQuestion()}
        ];
        quizBtns.forEach(({id, handler}) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });
    }

    updateUI() {
        const currentPhaseElement = document.getElementById('currentPhase');
        if (currentPhaseElement) {
            currentPhaseElement.textContent = this.getPhaseText();
        }

        const totalScoreElement = document.getElementById('totalScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = gameState.totalScore;
        }

        // Note: techniquesLearned element was removed from HTML, so we skip it
        // const techniquesLearnedElement = document.getElementById('techniquesLearned');
        // if (techniquesLearnedElement) {
        //     techniquesLearnedElement.textContent = `${gameState.techniquesLearned}/3`;
        // }
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
                if (callback) callback();
            });
        }
    }

    getPhaseText() {
        switch(gameState.currentPhase) {
            case 'intro': return 'Einführung';
            case 'training': return '1/3';
            case 'critical': return '2/3';
            case 'master': return '3/3';
            case 'complete': return 'Abgeschlossen';
            default: return '1/3';
        }
    }

    showPhase(phaseName) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetPhase = document.getElementById(phaseName);
        if (targetPhase) {
            targetPhase.classList.add('active');
        }
    }


    // Phase 1: Technique Training (formerly Phase 2)
    startTechniqueTrainingPhase() {
        gameState.currentPhase = 'training';
        this.showPhase('techniqueTrainingScreen');
        this.showTechniqueSelection();
        this.moHost.speak('Phase 1: Lerne die 3 mächtigen Prompting-Techniken! Wähle eine Technik zum Trainieren.');
        this.updateUI();
    }

    showTechniqueSelection() {
        // Hide all mini-games
        document.querySelectorAll('.mini-game').forEach(game => {
            game.classList.remove('active');
        });

        // Show technique selection
        const techniqueSelection = document.getElementById('techniqueSelection');
        if (techniqueSelection) {
            techniqueSelection.classList.add('active');
        }

        // Show the training header when on technique selection
        const trainingHeader = document.getElementById('trainingMainHeader');
        if (trainingHeader) {
            trainingHeader.style.display = 'block';
        }

        // Update technique statuses
        this.updateTechniqueStatuses();
    }

    updateTechniqueStatuses() {
        Object.keys(gameState.techniqueStatuses).forEach(technique => {
            const statusElement = document.getElementById(`${technique}Status`);
            if (statusElement) {
                if (gameState.techniqueStatuses[technique]) {
                    statusElement.textContent = 'Abgeschlossen ✓';
                    statusElement.className = 'technique-status completed';
                } else {
                    statusElement.textContent = 'Nicht abgeschlossen';
                    statusElement.className = 'technique-status';
                }
            }
        });

        // Enable continue button if all techniques completed
        const allCompleted = Object.values(gameState.techniqueStatuses).every(status => status);
        const continueBtn = document.getElementById('continueToPhase2');
        if (continueBtn) {
            continueBtn.disabled = !allCompleted;
        }
    }

    startTechniqueTraining(technique) {
        // If no technique specified, show technique selection
        if (!technique) {
            gameState.currentSubGame = null;
            const techniqueSelection = document.getElementById('techniqueSelection');
            if (techniqueSelection) {
                techniqueSelection.classList.add('active');
            }
            return;
        }

        // Check if technique is already completed
        if (gameState.techniqueStatuses[technique]) {
            const techniqueNames = {
                'fewshot': 'Few Shot Prompting',
                'chainofthought': 'Chain-of-Thought',
                'treeofthoughts': 'Tree of Thoughts'
            };
            this.moHost.speak(`Du hast ${techniqueNames[technique]} bereits abgeschlossen! Wähle ein anderes Training.`);
            return;
        }

        gameState.currentSubGame = technique;

        // Hide technique selection
        const techniqueSelection = document.getElementById('techniqueSelection');
        if (techniqueSelection) {
            techniqueSelection.classList.remove('active');
        }

        // Hide the training header when in a mini-game
        const trainingHeader = document.getElementById('trainingMainHeader');
        if (trainingHeader) {
            trainingHeader.style.display = 'none';
        }

        // Show specific mini-game
        const gameElement = document.getElementById(`${technique}Game`);
        if (gameElement) {
            gameElement.classList.add('active');
        }

        // Initialize the specific technique
        switch(technique) {
            case 'fewshot':
                this.initializeFewshotGame();
                break;
            case 'chainofthought':
                this.initializeChainOfThoughtGame();
                break;
            case 'treeofthoughts':
                this.initializeTreeOfThoughtsGame();
                break;
        }
    }

    // Few Shot Training
    initializeFewshotGame() {
        this.selectedExamples = [];
        const data = techniqueTrainingData.fewshot;

        document.getElementById('fewshotTask').textContent = data.task;

        const examplePool = document.getElementById('examplePool');
        examplePool.innerHTML = '';

        data.examples.forEach((example, index) => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-item';
            exampleDiv.draggable = true;
            exampleDiv.dataset.index = index;
            exampleDiv.dataset.quality = example.quality;
            exampleDiv.textContent = example.text;

            // Drag and drop events
            exampleDiv.addEventListener('dragstart', this.handleDragStart.bind(this));
            exampleDiv.addEventListener('click', this.selectExample.bind(this));

            examplePool.appendChild(exampleDiv);
        });

        this.setupDropZone();
        this.moHost.speak('Wähle genau 3 der besten Beispiele aus! Ziehe sie in den Auswahlbereich oder klicke darauf.');
    }

    selectExample(e) {
        const exampleElement = e.currentTarget;
        const index = parseInt(exampleElement.dataset.index);

        if (this.selectedExamples.includes(index)) {
            // Deselect
            this.selectedExamples = this.selectedExamples.filter(i => i !== index);
            exampleElement.style.opacity = '1';
            this.removeFromSelectedArea(index);
        } else if (this.selectedExamples.length < 3) {
            // Select
            this.selectedExamples.push(index);
            exampleElement.style.opacity = '0.5';
            this.addToSelectedArea(index);
        } else {
            this.moHost.speak('Du kannst maximal 3 Beispiele auswählen!');
        }
    }

    addToSelectedArea(index) {
        const selectedArea = document.getElementById('selectedExamples');
        const dropZone = selectedArea.querySelector('.drop-zone');

        if (dropZone && this.selectedExamples.length === 1) {
            selectedArea.removeChild(dropZone);
        }

        const data = techniqueTrainingData.fewshot;
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'example-item';
        exampleDiv.dataset.index = index;
        exampleDiv.textContent = data.examples[index].text;
        exampleDiv.addEventListener('click', () => this.selectExample({currentTarget: document.querySelector(`[data-index="${index}"]`)}));

        selectedArea.appendChild(exampleDiv);
    }

    removeFromSelectedArea(index) {
        const selectedArea = document.getElementById('selectedExamples');
        const itemToRemove = selectedArea.querySelector(`[data-index="${index}"]`);
        if (itemToRemove) {
            selectedArea.removeChild(itemToRemove);
        }

        if (this.selectedExamples.length === 0) {
            selectedArea.innerHTML = '<div class="drop-zone">Ziehe Beispiele hierher</div>';
            this.setupDropZone();
        }
    }

    setupDropZone() {
        const dropZone = document.querySelector('#selectedExamples .drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropZone.addEventListener('drop', this.handleDrop.bind(this));
        }
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const index = parseInt(e.dataTransfer.getData('text/plain'));
        if (!this.selectedExamples.includes(index) && this.selectedExamples.length < 3) {
            this.selectedExamples.push(index);
            this.addToSelectedArea(index);

            // Update visual state
            const originalElement = document.querySelector(`[data-index="${index}"]`);
            originalElement.style.opacity = '0.5';
        }

        // Remove dragging class
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    }

    submitFewshotTraining() {
        // Anti-cheat: Check if already completed
        if (gameState.techniqueStatuses.fewshot) {
            this.moHost.speak('Du hast Few Shot Prompting bereits abgeschlossen! Wähle ein anderes Training.');
            return;
        }

        if (this.selectedExamples.length !== 3) {
            this.moHost.speak('Du musst genau 3 Beispiele auswählen!');
            return;
        }

        const data = techniqueTrainingData.fewshot;
        let score = 0;
        let goodExamples = 0;

        this.selectedExamples.forEach(index => {
            if (data.examples[index].quality === 'good') {
                goodExamples++;
            }
        });

        let initialFeedback = "";
        let hasErrors = false;

        if (goodExamples === this.selectedExamples.length && goodExamples >= 2) {
            score = 100;
            initialFeedback = data.feedback.perfect;
        } else if (goodExamples >= 2) {
            score = 70;
            initialFeedback = data.feedback.good;
        } else if (goodExamples >= 1) {
            // Partial points for some correct examples
            score = Math.round((goodExamples / 3) * 50); // Partial scoring
            initialFeedback = `Du hast ${goodExamples} von 3 gute Beispiele gewählt. Das ist ein Anfang!`;
            hasErrors = true;
        } else {
            // No points for completely wrong selection
            score = 0;
            initialFeedback = data.feedback.poor;
            hasErrors = true;
        }

        gameState.totalScore += score;
        gameState.techniqueStatuses.fewshot = true;
        gameState.techniquesLearned++;

        this.moHost.speak(initialFeedback);

        // If there were errors, provide detailed explanation after initial feedback
        if (hasErrors) {
            setTimeout(() => {
                let explanation = "Hier die detaillierte Analyse deiner Auswahl: ";
                let chosenBadExamples = [];
                let chosenGoodExamples = [];
                let missedGoodExamples = [];

                // Analysiere alle gewählten Beispiele
                this.selectedExamples.forEach(index => {
                    const example = data.examples[index];
                    if (example.quality === 'bad') {
                        chosenBadExamples.push({
                            text: example.text,
                            reason: this.getBadExampleReason(example.text)
                        });
                    } else if (example.quality === 'good') {
                        chosenGoodExamples.push(example.text);
                    }
                });

                // Finde gute Beispiele, die nicht gewählt wurden
                data.examples.forEach((example, index) => {
                    if (example.quality === 'good' && !this.selectedExamples.includes(index)) {
                        missedGoodExamples.push(example.text);
                    }
                });

                // Erkläre falsche Entscheidungen
                if (chosenBadExamples.length > 0) {
                    explanation += `❌ Problematische Beispiele die du gewählt hast: `;
                    chosenBadExamples.forEach((badExample, idx) => {
                        explanation += `${idx + 1}. "${badExample.text.substring(0, 35)}..." - ${badExample.reason}. `;
                    });
                }

                // Erkläre richtige Entscheidungen
                if (chosenGoodExamples.length > 0) {
                    explanation += `✅ Gute Beispiele die du gewählt hast: `;
                    chosenGoodExamples.forEach((goodExample, idx) => {
                        explanation += `"${goodExample.substring(0, 35)}..."${idx < chosenGoodExamples.length - 1 ? ', ' : '. '}`;
                    });
                }

                // Zeige verpasste gute Beispiele
                if (missedGoodExamples.length > 0) {
                    explanation += `💡 Gute Beispiele die du verpasst hast: `;
                    missedGoodExamples.forEach((missedExample, idx) => {
                        explanation += `"${missedExample.substring(0, 35)}..."${idx < missedGoodExamples.length - 1 ? ', ' : '. '}`;
                    });
                }

                this.moHost.speak(explanation, true); // Use persistent mode

                // Show understood button and wait for user confirmation
                this.showUnderstoodButton(() => {
                    this.moHost.stopSpeaking(); // Manually hide when understood
                    this.moHost.celebrate();
                    setTimeout(() => {
                        this.showTechniqueSelection();
                    }, 2000);
                });
            }, 3000);
        } else {
            // Perfect score, no explanation needed
            setTimeout(() => {
                this.moHost.celebrate();
                setTimeout(() => {
                    this.showTechniqueSelection();
                }, 2000);
            }, 3000);
        }

        this.updateUI();
    }

    getBadExampleReason(exampleText) {
        // Kategorisiere schlechte Beispiele basierend auf ihrem Inhalt
        const text = exampleText.toLowerCase();

        if (text.includes('allgemein') || text.includes('grundlegend') || text.includes('einfach')) {
            return "zu allgemein und unspezifisch";
        } else if (text.includes('komplex') || text.includes('schwierig') || text.includes('fortgeschritten')) {
            return "zu komplex ohne klare Struktur";
        } else if (text.includes('schnell') || text.includes('kurz') || text.length < 50) {
            return "zu kurz und oberflächlich";
        } else if (text.includes('verwirrend') || text.includes('unklar')) {
            return "verwirrend formuliert";
        } else {
            return "nicht relevant für die spezifische Aufgabe";
        }
    }

    // Chain of Thought Training
    initializeChainOfThoughtGame() {
        this.stepSlots = [null, null, null, null];
        const data = techniqueTrainingData.chainofthought;

        document.getElementById('chainProblem').textContent = data.task;
        this.populateStepsPool();
        this.setupDragAndDrop();
        this.moHost.speak('Zerlege das komplexe Problem in logische Schritte. Nutze die Anleitung links und ziehe die richtigen Schritte in die korrekte Reihenfolge!');
    }

    populateStepsPool() {
        const data = techniqueTrainingData.chainofthought;
        const stepsPool = document.getElementById('stepsPool');
        stepsPool.innerHTML = '';

        // Combine correct steps and distractors, then shuffle properly
        const allSteps = [...data.correctSteps, ...data.distractorSteps];

        // Fisher-Yates shuffle for better randomization
        for (let i = allSteps.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allSteps[i], allSteps[j]] = [allSteps[j], allSteps[i]];
        }

        allSteps.forEach(step => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-item';
            stepDiv.draggable = true;
            stepDiv.dataset.stepId = step.id;
            stepDiv.textContent = step.text;

            stepDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', step.id);
                stepDiv.classList.add('dragging');
            });

            stepDiv.addEventListener('dragend', () => {
                stepDiv.classList.remove('dragging');
            });

            stepsPool.appendChild(stepDiv);
        });
    }

    setupDragAndDrop() {
        document.querySelectorAll('.step-slot').forEach((slot, index) => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');

                const stepId = e.dataTransfer.getData('text/plain');
                const stepElement = document.querySelector(`[data-step-id="${stepId}"]`);

                if (stepElement && !this.stepSlots[index]) {
                    this.stepSlots[index] = stepId;
                    const stepText = stepElement.textContent;

                    slot.querySelector('.slot-content').textContent = stepText;
                    slot.classList.add('filled');
                    slot.dataset.stepId = stepId;

                    stepElement.remove();
                    this.checkCompletion();
                    this.updateGuidance();
                }
            });
        });
    }

    updateGuidance() {
        const filledSlots = this.stepSlots.filter(slot => slot !== null).length;

        document.querySelectorAll('.guidance-step').forEach((step, index) => {
            if (index < filledSlots) {
                step.classList.remove('active');
            } else if (index === filledSlots) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    checkCompletion() {
        const allSlotsFilled = this.stepSlots.every(slot => slot !== null);
        const submitBtn = document.getElementById('submitChainOfThought');

        if (allSlotsFilled) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reihenfolge bestätigen';
        } else {
            submitBtn.disabled = true;
        }
    }

    setupStepSlots() {
        const stepSlots = document.getElementById('stepSlots');
        stepSlots.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'step-slot';
            slot.dataset.position = i;
            slot.textContent = `Schritt ${i + 1}`;

            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');

                const stepId = e.dataTransfer.getData('text/plain');
                const stepData = techniqueTrainingData.chainofthought.steps.find(s => s.id === stepId);

                if (stepData) {
                    slot.textContent = stepData.text;
                    slot.classList.add('filled');
                    slot.dataset.stepId = stepId;

                    this.stepSequence[i] = stepId;

                    // Remove from pool
                    const poolItem = document.querySelector(`[data-step-id="${stepId}"]`);
                    if (poolItem) {
                        poolItem.remove();
                    }
                }
            });

            stepSlots.appendChild(slot);
        }
    }

    submitChainOfThoughtTraining() {
        // Anti-cheat: Check if already completed
        if (gameState.techniqueStatuses.chainofthought) {
            this.moHost.speak('Du hast Chain-of-Thought bereits abgeschlossen! Wähle ein anderes Training.');
            return;
        }

        const data = techniqueTrainingData.chainofthought;
        let score = 0;
        let correctSequence = 0;

        // Check if steps are in correct order
        this.stepSlots.forEach((stepId, index) => {
            const correctStep = data.correctSteps.find(step => step.order === index + 1);
            if (correctStep && stepId === correctStep.id) {
                correctSequence++;
            }
        });

        // Calculate score based on correct sequence
        const accuracy = correctSequence / data.correctSteps.length;

        if (accuracy === 1) {
            score = 100;
            this.moHost.speak('Perfekt! Du hast die logische Reihenfolge für Chain-of-Thought komplett verstanden!');
        } else if (accuracy >= 0.75) {
            score = 80;
            this.moHost.speak('Sehr gut! Du verstehst die Grundlagen der schrittweisen Problemzerlegung.');
        } else if (accuracy >= 0.5) {
            score = 60;
            this.moHost.speak('Das ist ein guter Anfang. Denke an die logische Abfolge: Zielgruppe → Analyse → Themen → Umsetzung.');
        } else if (accuracy >= 0.25) {
            // Partial points for some correct steps
            score = Math.round(accuracy * 40);
            this.moHost.speak('Du hast einige Schritte richtig. Achte auf die logische Reihenfolge: Zielgruppe → Analyse → Themen → Umsetzung.');
        } else {
            // No points for completely wrong sequence
            score = 0;
            this.moHost.speak('Die Reihenfolge ist nicht korrekt. Nutze die Anleitung links - sie zeigt dir den logischen Aufbau!');
        }

        gameState.totalScore += score;
        gameState.techniqueStatuses.chainofthought = true;
        gameState.techniquesLearned++;

        // Wait for speech to finish, then celebrate and return to selection
        setTimeout(() => {
            this.moHost.celebrate();
            setTimeout(() => {
                this.showTechniqueSelection();
            }, 2000);
        }, 4000);

        this.updateUI();
    }

    // Tree of Thoughts Training
    initializeTreeOfThoughtsGame() {
        this.selectedThoughtNode = null;
        this.currentQuestionIndex = 0;
        this.questionsCompleted = 0;
        this.wrongAnswers = []; // Track wrong answers for explanation
        this.buildThoughtTree();
        this.moHost.speak('Tree of Thoughts erkundet verschiedene Ideen zu einer Frage. Finde und entferne die schlechten Ideen!');
    }

    buildThoughtTree() {
        const data = techniqueTrainingData.treeofthoughts;
        const currentQuestion = data.questions[this.currentQuestionIndex];

        // Update root question
        const rootNode = document.getElementById('rootNode');
        if (rootNode) {
            rootNode.innerHTML = `<p>${currentQuestion.question}</p>`;
            rootNode.addEventListener('click', (e) => {
                this.selectNode(e.currentTarget);
            });
        }

        const treeBranches = document.getElementById('treeBranches');
        treeBranches.innerHTML = '';

        // Create branches for current question
        const level1Div = document.createElement('div');
        level1Div.className = 'tree-level';

        currentQuestion.branches.forEach(branch => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = `thought-node ${branch.quality}`;
            nodeDiv.dataset.nodeId = branch.id;
            nodeDiv.innerHTML = `<p>${branch.text}</p>`;

            nodeDiv.addEventListener('click', (e) => {
                this.selectNode(e.currentTarget);
            });

            level1Div.appendChild(nodeDiv);
        });

        treeBranches.appendChild(level1Div);
    }

    selectNode(nodeElement) {
        // Deselect previous
        document.querySelectorAll('.thought-node.selected').forEach(node => {
            node.classList.remove('selected');
        });

        // Select new
        nodeElement.classList.add('selected');
        this.selectedThoughtNode = nodeElement;

        this.moHost.speak('Knoten ausgewählt! Klicke auf "Schlechten Ast entfernen" wenn dieser Knoten schlecht ist.');
    }

    pruneBadNode() {
        // Anti-cheat: Check if already completed
        if (gameState.techniqueStatuses.treeofthoughts) {
            this.moHost.speak('Du hast Tree of Thoughts bereits abgeschlossen! Wähle ein anderes Training.');
            return;
        }

        if (!this.selectedThoughtNode) {
            this.moHost.speak('Wähle zuerst einen Knoten aus, den du entfernen möchtest!');
            return;
        }

        const nodeId = this.selectedThoughtNode.dataset.nodeId;
        const data = techniqueTrainingData.treeofthoughts;
        const currentQuestion = data.questions[this.currentQuestionIndex];
        const badNodes = ['generic_prompts', 'natural_language', 'fast_results'];

        // Check if it's a bad node
        if (badNodes.includes(nodeId)) {
            // Correct! This is a bad node
            this.selectedThoughtNode.classList.add('pruned');
            this.selectedThoughtNode.style.opacity = '0.3';
            this.selectedThoughtNode.style.textDecoration = 'line-through';

            gameState.totalScore += 30;
            this.moHost.celebrate();

            const messages = {
                'generic_prompts': 'Richtig! Universelle Prompts funktionieren schlecht - jede Aufgabe braucht spezifische Anpassungen!',
                'natural_language': 'Richtig! Ohne Struktur entstehen inkonsistente und unvorhersagbare Ergebnisse!',
                'fast_results': 'Richtig! Geschwindigkeit allein ist kein Qualitätsindikator - oft das Gegenteil!'
            };

            this.moHost.speak(messages[nodeId]);
            this.questionsCompleted++;

            // Move to next question or complete
            setTimeout(() => {
                if (this.currentQuestionIndex < data.questions.length - 1) {
                    this.currentQuestionIndex++;
                    this.buildThoughtTree();
                    this.moHost.speak(`Frage ${this.currentQuestionIndex + 1}: Finde die schlechte Idee!`);
                } else {
                    this.completeTreeOfThoughts();
                }
            }, 3000);
        } else {
            // Wrong node selected - track for explanation and give feedback
            const wrongAnswer = {
                questionIndex: this.currentQuestionIndex,
                selectedNode: this.selectedThoughtNode.textContent.trim(),
                correctNodes: badNodes
            };
            this.wrongAnswers.push(wrongAnswer);

            this.moHost.speak('Das war die falsche Antwort! Du bekommst keine Punkte. Versuche es nochmal - finde die schlechte Option!');
        }

        this.selectedThoughtNode.classList.remove('selected');
        this.selectedThoughtNode = null;
        this.updateUI();
    }

    completeTreeOfThoughts() {
        gameState.techniqueStatuses.treeofthoughts = true;
        gameState.techniquesLearned++;

        const totalScore = this.questionsCompleted * 30;
        let completionMessage = `Tree of Thoughts abgeschlossen! Du hast ${this.questionsCompleted}/3 schlechte Ideen gefunden und verstehst jetzt, wie man Ideenbäume kritisch erkundet!`;

        this.moHost.speak(completionMessage);

        // Provide explanation if there were wrong answers, directly after completion message
        if (this.wrongAnswers.length > 0) {
            setTimeout(() => {
                let explanation = 'Hier die Verbesserungshinweise: ';
                this.wrongAnswers.forEach((wrong, index) => {
                    explanation += `Bei Frage ${wrong.questionIndex + 1} hast du "${wrong.selectedNode.substring(0, 30)}..." gewählt. `;
                });
                explanation += 'Achte darauf, Ideen zu identifizieren, die zu allgemein, unstrukturiert oder unrealistisch sind.';

                this.moHost.speak(explanation);

                // Return to selection after explanation
                setTimeout(() => {
                    this.showTechniqueSelection();
                }, 6000);
            }, 3000);
        } else {
            // No errors, return immediately
            setTimeout(() => {
                this.showTechniqueSelection();
            }, 3000);
        }

        this.updateUI();
    }



    // Phase 2: Critical Thinking (formerly Phase 3)
    startCriticalThinking() {
        gameState.currentPhase = 'critical';
        this.showPhase('criticalThinkingScreen');
        this.initializeCriticalChallenges();
        this.moHost.speak('Phase 2: Kritisches Denken! Lerne KI-Ergebnisse zu hinterfragen und Fallen zu erkennen.');
        this.updateUI();
    }

    initializeCriticalChallenges() {
        this.setupCriticalCardHandlers();
        this.setupBiasChallenge();
        this.setupPrivacyChallenge();
        this.setupFactsChallenge();
        this.showCriticalSelection();
    }

    setupCriticalCardHandlers() {
        const criticalCards = document.querySelectorAll('.critical-card[data-challenge]');
        criticalCards.forEach(card => {
            card.addEventListener('click', () => {
                const challenge = card.dataset.challenge;
                this.startCriticalChallenge(challenge);
            });
        });
    }

    showCriticalSelection() {
        // Hide all critical steps
        document.querySelectorAll('.critical-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show selection screen
        const criticalSelection = document.getElementById('criticalSelection');
        if (criticalSelection) {
            criticalSelection.classList.add('active');
        }

        // Show the critical header when on selection
        const criticalHeader = document.getElementById('criticalMainHeader');
        if (criticalHeader) {
            criticalHeader.style.display = 'block';
        }

        // Update card statuses
        this.updateCriticalCardStatuses();
    }

    updateCriticalCardStatuses() {
        // Update Bias status
        const biasStatus = document.getElementById('biasStatus');
        if (biasStatus) {
            if (gameState.criticalChallenges.bias) {
                biasStatus.textContent = 'Abgeschlossen';
                biasStatus.classList.add('completed');
            } else {
                biasStatus.textContent = 'Nicht abgeschlossen';
                biasStatus.classList.remove('completed');
            }
        }

        // Update Privacy status
        const privacyStatus = document.getElementById('privacyStatus');
        if (privacyStatus) {
            if (gameState.criticalChallenges.privacy) {
                privacyStatus.textContent = 'Abgeschlossen';
                privacyStatus.classList.add('completed');
            } else {
                privacyStatus.textContent = 'Nicht abgeschlossen';
                privacyStatus.classList.remove('completed');
            }
        }

        // Update Facts status
        const factsStatus = document.getElementById('factsStatus');
        if (factsStatus) {
            if (gameState.criticalChallenges.facts) {
                factsStatus.textContent = 'Abgeschlossen';
                factsStatus.classList.add('completed');
            } else {
                factsStatus.textContent = 'Nicht abgeschlossen';
                factsStatus.classList.remove('completed');
            }
        }

        // Update continue button
        const allCompleted = gameState.criticalChallenges.bias &&
                           gameState.criticalChallenges.privacy &&
                           gameState.criticalChallenges.facts;

        const continueBtn = document.getElementById('continueToPhase3');
        if (continueBtn) {
            continueBtn.disabled = !allCompleted;
        }
    }

    startCriticalChallenge(challenge) {
        // Check if challenge is already completed
        if (gameState.criticalChallenges[challenge]) {
            const challengeNames = {
                'bias': 'Bias-Detektiv',
                'privacy': 'Datenschutz-Check',
                'facts': 'Fact-Checker'
            };
            this.moHost.speak(`Du hast den ${challengeNames[challenge]} bereits abgeschlossen! Wähle eine andere Challenge.`);
            return;
        }

        gameState.currentCriticalChallenge = challenge;

        // Hide selection
        const criticalSelection = document.getElementById('criticalSelection');
        if (criticalSelection) {
            criticalSelection.classList.remove('active');
        }

        // Hide the critical header when in a challenge
        const criticalHeader = document.getElementById('criticalMainHeader');
        if (criticalHeader) {
            criticalHeader.style.display = 'none';
        }

        // Show specific challenge
        const challengeElement = document.getElementById(`${challenge}Challenge`);
        if (challengeElement) {
            challengeElement.classList.add('active');
        }

        // Initialize the specific challenge
        switch(challenge) {
            case 'bias':
                this.moHost.speak('Erkenne Vorurteile in AI-Antworten. Sei kritisch!');
                break;
            case 'privacy':
                this.moHost.speak('Entscheide weise: Welche Daten sind sicher zu teilen?');
                break;
            case 'facts':
                this.moHost.speak('Prüfe die Fakten! Nicht alles was AI sagt ist richtig.');
                break;
        }
    }

    setupBiasChallenge() {
        const data = criticalChallenges.bias;
        document.getElementById('biasExample').textContent = data.example;

        const optionsContainer = document.getElementById('biasOptions');
        optionsContainer.innerHTML = '';

        data.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-card';
            optionDiv.dataset.optionId = option.id;
            optionDiv.textContent = option.text;

            optionDiv.addEventListener('click', () => {
                document.querySelectorAll('#biasOptions .option-card').forEach(card => {
                    card.classList.remove('selected');
                });
                optionDiv.classList.add('selected');
            });

            optionsContainer.appendChild(optionDiv);
        });
    }

    setupPrivacyChallenge() {
        const data = criticalChallenges.privacy;
        const container = document.getElementById('dataExamples');
        container.innerHTML = '';

        data.examples.forEach((example, index) => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'data-sample';
            exampleDiv.innerHTML = `
                <div class="data-text">${example.text}</div>
                <div class="privacy-buttons" data-index="${index}">
                    <button class="privacy-btn safe-btn" data-action="safe">✓</button>
                    <button class="privacy-btn unsafe-btn" data-action="unsafe">✕</button>
                </div>
            `;

            const buttons = exampleDiv.querySelectorAll('.privacy-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active state from all buttons in this group
                    buttons.forEach(btn => btn.classList.remove('active'));
                    // Add active state to clicked button
                    button.classList.add('active');

                    // Store the choice
                    const buttonGroup = button.closest('.privacy-buttons');
                    buttonGroup.dataset.choice = button.dataset.action;
                });
            });

            container.appendChild(exampleDiv);
        });
    }

    setupFactsChallenge() {
        const data = criticalChallenges.facts;
        const container = document.getElementById('factExamples');
        container.innerHTML = '';

        data.claims.forEach((claim, index) => {
            const claimDiv = document.createElement('div');
            claimDiv.className = 'fact-claim';
            claimDiv.innerHTML = `
                <p>${claim.text}</p>
                <div class="fact-assessment">
                    <label>
                        <input type="radio" name="fact${index}" value="true"> Richtig
                    </label>
                    <label>
                        <input type="radio" name="fact${index}" value="false"> Falsch
                    </label>
                    <label>
                        <input type="radio" name="fact${index}" value="unknown"> Unbekannt
                    </label>
                </div>
            `;
            container.appendChild(claimDiv);
        });
    }

    submitBiasChallenge() {
        // Anti-cheat: Check if already completed
        if (gameState.criticalChallenges.bias) {
            this.moHost.speak('Du hast den Bias-Detektiv bereits abgeschlossen! Wähle eine andere Challenge.');
            return;
        }

        const selectedOption = document.querySelector('#biasOptions .option-card.selected');
        if (!selectedOption) {
            this.moHost.speak('Bitte wähle eine Option aus!');
            return;
        }

        const data = criticalChallenges.bias;
        const selectedId = selectedOption.dataset.optionId;
        const correct = data.options.find(opt => opt.id === selectedId && opt.correct);

        if (correct) {
            selectedOption.classList.add('correct');
            gameState.totalScore += 50;
            this.moHost.speak('Richtig! ' + data.explanation);
        } else {
            selectedOption.classList.add('incorrect');
            const correctOption = data.options.find(opt => opt.correct);
            document.querySelector(`[data-option-id="${correctOption.id}"]`).classList.add('correct');
            // No points for wrong answers
            this.moHost.speak('Falsch! ' + data.explanation);
        }

        gameState.criticalChallenges.bias = true; // Mark as completed regardless of correctness

        document.getElementById('submitBias').disabled = true;

        // Update status immediately
        this.updateCriticalCardStatuses();

        // Wait for speech to finish, then return to selection
        setTimeout(() => {
            this.showCriticalSelection();
        }, 4000);

        this.updateUI();
    }

    submitPrivacyChallenge() {
        // Anti-cheat: Check if already completed
        if (gameState.criticalChallenges.privacy) {
            this.moHost.speak('Du hast den Datenschutz-Check bereits abgeschlossen! Wähle eine andere Challenge.');
            return;
        }

        const data = criticalChallenges.privacy;
        const buttonGroups = document.querySelectorAll('.privacy-buttons');
        let correct = 0;

        buttonGroups.forEach((buttonGroup, index) => {
            const expected = data.examples[index].safe;
            const userChoice = buttonGroup.dataset.choice;

            // Check if user made correct choice
            const isCorrect = (expected && userChoice === 'safe') || (!expected && userChoice === 'unsafe');

            if (isCorrect) {
                correct++;
                buttonGroup.classList.add('correct');
            } else {
                buttonGroup.classList.add('incorrect');

                // Highlight the correct answer
                const correctBtn = expected ?
                    buttonGroup.querySelector('.safe-btn') :
                    buttonGroup.querySelector('.unsafe-btn');
                correctBtn.classList.add('correct-answer');
            }
        });

        // Partial scoring system
        const score = Math.round((correct / data.examples.length) * 50);
        gameState.totalScore += score;

        gameState.criticalChallenges.privacy = true; // Mark as completed regardless of score

        if (score >= 40) {
            this.moHost.speak('Sehr gut! Du verstehst Datenschutz-Grundlagen.');
        } else {
            this.moHost.speak('Das war ein Anfang. Merke: Nie persönliche oder sensible Daten teilen!');
        }

        document.getElementById('submitPrivacy').disabled = true;

        // Update status immediately
        this.updateCriticalCardStatuses();

        // Wait for speech to finish, then return to selection
        setTimeout(() => {
            this.showCriticalSelection();
        }, 4000);

        this.updateUI();
    }

    submitFactsChallenge() {
        // Anti-cheat: Check if already completed
        if (gameState.criticalChallenges.facts) {
            this.moHost.speak('Du hast den Fact-Checker bereits abgeschlossen! Wähle eine andere Challenge.');
            return;
        }

        const data = criticalChallenges.facts;
        let correct = 0;

        data.claims.forEach((claim, index) => {
            const selected = document.querySelector(`input[name="fact${index}"]:checked`);
            if (selected) {
                const isCorrect = (claim.correct && selected.value === 'true') ||
                                (!claim.correct && selected.value === 'false');
                if (isCorrect) correct++;
            }
        });

        // Partial scoring system
        const score = Math.round((correct / data.claims.length) * 50);
        gameState.totalScore += score;

        gameState.criticalChallenges.facts = true; // Mark as completed regardless of score

        if (score >= 40) {
            this.moHost.speak('Excellent! Du weißt wie man Fakten überprüft!');
        } else {
            this.moHost.speak('Denk daran: Immer mehrere Quellen prüfen und aktuell bleiben!');
        }

        document.getElementById('submitFacts').disabled = true;

        // Update status immediately
        this.updateCriticalCardStatuses();

        // Wait for speech to finish, then return to selection
        setTimeout(() => {
            this.showCriticalSelection();
        }, 4000);

        this.updateUI();
    }

    checkCriticalCompletion() {
        const allChallengesComplete = Object.values(gameState.criticalChallenges).every(status => status);
        document.getElementById('continueToPhase3').disabled = !allChallengesComplete;

        if (allChallengesComplete) {
            gameState.completedChallenges = 3;
            setTimeout(() => {
                this.moHost.speak('Alle Challenges abgeschlossen! Du denkst jetzt kritisch über KI-Ergebnisse nach.');
            }, 2000);
        }
    }

    // Phase 3: Master Challenge (formerly Phase 4)
    startMasterChallenge() {
        gameState.currentPhase = 'master';
        this.showPhase('masterChallengeScreen');
        this.startMasterQuiz();
        this.moHost.speak('Phase 3: Meister-Challenge! Beantworte Fragen zu den erlernten Techniken!');
        this.updateUI();
    }

    showScenarioSelection() {
        // Phase 3 only has quiz now, so this function is not needed
        // But keeping it for compatibility
    }

    startMasterQuiz() {
        gameState.currentQuizQuestion = 0;
        gameState.quizAnswers = [];
        gameState.quizScore = 0;

        // Simply show the quiz (since it's the only content in Phase 3 now)
        this.loadQuizQuestion();
        this.moHost.speak('Zeit für den Abschluss-Quiz! Zeige was du über Advanced Prompting gelernt hast!');
    }

    loadQuizQuestion() {
        const question = quizQuestions[gameState.currentQuizQuestion];

        document.getElementById('quizTitle').textContent = `Frage ${gameState.currentQuizQuestion + 1}/${quizQuestions.length}`;
        document.getElementById('questionText').textContent = question.question;

        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.dataset.letter = option.letter;
            optionDiv.innerHTML = `
                <span class="option-letter">${option.letter}</span>
                <span class="option-text">${option.text}</span>
            `;

            optionDiv.addEventListener('click', () => {
                document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                optionDiv.classList.add('selected');

                // Enable submit button when an option is selected
                const submitBtn = document.getElementById('submitQuizAnswer');
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            });

            optionsContainer.appendChild(optionDiv);
        });

        // Update progress
        const progress = ((gameState.currentQuizQuestion + 1) / quizQuestions.length) * 100;
        document.getElementById('quizProgress').style.width = `${progress}%`;

        // Show/hide buttons and reset submit button state
        const submitBtn = document.getElementById('submitQuizAnswer');
        submitBtn.style.display = 'block';
        submitBtn.disabled = true; // Disable until option is selected
        document.getElementById('nextQuizQuestion').style.display = 'none';

        // Hide explanation/feedback
        const explanationElement = document.getElementById('quizExplanation') || document.getElementById('quizFeedback');
        if (explanationElement) {
            explanationElement.style.display = 'none';
        }
    }

    submitQuizAnswer() {
        const selectedOption = document.querySelector('.quiz-option.selected');
        if (!selectedOption) {
            this.moHost.speak('Bitte wähle eine Antwort aus!');
            return;
        }

        const question = quizQuestions[gameState.currentQuizQuestion];
        const selectedLetter = selectedOption.dataset.letter;
        const correctOption = question.options.find(opt => opt.correct);
        const isCorrect = selectedLetter === correctOption.letter;

        // Store answer
        gameState.quizAnswers.push({
            questionId: question.id,
            selected: selectedLetter,
            correct: isCorrect
        });

        if (isCorrect) {
            selectedOption.classList.add('correct');
            gameState.quizScore += 20;
            this.moHost.speak('Richtig!');
        } else {
            selectedOption.classList.add('incorrect');
            const correctOptionElement = document.querySelector(`[data-letter="${correctOption.letter}"]`);
            correctOptionElement.classList.add('correct');
            this.moHost.speak('Nicht ganz richtig.');
        }

        // Show explanation
        const explanationElement = document.getElementById('quizExplanation') || document.getElementById('quizFeedback');
        if (explanationElement) {
            explanationElement.innerHTML = `
                <h4>Feedback:</h4>
                <p><strong>Erklärung:</strong> ${question.explanation}</p>
            `;
            explanationElement.style.display = 'block';
        }

        // Update buttons
        document.getElementById('submitQuizAnswer').style.display = 'none';

        if (gameState.currentQuizQuestion < quizQuestions.length - 1) {
            document.getElementById('nextQuizQuestion').style.display = 'block';
        } else {
            // Quiz complete
            setTimeout(() => {
                this.completeQuiz();
            }, 3000);
        }
    }

    nextQuizQuestion() {
        gameState.currentQuizQuestion++;
        this.loadQuizQuestion();
    }

    completeQuiz() {
        gameState.totalScore += gameState.quizScore;

        // Update UI immediately after adding quiz score
        this.updateUI();

        const percentage = (gameState.quizScore / (quizQuestions.length * 20)) * 100;
        let message = '';

        if (percentage >= 80) {
            message = `Ausgezeichnet! ${gameState.quizScore}/${quizQuestions.length * 20} Punkte - Du bist ein wahrer Prompting-Experte!`;
        } else if (percentage >= 60) {
            message = `Gut gemacht! ${gameState.quizScore}/${quizQuestions.length * 20} Punkte - Du verstehst die Grundlagen sehr gut.`;
        } else {
            message = `Das war ein guter Anfang! ${gameState.quizScore}/${quizQuestions.length * 20} Punkte - Übung macht den Meister.`;
        }

        this.moHost.celebrate();
        this.moHost.speak(message);

        setTimeout(() => {
            this.completeWorkshop();
        }, 4000);
    }

    startMasterScenario(scenario) {
        // Phase 3 is now quiz-only, so always start the quiz
        this.startMasterQuiz();
    }

    insertTechniqueTool(toolType) {
        const promptArea = document.getElementById('masterPrompt');
        const currentText = promptArea.value;

        let template = '';
        switch(toolType) {
            case 'fewshot':
                template = '\n\nBeispiele:\n1. [Beispiel 1]\n2. [Beispiel 2]\n3. [Beispiel 3]\n\n';
                break;
            case 'chainofthought':
                template = '\n\nSchritt-für-Schritt:\n1. [Erster Schritt]\n2. [Zweiter Schritt]\n3. [Dritter Schritt]\n\n';
                break;
            case 'treeofthoughts':
                template = '\n\nDenkoptionen erkunden:\nOption A: [Erste Richtung]\nOption B: [Alternative Richtung]\nBewertung: [Beste Option wählen]\n\n';
                break;
            case 'react':
                template = '\n\nReAct-Zyklus:\nDenken: [Was ist das Ziel?]\nHandeln: [Welche Schritte sind nötig?]\nBeobachten: [Ergebnisse bewerten]\n\n';
                break;
        }

        promptArea.value = currentText + template;
        this.analyzeMasterPrompt();

        this.moHost.speak(`${toolType.charAt(0).toUpperCase() + toolType.slice(1)}-Template eingefügt!`);
    }

    analyzeMasterPrompt() {
        const promptText = document.getElementById('masterPrompt').value;

        const analysis = {
            clarity: this.analyzeClarity(promptText),
            structure: this.analyzeStructure(promptText),
            techniques: this.analyzeTechniques(promptText),
            context: this.analyzeContext(promptText)
        };

        // Update visual feedback
        Object.keys(analysis).forEach(metric => {
            const fillElement = document.querySelector(`[data-metric="${metric}"]`);
            if (fillElement) {
                fillElement.style.width = `${analysis[metric]}%`;
            }
        });
    }

    analyzeClarity(text) {
        let score = 0;

        if (text.length > 100) score += 25;
        if (text.includes('?')) score += 15;
        if (text.toLowerCase().includes('ziel') || text.toLowerCase().includes('zweck')) score += 20;
        if (text.toLowerCase().includes('format') || text.toLowerCase().includes('länge')) score += 20;
        if (text.toLowerCase().includes('zielgruppe') || text.toLowerCase().includes('für')) score += 20;

        return Math.min(100, score);
    }

    analyzeStructure(text) {
        let score = 0;

        if (text.includes('1.') || text.includes('1)')) score += 30;
        if (text.includes('\n')) score += 20;
        if (text.includes(':')) score += 15;
        if (text.includes('-') || text.includes('•')) score += 15;
        if (text.split('\n').length >= 5) score += 20;

        return Math.min(100, score);
    }

    analyzeTechniques(text) {
        let score = 0;

        if (text.toLowerCase().includes('beispiel')) score += 25;
        if (text.toLowerCase().includes('schritt')) score += 25;
        if (text.toLowerCase().includes('option') || text.toLowerCase().includes('alternativ')) score += 25;
        if (text.toLowerCase().includes('denken') || text.toLowerCase().includes('handeln')) score += 25;

        return Math.min(100, score);
    }

    analyzeContext(text) {
        let score = 0;

        if (text.length > 200) score += 20;
        if (text.toLowerCase().includes('kontext') || text.toLowerCase().includes('hintergrund')) score += 30;
        if (text.toLowerCase().includes('wichtig') || text.toLowerCase().includes('beachten')) score += 25;
        if (text.toLowerCase().includes('rolle') || text.toLowerCase().includes('perspektiv')) score += 25;

        return Math.min(100, score);
    }

    resetPromptAnalysis() {
        document.querySelectorAll('.feedback-fill').forEach(fill => {
            fill.style.width = '0%';
        });
    }

    testMasterPrompt() {
        const promptText = document.getElementById('masterPrompt').value.trim();
        if (!promptText) {
            this.moHost.speak('Bitte erstelle erst einen Prompt!');
            return;
        }

        // Simulate AI processing and provide feedback
        const analysis = {
            clarity: this.analyzeClarity(promptText),
            structure: this.analyzeStructure(promptText),
            techniques: this.analyzeTechniques(promptText),
            context: this.analyzeContext(promptText)
        };

        const avgScore = Object.values(analysis).reduce((a, b) => a + b) / 4;

        let feedback = '';
        if (avgScore >= 80) {
            feedback = 'Exzellenter Prompt! Alle Kriterien erfüllt - klar strukturiert, technisch fundiert und kontextreich.';
        } else if (avgScore >= 60) {
            feedback = 'Guter Prompt! Noch ein paar Verbesserungen möglich bei Struktur oder Techniken.';
        } else {
            feedback = 'Der Prompt braucht noch Arbeit. Verwende mehr Techniken und strukturiere klarer.';
        }

        this.moHost.speak(feedback);
    }

    submitMasterChallenge() {
        const promptText = document.getElementById('masterPrompt').value.trim();
        if (!promptText) {
            this.moHost.speak('Bitte erstelle erst einen Prompt!');
            return;
        }

        const analysis = {
            clarity: this.analyzeClarity(promptText),
            structure: this.analyzeStructure(promptText),
            techniques: this.analyzeTechniques(promptText),
            context: this.analyzeContext(promptText)
        };

        const avgScore = Object.values(analysis).reduce((a, b) => a + b) / 4;
        const earnedScore = Math.round(avgScore * 2); // Max 200 points

        gameState.totalScore += earnedScore;
        gameState.masterChallenges[this.currentMasterScenario] = true;

        this.moHost.celebrate();
        this.moHost.speak(`Challenge abgeschlossen! +${earnedScore} Punkte für deinen Meister-Prompt!`);

        setTimeout(() => {
            const allChallengesComplete = Object.values(gameState.masterChallenges).filter(Boolean).length >= 1;
            if (allChallengesComplete) {
                this.completeWorkshop();
            } else {
                this.showScenarioSelection();
            }
        }, 3000);

        this.updateUI();
    }

    completeWorkshop() {
        gameState.currentPhase = 'complete';
        this.calculateFinalRank();
        this.saveProgress();
        this.showVictoryScreen();
    }

    calculateFinalRank() {
        // Calculate current rank based on new scoring system
        let currentRank = '';
        let currentDescription = '';

        if (gameState.totalScore >= 500) {
            currentRank = 'Gold 🥇';
            currentDescription = 'Prompt-Engineering Experte';
        } else if (gameState.totalScore >= 400) {
            currentRank = 'Silber 🥈';
            currentDescription = 'Advanced Prompting Spezialist';
        } else if (gameState.totalScore >= 250) {
            currentRank = 'Bronze 🥉';
            currentDescription = 'Prompting Praktiker';
        } else {
            currentRank = 'Kein Rang';
            currentDescription = 'Weiter üben - du schaffst das!';
        }

        // Special case: If current score is under 250, always show "Kein Rang"
        if (gameState.totalScore < 250) {
            gameState.finalRank = 'Kein Rang';
            gameState.rankDescription = 'Weiter üben - du schaffst das!';
        } else {
            // Keep the best rank ever achieved (never downgrade) - only for scores 250+
            const currentRankValue = this.getRankValue(currentRank);
            const bestRankValue = this.getRankValue(gameState.bestRank || '');

            if (currentRankValue > bestRankValue) {
                gameState.bestRank = currentRank;
                gameState.bestRankDescription = currentDescription;
            }

            // Use best rank for display
            gameState.finalRank = gameState.bestRank || currentRank;
            gameState.rankDescription = gameState.bestRankDescription || currentDescription;
        }
    }

    getRankValue(rank) {
        // Convert rank to numeric value for comparison
        if (rank.includes('Gold')) return 3;
        if (rank.includes('Silber')) return 2;
        if (rank.includes('Bronze')) return 1;
        if (rank.includes('Kein Rang')) return 0;
        return 0;
    }

    saveProgress() {
        const level3Progress = {
            completed: true,
            rank: gameState.finalRank,
            bestRank: gameState.bestRank,
            bestRankDescription: gameState.bestRankDescription,
            score: gameState.totalScore,
            techniquesLearned: gameState.techniquesLearned,
            completedAt: Date.now()
        };

        localStorage.setItem('aiBytes_level3_progress', JSON.stringify(level3Progress));
    }

    showVictoryScreen() {
        this.showPhase('victoryScreen');

        document.getElementById('finalRank').textContent = gameState.finalRank;
        document.getElementById('rankDescription').textContent = gameState.rankDescription;
        document.getElementById('finalScore').textContent = `${gameState.totalScore}/540`;

        this.moHost.speak('Herzlichen Glückwunsch! Du bist jetzt ein Advanced Prompting Experte!');
    }


    restartWorkshop() {
        // Preserve best rank before reset
        const bestRank = gameState.bestRank;
        const bestRankDescription = gameState.bestRankDescription;

        // Reset game state
        Object.assign(gameState, {
            currentPhase: 'intro',
            currentSubGame: null,
            totalScore: 0,
            techniquesLearned: 0,
            completedChallenges: 0,
            techniqueStatuses: {
                fewshot: false,
                chainofthought: false,
                treeofthoughts: false
            },
            criticalChallenges: {
                bias: false,
                privacy: false,
                facts: false
            },
            masterChallenges: {
                business: false,
                creative: false,
                technical: false
            },
            bestRank: bestRank, // Keep best rank
            bestRankDescription: bestRankDescription // Keep best rank description
        });

        this.showPhase('introScreen');
        this.updateUI();
        this.moHost.speak('Zurück zur Prompt-Werkstatt! Bereit für eine neue Lernrunde?');
    }
}

// Initialize Game
let advancedPromptingWorkshop;

document.addEventListener('DOMContentLoaded', () => {
    // Load saved background from main menu
    if (typeof loadSavedBackground === 'function') {
        loadSavedBackground();
    }

    advancedPromptingWorkshop = new AdvancedPromptingWorkshop();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (advancedPromptingWorkshop && advancedPromptingWorkshop.moHost) {
        advancedPromptingWorkshop.moHost.destroy();
    }
});