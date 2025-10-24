// Level 1 Game Logic

// Mo Man Animation System (Enhanced from Level 3)
class MoManHost {
    constructor() {
        this.element = document.getElementById('moHost');
        this.img = this.element.querySelector('.mo-host-img');
        this.speechBubble = document.getElementById('moSpeech');
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

        // Interactive features
        this.autoSpeechTimer = null;
        this.autoSpeechInterval = 14000; // 14 seconds
        this.lastAutoSpeechTime = Date.now();
        this.consecutiveCorrect = 0;
        this.totalAttempts = 0;
        this.hasSpokenRecently = false;

        this.startIdleAnimation();
        this.setupUnderstoodButton();
        this.startAutoSpeech();
    }

    startIdleAnimation() {
        this.stopAnimation();
        this.isIdle = true;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo_man_Stand_Pose/Mo man Stand Pose_${frameNumber}.png`;
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
        this.hasSpokenRecently = true;
        this.lastAutoSpeechTime = Date.now();

        // Start typewriter effect
        this.startTypewriter();

        // Auto-hide after text is complete + buffer time (unless in persistent mode)
        if (!persistentMode) {
            const totalDuration = (text.length * this.typewriterSpeed) + 4000; // 4 seconds instead of 2
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(() => {
                this.stopSpeaking();
                this.hasSpokenRecently = false;
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

    startSpeechAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.speechFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Moman_speech_animation/Moman Rede_${frameNumber}.png`;
        }, this.speechAnimationSpeed);
    }

    startCelebrationAnimation() {
        this.stopAnimation();
        this.isIdle = false;

        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.celebrationFrames;
            const frameNumber = String(this.currentFrame).padStart(5, '0');
            this.img.src = `Mo_man_Stand_Pose/Mo man Stand Pose_${frameNumber}.png`;
        }, this.animationSpeed);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.currentFrame = 0;
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

    // Auto-speech system for personality and engagement
    startAutoSpeech() {
        this.autoSpeechTimer = setInterval(() => {
            // Only speak if not already speaking and enough time has passed
            if (!this.hasSpokenRecently && !this.speechBubble.classList.contains('visible')) {
                this.speakRandomComment();
            }
        }, this.autoSpeechInterval);
    }

    speakRandomComment() {
        const comments = this.getContextualComments();
        if (comments.length > 0) {
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            this.speak(randomComment);
        }
    }

    getContextualComments() {
        const allComments = [
            // Storytelling & Personality
            "Weißt du, ich hab mal versucht ChatGPT zu fragen 'Mach was Cooles' - das Ergebnis war... interessant! 😅",
            "Meine Oma fragt mich immer: 'Wie redest du denn mit diesen Computern?' Genau das lernst du hier! 👵",
            "Fun Fact: Die ersten AI-Prompts waren nur 'Ja' oder 'Nein'. Wir sind schon weiter gekommen! 🤖",
            "Ich erinnere mich noch an meinen ersten richtig guten Prompt... das war wie Magie! ✨",
            "Zwischen uns: Auch ich mache manchmal noch Prompt-Fehler. Übung macht den Meister! 😊",

            // Encouragement & Tips
            "Pssst... Das Geheimnis guter Prompts? Sei spezifisch, aber nicht übertrieben! 🎯",
            "Tipp von Mo: Denk daran, WEM du schreibst - AI ist wie ein sehr schlauer, aber manchmal verwirrter Freund! 🤔",
            "Du machst das schon richtig! Jeder Prompt-Experte hat mal klein angefangen 💪",
            "Falls du mal nicht weiterweißt: Beschreib die Situation, als würdest du sie einem Freund erklären! 👥",

            // Gamification based on progress
            ...this.getScoreBasedComments(),
            ...this.getStreakComments(),

            // Jokes & Light moments
            "Warum sind gute Prompts wie Pizza? Beide brauchen die richtigen Zutaten! 🍕",
            "AI-Prompting ist wie Kochen: Zu wenig ist langweilig, zu viel ist chaos! 👨‍🍳",
            "Ich sammle schlechte Prompts wie andere Briefmarken. Meine Sammlung ist... beeindruckend! 📮",
            "Manchmal denke ich, AI versteht mich besser als meine Kollegen... ist das normal? 🤪",
        ];

        return allComments;
    }

    getScoreBasedComments() {
        if (totalScore === 0) {
            return [
                "Bereit für dein erstes Prompt-Abenteuer? Los geht's! 🚀",
                "Keine Sorge wenn am Anfang nicht alles perfekt ist - das ist völlig normal! 😌"
            ];
        } else if (totalScore >= 30) {
            return [
                `Wow! ${totalScore} Punkte schon! Du wirst echt gut in dem hier! 🌟`,
                "Du entwickelst ein echtes Gespür für gute Prompts! Weiter so! 🎯"
            ];
        } else if (totalScore >= 15) {
            return [
                `${totalScore} Punkte! Du bist auf dem richtigen Weg! 📈`,
                "Ich sehe schon Fortschritte! Das macht richtig Spaß zu beobachten! 😊"
            ];
        }
        return [];
    }

    getStreakComments() {
        if (this.consecutiveCorrect >= 3) {
            return [
                `${this.consecutiveCorrect} richtige in Folge! Du bist on fire! 🔥`,
                "Das ist eine beeindruckende Serie! Bist du sicher, dass du Anfänger bist? 😎"
            ];
        } else if (this.consecutiveCorrect >= 2) {
            return [
                "Zwei richtige hintereinander! Du kriegst den Dreh raus! 💫"
            ];
        }
        return [];
    }

    // Call this when user gets an answer right/wrong
    updateStats(correct) {
        this.totalAttempts++;
        if (correct) {
            this.consecutiveCorrect++;
        } else {
            this.consecutiveCorrect = 0;
        }
    }

    // Special reactions for specific moments
    celebrateCorrectAnswer() {
        this.celebrate();
        this.updateStats(true);

        const celebrations = [
            "Genau! Das war ein richtig guter Prompt! 🎉",
            "Perfekt! Du verstehst das Prinzip! ⭐",
            "Wow, das hätte ich auch nicht besser machen können! 👏",
            "Das ist ein Prompt wie er im Bilderbuch steht! 📚",
            "Siehst du? Du hast das Zeug zum Prompt-Profi! 🏆"
        ];

        const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        this.speak(randomCelebration);
    }

    encourageAfterWrongAnswer() {
        this.updateStats(false);

        const encouragements = [
            "Kein Problem! Aus Fehlern lernt man am besten! 💪",
            "Das passiert den Besten! Lass uns schauen warum... 🤔",
            "Hmm, nicht ganz. Aber du bist nah dran! Weiter so! 🎯",
            "Das war ein guter Versuch! Gleich klappt's bestimmt! 😊",
            "Auch ich hab mal so angefangen. Das wird schon! 🌱"
        ];

        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.speak(randomEncouragement);
    }

    destroy() {
        this.stopAnimation();
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        if (this.autoSpeechTimer) {
            clearInterval(this.autoSpeechTimer);
        }
    }
}

let currentChallenge = 0;
let totalScore = 0;
let gameState = 'intro'; // intro, challenge, results, completion
let moHost; // Global MoMan instance

// Tutorial Data - One comprehensive intro tutorial
const tutorials = [
    {
        id: 1,
        title: "📚 Prompting-Grundlagen",
        concept: "Die 3 goldenen Regeln für bessere AI-Prompts",
        examples: [
            {
                situation: "🎂 Geburtstagsparty: Kuchen-Rezept für 10 Personen",
                badPrompt: "Gib mir ein Rezept",
                whyBad: "Viel zu vage - welcher Kuchen? Für wie viele?",
                goodPrompt: "Schokoladenkuchen-Rezept für 10 Personen, einfach und schnell",
                whyGood: "Spezifisch: Art, Anzahl, Schwierigkeit definiert."
            },
            {
                situation: "📱 Social Media Post für Restaurant",
                badPrompt: "Du bist ein weltführender Social Media Marketing Guru mit 20 Jahren Erfahrung...",
                whyBad: "Übertrieben! Einfacher Post braucht keinen 'Guru'.",
                goodPrompt: "Instagram-Post: Heute regnet es, wir haben warmen Apfelkuchen. Mach es gemütlich.",
                whyGood: "Situativ, authentisch, direkt verwendbar."
            },
        ],
        principle: "Die drei goldenen Regeln: Situation klar definieren • Angemessene Komplexität • Konkretes Ziel"
    }
];

// Challenge Data - 5 realistic everyday scenarios
const challenges = [
    {
        id: 1,
        title: "Challenge 1: Instagram-Post Dilemma",
        description: "Dein Café-Freund braucht schnell einen Instagram-Post. Heute regnet es und er hat frischen Apfelkuchen. Welcher Prompt funktioniert am besten?",
        scenario: "📱 5 Minuten bis zur Story - Post muss jetzt online!",
        prompts: [
            {
                text: "Social Media Post",
                quality: "poor",
                score: 0,
                response: "Social Media Post für heute:\n\nHallo! Wir haben heute geöffnet und freuen uns auf euch.\n\n*[Viel zu allgemein und langweilig]*",
                explanation: "Viel zu vage! 'Social Media Post' sagt der AI nicht, WAS gepostet werden soll. Kontext macht den Unterschied!"
            },
            {
                text: "Du bist ein Social Media Marketing Guru mit PhD in Consumer Psychology und 20 Jahren Erfahrung bei Fortune 500 Unternehmen. Erstelle einen viralen, psychologisch optimierten Instagram-Post mit emotionalen Triggern, Engagement-Hacks und Community-Building-Strategien für maximale Reichweite für ein kleines lokales Café.",
                quality: "poor",
                score: 0,
                response: "Als zertifizierter Digital Marketing Expert analysiere ich zunächst die Multi-Channel-Customer-Journey-Touchpoints...\n\n**VIRALER CONTENT-STRATEGY FRAMEWORK:**\n📊 Neuro-Marketing Approach\n🧠 Psychological Engagement Matrix\n📈 Viral Coefficient Optimization\n\n**FINALER POST:**\n'☕ Erlebe die ultimative Coffee-Experience mit wissenschaftlich optimierten Flavor-Profiles...'\n\n*[Völlig übertrieben für einen schnellen Post]*",
                explanation: "Maßlos übertrieben! Ein schneller Instagram-Post braucht keinen 'PhD in Consumer Psychology'. Einfach ist oft besser!"
            },
            {
                text: "Instagram-Post für unser Café: Heute regnet es, wir haben frischen Apfelkuchen. Mach es gemütlich und einladend.",
                quality: "excellent",
                score: 10,
                response: "🍂☔ Perfektes Regenwetter für einen warmen Kaffee und ein Stück von unserem frisch gebackenen Apfelkuchen! \n\nWenn draußen die Tropfen tanzen, machen wir es drinnen extra gemütlich. Kommt vorbei und lasst euch verwöhnen! ☕🥧\n\n#RegenwetterGenuss #FrischerApfelkuchen #GemütlicheAtmosphäre #Café\n\n*[Perfekt: Situativ, authentisch, einladend]*",
                explanation: "Bingo! Du hast es verstanden: Konkrete Situation + klares Ziel = authentischer Post. Social Media lebt von echten Momenten, nicht von Marketing-Strategien!"
            }
        ],
        hint: "Bei Social Media zählt Authentizität! Beschreibe die AKTUELLE Situation - das wirkt viel echter als künstliche Expertise."
    },
    {
        id: 2,
        title: "Challenge 2: WhatsApp-Nachricht Chaos",
        description: "Du willst deiner Oma (78) erklären, wie sie Fotos in WhatsApp verschicken kann. Sie ist nervös und hat wenig Technik-Erfahrung.",
        scenario: "📱 Oma wartet am Telefon - Erklärung muss sofort verständlich sein!",
        prompts: [
            {
                text: "Erkläre WhatsApp Foto-Funktion",
                quality: "poor",
                score: 0,
                response: "Um Fotos in WhatsApp zu senden, nutzen Sie die Kamera-Funktion der App und wählen dann die gewünschten Bilder aus der Galerie aus.\n\n*[Viel zu technisch und unverständlich für Oma]*",
                explanation: "Ups! Dieser Prompt war zu allgemein. Oma braucht einfache Sprache und kleine Schritte, nicht technische Begriffe!"
            },
            {
                text: "Du bist ein Senior Digital Consultant mit Expertise in Senior-friendly User Experience Design und 15 Jahren Erfahrung in generationenübergreifender Technologie-Vermittlung. Erstelle eine vollständige, barrierefreie Schritt-für-Schritt-Anleitung mit psychologischen Beruhigungsstrategien für eine 78-jährige Dame...",
                quality: "poor",
                score: 0,
                response: "Als Senior Technology Consultant analysiere ich zunächst die kognitiven Barrieren und entwickle eine altersgerechte Benutzerführung...\n\n**SENIOR-OPTIMIERTE DIGITAL LITERACY STRATEGIE:**\n- Phase 1: Technologie-Angst-Reduktion\n- Phase 2: Motorik-Anpassung\n- Phase 3: Interface-Familiarisierung\n\n*[Oma ist nach 10 Sekunden völlig verwirrt und legt auf]*",
                explanation: "Viel zu übertrieben! Ein einfacher WhatsApp-Tipp braucht keinen 'Senior Digital Consultant'. Weniger ist manchmal mehr!"
            },
            {
                text: "Erkläre einer 78-jährigen Oma in ganz einfachen Schritten, wie sie ein Foto per WhatsApp schickt. Beruhigend und geduldig, als würdest du neben ihr stehen.",
                quality: "excellent",
                score: 10,
                response: "**Fotos schicken - ganz einfach, liebe Oma!**\n\n**Schritt 1:** WhatsApp öffnen (das grüne Symbol mit dem Telefon)\n**Schritt 2:** Den Namen antippen, dem du das Foto schicken willst\n**Schritt 3:** Das kleine Kamera-Symbol unten drücken\n**Schritt 4:** 'Kamera' oder 'Galerie' wählen (Galerie = schon gemachte Fotos)\n**Schritt 5:** Foto auswählen und auf den blauen Pfeil drücken\n\n**Fertig!** Das war's schon. Du schaffst das! ❤️\n\n*[Perfekt: Einfach, beruhigend, Schritt-für-Schritt]*",
                explanation: "Perfekt! Du hast verstanden: Der beste Prompt passt sich der PERSON an. Oma braucht Geduld und einfache Worte, keine Technologie-Expertise. Empathie schlägt Fachwissen!"
            }
        ],
        hint: "Bei älteren Menschen: Einfache Sprache, kleine Schritte, viel Ermutigung! Vergiss die Fachbegriffe."
    },
    {
        id: 3,
        title: "Challenge 3: Bewerbungs-Stress",
        description: "Dein Freund Max (26) bewirbt sich als Grafikdesigner. Er hat 3 Jahre Berufserfahrung, kann Photoshop/Illustrator und hat das Rebranding einer lokalen Bäckerei gemacht. Sein Anschreiben ist langweilig. Wie hilfst du ihm?",
        scenario: "🕐 Bewerbungsfrist läuft morgen ab - muss heute fertig werden!",
        prompts: [
            {
                text: "Verbessere mein Anschreiben",
                quality: "poor",
                score: 0,
                response: "Hier sind einige Verbesserungsvorschläge für Ihr Anschreiben:\n\n- Verwenden Sie aktivere Sprache\n- Fügen Sie mehr Details hinzu\n- Strukturieren Sie den Text besser\n- Korrigieren Sie Rechtschreibfehler\n\n*[Viel zu allgemein - was soll konkret verbessert werden?]*",
                explanation: "Zu vage! 'Verbessere mein Anschreiben' ist wie 'Mach es besser' - die AI weiß nicht, WAS verbessert werden soll. Kontext ist King!"
            },
            {
                text: "Du bist ein zertifizierter HR-Experte mit 25 Jahren Erfahrung in Executive Recruiting, spezialisiert auf Creative Industries, mit Expertise in modernen Bewerbungsstrategien, ATS-Optimierung, Personal Branding, Karriere-Coaching und psychologischer Candidate Assessment. Analysiere das Anschreiben meines Freundes für eine Grafikdesigner-Position und optimiere es nach neuesten HR-Trends. Er hat 3 Jahre Erfahrung, kann Photoshop/Illustrator und hat das Rebranding einer lokalen Bäckerei gemacht.",
                quality: "excellent",
                score: 10,
                response: "**Überarbeitetes Anschreiben - Grafikdesigner:**\n\nSehr geehrte Damen und Herren,\n\nDesign ist für mich mehr als schöne Bilder – es löst Probleme. Als ich letztes Jahr das Rebranding für die lokale Bäckerei Schmidt entwickelte, stieg deren Umsatz um 30%. Das war der Moment, wo ich wusste: Gutes Design verändert wirklich etwas.\n\nMeine 3-jährige Berufserfahrung mit Photoshop und Illustrator ermöglicht es mir, vielseitige Lösungen zu entwickeln. Von Plakat-Kampagnen bis zu digitalen Web-Experiences – ich denke immer daran, wie Menschen mit Design interagieren.\n\nIhre Stellenausschreibung hat mich sofort angesprochen, weil Sie nach jemandem suchen, der 'über den Tellerrand blickt'. Genau das mache ich: Ich verbinde kreative Vision mit strategischem Denken.\n\nIch würde gerne zeigen, wie meine Erfahrung und Leidenschaft Ihr Team bereichern kann.\n\nMit freundlichen Grüßen\nMax\n\n*[Perfekt: Konkret, authentisch, zeigt Erfahrung und Erfolge]*",
                explanation: "Exzellent! Du hast verstanden: Gib der AI eine Expertenrolle und alle wichtigen Details. Spezifische Verbesserungsanweisungen führen zu viel besseren Ergebnissen!"
            },
            {
                text: "Überarbeite das Anschreiben für die Grafikdesigner-Stelle. Mach es persönlicher und weniger langweilig.",
                quality: "good",
                score: 3,
                response: "**Überarbeitetes Anschreiben:**\n\nSehr geehrte Damen und Herren,\n\nich interessiere mich sehr für Ihre Grafikdesigner-Position. Design ist meine große Leidenschaft und ich bringe viel Kreativität mit.\n\nIn meiner bisherigen Berufslaufbahn konnte ich bereits verschiedene Projekte erfolgreich umsetzen. Dabei habe ich gelernt, kundenorientiert zu arbeiten und Deadlines einzuhalten.\n\nIch würde mich freuen, meine Fähigkeiten in Ihrem Team einzusetzen und freue mich auf ein persönliches Gespräch.\n\nMit freundlichen Grüßen\n[Name]\n\n*[Etwas persönlicher, aber immer noch zu allgemein und ohne konkrete Beispiele]*",
                explanation: "Gut, aber nicht optimal! Du warst auf dem richtigen Weg mit 'persönlicher', aber die AI brauchte mehr Details über Max und seine Projekte."
            },
        ],
        hint: "Bei Bewerbungen: Sei spezifisch über WER dir helfen soll! Wen würdest du um Rat fragen - einen Freund oder einen Experten?"
    },
    {
        id: 4,
        title: "Challenge 4: Kochrezept-Katastrophe",
        description: "Du willst zum ersten Mal Pfannkuchen machen, aber hast wenig Küchen-Erfahrung. Welcher Prompt hilft dir wirklich?",
        scenario: "🥞 Sonntag-Morgen, Familie wartet aufs Frühstück!",
        prompts: [
            {
                text: "Pfannkuchen-Rezept für Anfänger, einfach und schnell für 4 Personen",
                quality: "good",
                score: 3,
                response: "**Einfache Pfannkuchen für 4 Personen:**\n\n**Zutaten:**\n- 200g Mehl\n- 2 Eier\n- 400ml Milch\n- 1 Prise Salz\n- 2 EL Zucker\n- Butter zum Braten\n\n**Zubereitung:**\n1. Alle Zutaten verrühren bis glatt\n2. Teig 10 Min ruhen lassen\n3. Butter in der Pfanne erhitzen\n4. Eine Kelle Teig in die Pfanne, von beiden Seiten goldbraun braten\n\n*[Gut - aber fehlen noch Tipps für Anfänger]*",
                explanation: "Okay, aber nicht perfekt! Du warst auf dem richtigen Weg, aber Anfänger brauchen mehr Hilfe - erkläre es, als hättest du noch nie gekocht!"
            },
            {
                text: "Du bist ein Michelin-Stern Koch mit 30 Jahren Erfahrung in der französischen Haute Cuisine und Spezialist für Crêpes-Techniken. Erstelle ein professionelles Pfannkuchen-Rezept mit Advanced Culinary Techniques, Temperatur-Management, Timing-Optimierung und Restaurant-Quality-Standards für perfekte Textur und Geschmacksprofil...",
                quality: "poor",
                score: 0,
                response: "Als Michelin-Stern Patissier analysiere ich zunächst die molekulargastronomischen Grundprinzipien der Teig-Matrix...\n\n**ADVANCED CRÊPE METHODOLOGY:**\n🧪 Gluten-Entwicklung-Kontrolle\n🌡️ Temperatur-Gradient-Management\n⏱️ Maillard-Reaktion-Timing\n\n**PROFESSIONELLES REZEPT:**\n'Verwenden Sie präzise 127g Type-405-Mehl mit 2,3g Himalaya-Salz, temperiert auf 18°C...'\n\n*[Völlig übertrieben für einfache Pfannkuchen]*",
                explanation: "Viel zu komplex! Für einfache Pfannkuchen brauchst du keinen Michelin-Stern Koch. Weniger Expertise, mehr praktische Hilfe!"
            },
            {
                text: "Einfaches Pfannkuchen-Rezept für Anfänger: Schritt-für-Schritt mit genauen Mengen. Erkläre es so, als hätte ich noch nie gekocht.",
                quality: "excellent",
                score: 10,
                response: "**PFANNKUCHEN FÜR ANFÄNGER - Super einfach!**\n\n**Zutaten (für 4 Personen):**\n• 200g Mehl\n• 300ml Milch\n• 2 Eier\n• 1 Prise Salz\n• 1 TL Zucker\n• Butter für die Pfanne\n\n**Schritt-für-Schritt:**\n1. **Teig machen:** Alle Zutaten in eine Schüssel, mit dem Schneebesen gut verrühren (keine Klumpen!)\n2. **5 Min warten** - Teig wird dadurch fluffiger\n3. **Pfanne erhitzen** - mittlere Hitze, bisschen Butter rein\n4. **Erste Kelle Teig** in die Pfanne, schwenken dass es sich verteilt\n5. **2-3 Min braten** bis Unterseite goldbraun ist\n6. **Umdrehen** (Mut!) und nochmal 1-2 Min\n\n**Tipp:** Erste Pfannkuchen werden oft schlecht - ist normal! 😊\n\n*[Perfekt: Einfach, ermutigend, praktische Tipps]*",
                explanation: "Bingo! Du verstehst es: 'Als hätte ich noch nie gekocht' ist der Schlüssel! Die AI gibt dann viel bessere, einfachere Erklärungen mit praktischen Tipps."
            }
        ],
        hint: "Für Anfänger: 'Schritt-für-Schritt' und 'als hätte ich noch nie...' sind magische Worte! Macht Anweisungen viel verständlicher."
    },
    {
        id: 5,
        title: "Challenge 5: Fitness-Plan Fiasko",
        description: "Final-Boss! Du willst endlich fit werden, aber hast wenig Zeit und bist Anfänger. Welcher Prompt bringt dich wirklich voran?",
        scenario: "💪 Neues Jahr, neue Ziele - aber nur 30 Min pro Tag Zeit!",
        prompts: [
            {
                text: "Trainingsplan für Anfänger, 30 Minuten täglich, Ziel: fitter werden und abnehmen",
                quality: "poor",
                score: 0,
                response: "**30-MINUTEN ANFÄNGER-TRAININGSPLAN:**\n\n**3x pro Woche:**\n\n**Aufwärmen (5 Min):**\n- Auf der Stelle gehen\n- Arme schwingen\n\n**Training (20 Min):**\n- Kniebeugen: 2x8\n- Liegestütze (Knie): 2x5\n- Plank: 2x15 Sek\n- Gehen/leichtes Joggen: 10 Min\n\n**Dehnen (5 Min):**\n- Beine und Arme dehnen\n\n**Fortschritt:** Jede Woche 1-2 Wiederholungen mehr\n\n*[Solide Basis, aber könnte detaillierter sein]*",
                explanation: "Ganz okay, aber zu allgemein! Die AI weiß nicht, dass du Anfänger bist und zu Hause trainierst - mehr Details wären besser gewesen."
            },
            {
                text: "Du bist ein zertifizierter Personal Trainer mit Master-Degree in Sportwissenschaften, 15 Jahren Erfahrung in High-Performance Athletics, Spezialist für Biomechanik, Ernährungsphysiologie, Trainingsperiodisierung und mentales Coaching. Erstelle einen wissenschaftlich fundierten, individuell optimierten Trainingsplan mit makro- und mikrozyklischer Periodisierung, metabolischen Adaptationen, neuromuskulärer Aktivierung und progressiver Overload-Strategien für maximale Leistungssteigerung...",
                quality: "good",
                score: 3,
                response: "Als zertifizierter Exercise Physiologist analysiere ich zunächst Ihre biomechanischen Bewegungspatterns und metabolischen Grundvoraussetzungen...\n\n**SCIENTIFIC TRAINING METHODOLOGY:**\n🧬 Myofibrilläre Proteinsynthese-Optimierung\n⚡ Neuronale Adaptations-Kaskaden\n📊 VO2max-Progression-Algorithmus\n🎯 Lactate-Threshold-Modulation\n\n**ADVANCED WORKOUT STRUCTURE:**\n'Phase 1: Anatomical Adaptation mit 65-75% 1RM-Intensity bei 3x8-12 Repetitions...'\n\n*[Völlig übertrieben für einen Fitness-Anfänger]*",
                explanation: "Völlig übertrieben! Du willst einfach fit werden, nicht für die Olympiade trainieren. Die Wissenschafts-Keulen-Methode schüchtert nur ein."
            },
            {
                text: "Fitness-Plan für Anfänger: 30 Min täglich, zu Hause, ohne Geräte. Ich will abnehmen und fitter werden. Erkläre jede Übung einfach, ich kenne keine Fachbegriffe.",
                quality: "excellent",
                score: 10,
                response: "**FITNESS-PLAN FÜR ANFÄNGER (30 MIN/TAG)**\n\n**Montag, Mittwoch, Freitag - Ganzkörper:**\n\n**Aufwärmen (5 Min):**\n• Auf der Stelle marschieren - 2 Min\n• Arme kreisen - 1 Min\n• Knie heben - 2 Min\n\n**Hauptteil (20 Min):**\n1. **Kniebeugen** - 3x10 (Po runter, als würdest du dich hinsetzen)\n2. **Liegestütze** - 3x5 (an der Wand oder auf Knien)\n3. **Plank** - 3x20 Sek (wie ein Brett auf Unterarmen)\n4. **Ausfallschritte** - 3x8 pro Bein (großer Schritt nach vorn)\n5. **Bergsteiger** - 3x15 (abwechselnd Knie zur Brust)\n\n**Cool-Down (5 Min):**\n• Stretching - alles langsam dehnen\n\n**Dienstag, Donnerstag - Spazieren gehen (30 Min)**\n**Wochenende - Frei oder leichte Aktivität**\n\n**Tipp:** Fang langsam an! Lieber weniger Wiederholungen und dafür regelmäßig! 💪\n\n*[Perfekt: Einfach, machbar, motivierend]*",
                explanation: "Fantastisch! Du hast das Geheimnis geknackt: Die AI braucht DEINEN Kontext. 'Anfänger + 30 Min + zu Hause + keine Fachbegriffe' ergibt einen perfekt passenden Plan!"
            }
        ],
        hint: "Für Fitness-Anfänger: Sag der AI dein Level! 'Anfänger', 'keine Geräte', 'wenig Zeit' führt zu viel realistischeren Plänen."
    }
];

// Game Functions
function startGame() {
    currentChallenge = 0;
    totalScore = 0;
    gameState = 'tutorial';

    // MoMan welcome message
    if (moHost) {
        moHost.speak("Perfekt! Lass uns zusammen die Geheimnisse des Promptens entdecken! 🚀");
    }

    updateScore(0);
    showTutorial();
}

function showTutorial() {
    // Only show tutorial at the very beginning (currentChallenge = 0)
    const tutorial = tutorials[0];

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show tutorial screen
    document.getElementById('tutorialScreen').classList.add('active');

    // Update tutorial content
    document.getElementById('tutorialTitle').textContent = tutorial.title;
    document.getElementById('tutorialConcept').textContent = tutorial.concept;
    document.getElementById('tutorialPrinciple').textContent = tutorial.principle;

    // Create examples
    createTutorialExamples(tutorial);

    // Update progress
    updateProgress();
}

function createTutorialExamples(tutorial) {
    const container = document.getElementById('tutorialExamples');
    container.innerHTML = '';

    tutorial.examples.forEach((example, index) => {
        const exampleCard = document.createElement('div');
        exampleCard.className = 'example-card';

        exampleCard.innerHTML = `
            <div class="example-situation">${example.situation}</div>
            <div class="prompt-comparison">
                <div class="bad-prompt">
                    <div class="prompt-label">❌ Schlechter Prompt:</div>
                    <div class="prompt-text">"${example.badPrompt}"</div>
                    <div class="prompt-explanation">${example.whyBad}</div>
                </div>
                <div class="good-prompt">
                    <div class="prompt-label">✅ Guter Prompt:</div>
                    <div class="prompt-text">"${example.goodPrompt}"</div>
                    <div class="prompt-explanation">${example.whyGood}</div>
                </div>
            </div>
        `;

        container.appendChild(exampleCard);
    });
}

function startChallenge() {
    gameState = 'challenge';

    // Hide tutorial screen
    document.getElementById('tutorialScreen').classList.remove('active');

    // Show challenge
    showChallenge();
}

function showChallenge() {
    if (currentChallenge >= challenges.length) {
        showCompletion();
        return;
    }

    const challenge = challenges[currentChallenge];

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show challenge screen
    document.getElementById('challengeScreen').classList.add('active');

    // Update challenge content
    document.getElementById('challengeTitle').textContent = challenge.title;
    document.getElementById('challengeDescription').textContent = challenge.description;

    // Update progress
    updateProgress();

    // Create prompt options
    createPromptOptions(challenge);

    // Reset AI response and hint
    showTypingIndicator();
    hideHint();

}

function createPromptOptions(challenge) {
    const container = document.getElementById('promptOptions');
    container.innerHTML = '';

    challenge.prompts.forEach((prompt, index) => {
        const option = document.createElement('div');
        option.className = 'prompt-option';
        option.innerHTML = `
            <input type="radio" name="promptChoice" value="${index}" id="prompt${index}">
            <label for="prompt${index}">${prompt.text}</label>
        `;

        option.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.prompt-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class and check radio
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;

        });

        container.appendChild(option);
    });
}

function submitPrompt() {
    const selectedPrompt = document.querySelector('input[name="promptChoice"]:checked');

    if (!selectedPrompt) {
        alert('Bitte wähle einen Prompt aus!');
        return;
    }

    const promptIndex = parseInt(selectedPrompt.value);
    const chosenPrompt = challenges[currentChallenge].prompts[promptIndex];
    const score = chosenPrompt.score;

    // Disable submit button
    document.querySelector('.submit-button').disabled = true;

    // Show AI response with typing effect
    showAIResponse(chosenPrompt.response, () => {
        setTimeout(() => {
            showResults(score, chosenPrompt);
        }, 1000);
    });
}


function showAIResponse(response, callback) {
    const responseElement = document.getElementById('aiResponse');
    responseElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span><p>AI denkt nach...</p></div>';

    setTimeout(() => {
        responseElement.innerHTML = '<div class="response-text"></div>';
        typeWriter(response, responseElement.querySelector('.response-text'), () => {
            // Add continue button after AI response is finished
            showContinueButton(callback);
        });
    }, 800);
}

function showContinueButton(callback) {
    const responseElement = document.getElementById('aiResponse');
    const continueButton = document.createElement('button');
    continueButton.className = 'continue-response-button';
    continueButton.textContent = '▶️ Weiter';
    continueButton.onclick = () => {
        continueButton.remove();
        if (callback) callback();
    };

    responseElement.appendChild(continueButton);
}

function typeWriter(text, element, callback) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 8); // Viel schneller: 8ms statt 30ms
        } else if (callback) {
            callback();
        }
    }

    type();
}

function showTypingIndicator() {
    const responseElement = document.getElementById('aiResponse');
    responseElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span><p>Bereit für deinen Prompt...</p></div>';
}

function showResults(score, chosenPrompt) {
    totalScore += score;
    updateScore(totalScore);

    // MoMan reactions based on result
    if (moHost) {
        if (score > 0) {
            moHost.celebrateCorrectAnswer();
        } else {
            moHost.encourageAfterWrongAnswer();
        }
    }

    // Hide challenge screen
    document.getElementById('challengeScreen').classList.remove('active');

    // Show results screen
    document.getElementById('resultsScreen').classList.add('active');

    // Update results content
    const challenge = challenges[currentChallenge];
    document.getElementById('resultsTitle').textContent = `Challenge ${currentChallenge + 1} Abgeschlossen!`;
    document.getElementById('scoreEarned').textContent = `+${score} Punkte!`;
    document.getElementById('explanationText').textContent = chosenPrompt.explanation || challenge.explanation;

    // Enable submit button again
    document.querySelector('.submit-button').disabled = false;
}

function nextChallenge() {
    currentChallenge++;

    // MoMan transition messages
    if (moHost) {
        const transitionMessages = [
            "Sehr gut! Bereit für die nächste Challenge? 💪",
            "Du lernst schnell! Lass uns weitermachen! 🎯",
            "Das war stark! Die nächste wird noch interessanter! ✨",
            "Perfekt! Ich hab schon die nächste Challenge vorbereitet! 🚀",
            "Du bist auf einem guten Weg! Weiter geht's! 📈"
        ];
        const randomMessage = transitionMessages[Math.floor(Math.random() * transitionMessages.length)];
        moHost.speak(randomMessage);
    }

    // Hide results screen
    document.getElementById('resultsScreen').classList.remove('active');

    // Show next challenge or completion (no more tutorials)
    showChallenge();
}

function showCompletion() {
    gameState = 'completion';

    // MoMan final celebration
    if (moHost) {
        let finalMessage = "";
        if (totalScore >= 45) {
            finalMessage = `WOW! Du bist ein echtes Prompt-Talent! ${totalScore} Punkte sind fantastisch! 🏆⭐`;
        } else if (totalScore >= 35) {
            finalMessage = `Sehr beeindruckend! Du hast das Prompting richtig gut drauf! ${totalScore} Punkte! 🌟💫`;
        } else if (totalScore >= 25) {
            finalMessage = `Gut gemacht! Du hast die Grundlagen verstanden! ${totalScore} Punkte! 👏🎯`;
        } else {
            finalMessage = `Hey, das war ein guter Start! ${totalScore} Punkte - Übung macht den Meister! 💪😊`;
        }
        moHost.speak(finalMessage);
    }

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show completion screen
    document.getElementById('completionScreen').classList.add('active');

    // Update progress to 100%
    updateProgress();

    // Update completion content with current game data
    document.getElementById('finalScore').textContent = totalScore;
    document.getElementById('rankValue').textContent = getRank(totalScore).title;

    // Save progress after showing current results
    saveProgress();

    // Trigger celebration animation
    triggerCelebration();
}

function getRank(score) {
    if (score >= 50) return { title: "Gold 🥇", description: "Perfekte Prompt-Meisterschaft!" };
    if (score >= 40) return { title: "Silber 🥈", description: "Sehr gute Leistung!" };
    if (score >= 25) return { title: "Bronze 🥉", description: "Solider Prompt-Anfang!" };
    return { title: "Kein Rang", description: "Weiter üben!" };
}

function triggerCelebration() {
    // Add celebration class for animations
    document.querySelector('.completion-title').style.animation = 'celebration 2s ease-in-out infinite alternate';

    // You could add particle effects here
    createConfetti();
}

function createConfetti() {
    // Simple confetti effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#F5C03B', '#A86AFF', '#67C7FF'][Math.floor(Math.random() * 3)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function restartGame() {
    currentChallenge = 0;
    totalScore = 0;
    gameState = 'intro';

    // Hide all screens
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show intro screen
    document.getElementById('introScreen').classList.add('active');

    // Reset UI
    updateScore(0);
    updateProgress();
}

function updateScore(score) {
    const scoreElement = document.getElementById('scoreValue');
    scoreElement.textContent = score;

    // Add animation class
    scoreElement.classList.add('updated');
    setTimeout(() => {
        scoreElement.classList.remove('updated');
    }, 500);
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const progress = ((currentChallenge) / challenges.length) * 100;
    progressFill.style.width = progress + '%';

    // Don't show more than total challenges
    const displayChallenge = Math.min(currentChallenge + 1, challenges.length);
    progressText.textContent = `Challenge ${displayChallenge}/${challenges.length}`;
}

function showHint() {
    const hintBox = document.getElementById('hintBox');
    const hintText = document.getElementById('hintText');

    hintText.textContent = challenges[currentChallenge].hint;
    hintBox.classList.add('show');
}

function hideHint() {
    const hintBox = document.getElementById('hintBox');
    hintBox.classList.remove('show');
}

function saveProgress() {
    const currentRank = getRank(totalScore);
    const existingProgress = loadProgress();

    // Define rank hierarchy (higher number = better rank)
    const rankValues = {
        "Kein Rang": 0,
        "Bronze 🥉": 1,
        "Silber 🥈": 2,
        "Gold 🥇": 3
    };

    let rankToSave = currentRank.title;
    let scoreToSave = totalScore;

    // If there's existing progress, only upgrade rank if new one is better
    if (existingProgress && existingProgress.rank) {
        const existingRankValue = rankValues[existingProgress.rank] || 0;
        const currentRankValue = rankValues[currentRank.title] || 0;

        // Keep the better rank and higher score
        if (existingRankValue > currentRankValue) {
            rankToSave = existingProgress.rank;
        }

        // Always keep the higher score
        if (existingProgress.score > totalScore) {
            scoreToSave = existingProgress.score;
        }
    }

    const progress = {
        level: 1,
        completed: true,
        score: scoreToSave,
        rank: rankToSave,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('aiBytes_level1_progress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('aiBytes_level1_progress');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize MoMan Host
    moHost = new MoManHost();

    updateProgress();
});