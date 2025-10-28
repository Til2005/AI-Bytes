# 📸 Level 4 - Bild-Konfiguration Anleitung

## Übersicht
Dieses Dokument erklärt, wie du die Platzhalter-Bilder in Level 4 durch deine eigenen KI-generierten Bilder ersetzt.

---

## 📁 Verzeichnisstruktur

Alle Bilder müssen im Ordner `assets/level4/` gespeichert werden:

```
AI Bytes HTML Game/
├── assets/
│   └── level4/
│       ├── placeholder_target.png        (Challenge 1)
│       ├── placeholder_generated.png     (Challenge 2)
│       ├── placeholder_option1.png       (Challenge 3 - Option A)
│       ├── placeholder_option2.png       (Challenge 3 - Option B)
│       ├── placeholder_option3.png       (Challenge 3 - Option C)
│       ├── placeholder_real1.png         (Challenge 4 - Bild 1)
│       ├── placeholder_real2.png         (Challenge 4 - Bild 2)
│       └── placeholder_real3.png         (Challenge 4 - Bild 3)
```

---

## 🎯 Challenge 1: Prompt-Vergleich

### Benötigtes Bild:
- **Datei:** `placeholder_target.png`
- **Beschreibung:** Ein Mercedes-Bild, das als Ziel dient
- **Empfohlene Auflösung:** 1920x1080 oder 16:9 Format

### Konfiguration in `level4.js` (Zeile 31-37):

```javascript
challenge1: {
    imageUrl: 'assets/level4/placeholder_target.png',
    caption: 'Ein futuristisches Mercedes-Konzeptauto',  // ANPASSEN
    promptA: 'Ein Auto',  // SCHLECHTER PROMPT
    promptB: 'Futuristisches Mercedes Vision AVTR...',  // GUTER PROMPT - ANPASSEN
    correctAnswer: 'B'  // 'A' oder 'B' - Welcher ist besser?
}
```

### Was du tun musst:
1. ✅ Generiere ein Mercedes-Bild mit DALL-E/Midjourney
2. ✅ Speichere es als `placeholder_target.png`
3. ✅ Passe `caption` an (Beschreibung des Bildes)
4. ✅ Passe `promptB` an (der gute, detaillierte Prompt)
5. ✅ Setze `correctAnswer` auf `'B'` (normalerweise ist B der bessere)

---

## 🔍 Challenge 2: Prompt zum Bild

### Benötigtes Bild:
- **Datei:** `placeholder_generated.png`
- **Beschreibung:** Ein KI-generiertes Mercedes-Bild
- **Empfohlene Auflösung:** 1920x1080 oder 16:9 Format

### Konfiguration in `level4.js` (Zeile 38-45):

```javascript
challenge2: {
    imageUrl: 'assets/level4/placeholder_generated.png',
    options: [
        'Mercedes EQS auf einer Landstraße, sonniger Tag',  // Option A
        'Mercedes EQS in Cyberpunk-Stadt...',  // Option B
        'Schwarzes Auto in der Stadt'  // Option C
    ],
    correctAnswer: 2  // Index 0=A, 1=B, 2=C - ANPASSEN!
}
```

### Was du tun musst:
1. ✅ Generiere ein Mercedes-Bild (z.B. Cyberpunk-Style)
2. ✅ Speichere es als `placeholder_generated.png`
3. ✅ Passe die 3 Options an:
   - Option A: Falscher Prompt (zu allgemein)
   - Option B: Falscher Prompt (andere Details)
   - Option C: Falscher Prompt (ganz falsch)
4. ✅ **EINE der Options muss der RICHTIGE Prompt sein!**
5. ✅ Setze `correctAnswer` auf den Index der richtigen Option (0, 1 oder 2)

**Beispiel:**
Wenn Option B (`index 1`) der richtige Prompt ist:
```javascript
correctAnswer: 1
```

---

## 🎨 Challenge 3: Bild zum Prompt

### Benötigte Bilder:
- **Datei 1:** `placeholder_option1.png` (Bild A)
- **Datei 2:** `placeholder_option2.png` (Bild B)
- **Datei 3:** `placeholder_option3.png` (Bild C)
- **Empfohlene Auflösung:** 1200x900 oder 4:3 Format

### Konfiguration in `level4.js` (Zeile 46-55):

```javascript
challenge3: {
    prompt: 'Mercedes G-Klasse in der Wüste, goldene Stunde...',  // ANPASSEN
    images: [
        'assets/level4/placeholder_option1.png',  // Bild A
        'assets/level4/placeholder_option2.png',  // Bild B
        'assets/level4/placeholder_option3.png'   // Bild C
    ],
    correctAnswer: 1  // Index 0=A, 1=B, 2=C - ANPASSEN!
}
```

### Was du tun musst:
1. ✅ Erstelle EINEN detaillierten Prompt (z.B. G-Klasse in Wüste)
2. ✅ Generiere 3 Bilder:
   - **1 Bild** mit dem RICHTIGEN Prompt
   - **2 Bilder** mit ähnlichen aber falschen Prompts
3. ✅ Speichere sie als `option1.png`, `option2.png`, `option3.png`
4. ✅ Passe den `prompt` Text im Code an
5. ✅ Setze `correctAnswer` auf den Index des richtigen Bildes (0, 1 oder 2)

**Beispiel:**
- Bild B (`option2.png`) passt perfekt zum Prompt → `correctAnswer: 1`

---

## ✨ Challenge 4: Real vs. KI

### Benötigte Bilder:
- **Datei 1:** `placeholder_real1.png` (KI oder Real)
- **Datei 2:** `placeholder_real2.png` (KI oder Real)
- **Datei 3:** `placeholder_real3.png` (KI oder Real)
- **Empfohlene Auflösung:** 1200x900 oder 4:3 Format

### Konfiguration in `level4.js` (Zeile 56-63):

```javascript
challenge4: {
    images: [
        'assets/level4/placeholder_real1.png',  // Bild 1
        'assets/level4/placeholder_real2.png',  // Bild 2
        'assets/level4/placeholder_real3.png'   // Bild 3
    ],
    correctAnswer: 2  // Index des ECHTEN Fotos (0, 1 oder 2) - ANPASSEN!
}
```

### Was du tun musst:
1. ✅ Finde/Mache **1 ECHTES Mercedes-Foto**
2. ✅ Generiere **2 KI-Bilder** die echt aussehen
3. ✅ Speichere sie als `real1.png`, `real2.png`, `real3.png`
4. ✅ Setze `correctAnswer` auf den Index des ECHTEN Fotos

**Beispiel:**
- `real1.png` = KI-Bild
- `real2.png` = KI-Bild
- `real3.png` = ECHTES Foto → `correctAnswer: 2`

**Tipp für KI-Bilder:** Verwende Prompts die schwer zu erkennen sind:
- "Fotorealistischer Mercedes, professionelle Werbefotografie"
- "Ultra-realistisches Mercedes Produktfoto, Studiobedingungen"

---

## 🛠️ Schnell-Konfiguration

### 1. Öffne `level4.js` in einem Editor

### 2. Finde den Abschnitt "Challenge Data Configuration" (Zeile ~18)

### 3. Aktualisiere die `correctAnswer` Werte:

```javascript
const ChallengeData = {
    challenge1: {
        // ...
        correctAnswer: 'B'  // ← Ändere zu 'A' oder 'B'
    },
    challenge2: {
        // ...
        correctAnswer: 1  // ← Ändere zu 0, 1 oder 2
    },
    challenge3: {
        // ...
        correctAnswer: 0  // ← Ändere zu 0, 1 oder 2
    },
    challenge4: {
        // ...
        correctAnswer: 2  // ← Ändere zu 0, 1 oder 2 (Index des ECHTEN Fotos)
    }
};
```

### 4. Speichere die Datei

### 5. Teste das Level im Browser!

---

## 📋 Checkliste

Bevor du fertig bist:

- [ ] Alle 8 Bilder im `assets/level4/` Ordner gespeichert
- [ ] `challenge1.correctAnswer` gesetzt (`'A'` oder `'B'`)
- [ ] `challenge1.caption` angepasst
- [ ] `challenge1.promptB` angepasst
- [ ] `challenge2.correctAnswer` gesetzt (0, 1 oder 2)
- [ ] `challenge2.options` angepasst (einer muss richtig sein!)
- [ ] `challenge3.prompt` angepasst
- [ ] `challenge3.correctAnswer` gesetzt (0, 1 oder 2)
- [ ] `challenge4.correctAnswer` gesetzt (Index des ECHTEN Fotos)
- [ ] Level 4 getestet - alle 4 Challenges funktionieren
- [ ] Punktesystem funktioniert (10 Punkte pro richtiger Antwort)
- [ ] Rang-System funktioniert (Gold=40, Silber=30, Bronze=20)

---

## 🎨 Empfohlene Bild-Specs

| Eigenschaft | Wert |
|-------------|------|
| Format | PNG oder JPG |
| Challenge 1 & 2 | 1920x1080 (16:9) |
| Challenge 3 & 4 | 1200x900 (4:3) |
| Max Dateigröße | < 2 MB pro Bild |
| Qualität | Hoch (90%+) |

---

## 🚀 Bild-Generierung Tipps

### Für DALL-E 3 / ChatGPT:
```
"Fotorealistischer Mercedes [MODEL] in [SETTING], [LIGHTING],
professionelle Produktfotografie, 4K, hochauflösend"
```

### Für Midjourney:
```
mercedes [model] [setting] [lighting] --ar 16:9 --style raw
--v 6 --quality 2
```

### Für echte Fotos:
- Mercedes Presse-Portal: https://media.mercedes-benz.com
- Unsplash: https://unsplash.com/s/photos/mercedes
- Pixabay: https://pixabay.com/images/search/mercedes/

---

## ❓ Hilfe & Troubleshooting

### Bilder werden nicht angezeigt?
1. Prüfe Dateipfad: `assets/level4/[dateiname].png`
2. Prüfe Schreibweise (Groß-/Kleinschreibung!)
3. Browser-Cache leeren (Strg + F5)
4. Browser-Konsole öffnen (F12) für Fehler

### Falsche Antwort wird als richtig markiert?
1. Prüfe `correctAnswer` Index (startet bei 0!)
2. Challenge 2/3/4: 0 = erste Option, 1 = zweite, 2 = dritte
3. Challenge 1: 'A' oder 'B' (in Anführungszeichen!)

### MoMan oder TXP werden nicht angezeigt?
- Prüfe ob die Animationsordner vorhanden sind:
  - `Mo_man_Stand_Pose/`
  - `TXP/TXP_Stand_Pose/`

---

## ✅ Fertig!

Wenn alles konfiguriert ist:
1. Öffne `index.html` im Browser
2. Navigiere zu Level 4
3. Teste alle 4 Challenges
4. Prüfe ob die Punktevergabe stimmt
5. Prüfe ob der Rang korrekt angezeigt wird

**Viel Erfolg! 🎉**

---

Bei Fragen: Schau in die Browser-Konsole (F12) für Debug-Informationen!
