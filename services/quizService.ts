import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizData } from "../types";

const SYSTEM_INSTRUCTION = `
Du bist ein erfahrener LinkedIn-Coach und Strategie-Berater. 
Deine Aufgabe ist es, einen JSON-Inhalt für ein Diagnose-Quiz zu erstellen.
Das Quiz heißt "Der '5 Gespräche pro Woche' Reifegrad-Check".
Es dient dazu, Leads für ein Coaching-Programm zu qualifizieren.

Struktur des Quiz:
- Es gibt 3 Kategorien (A: Posting/Content, B: Messaging/Konversion, C: Kampagnen/Skalierung).
- Jede Kategorie hat exakt 4 Fragen.
- Jede Frage hat 3 Antwortoptionen (A, B, C).
  - Option A steht für Schwach/Selten (1 Punkt).
  - Option B steht für Mittel/Manchmal (2 Punkte).
  - Option C steht für Stark/Immer (3 Punkte).

Ausgabeformat:
Erstelle ein valides JSON-Objekt, das genau dem Schema entspricht.
Die Sprache muss Deutsch sein.
Der Ton soll direkt, herausfordernd, aber professionell sein.
`;

const USER_PROMPT_BLUEPRINT = `
Generiere den Content für das Quiz basierend auf folgenden Spezifikationen:

1. Kategorie A: Der POSTING-Hebel
   - Fokus: Hook-Stärke, Content-Mix (Story vs. How-To).
   - Erstelle 4 Fragen dazu.

2. Kategorie B: Der MESSAGING-Hebel
   - Fokus: First-Sentence-Hook im Chat, Antwortraten, Follow-up Psychologie.
   - Erstelle 4 Fragen dazu.

3. Kategorie C: Der KAMPAGNEN-Hebel
   - Fokus: Prozess-Effizienz, Regelmäßigkeit, Lead-Definition.
   - Erstelle 4 Fragen dazu.

4. Ergebnisse (Results):
   - Für Kategorie A (Wenn dies der schwächste Bereich ist):
     Title: "POSTING-BLINDHEIT"
     PainPoint: "Du arbeitest hart, wirst aber nicht gesehen."
     Solution: "Dein Hebel liegt in der Sichtbarkeit und strategischen Hooks."
   - Für Kategorie B (Wenn dies der schwächste Bereich ist):
     Title: "MESSAGING-LECK"
     PainPoint: "Du hast Leads, aber sie antworten einfach nicht."
     Solution: "Dein Hebel liegt in der psychologischen Konversion im Chat."
   - Für Kategorie C (Wenn dies der schwächste Bereich ist):
     Title: "KAMPAGNEN-STAU"
     PainPoint: "Keine vorhersagbaren Ergebnisse, alles ist Zufall."
     Solution: "Dein Hebel liegt in systematisierbaren Kampagnen-Prozessen."

5. CTA:
   - Ein Satz, der zu einem 1:1 Gespräch einlädt.
`;

export const generateQuizContent = async (): Promise<QuizData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            category: { type: Type.STRING, enum: ["A", "B", "C"] },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  text: { type: Type.STRING },
                  value: { type: Type.INTEGER },
                },
                required: ["label", "text", "value"],
              },
            },
          },
          required: ["id", "category", "text", "options"],
        },
      },
      results: {
        type: Type.OBJECT,
        properties: {
          A: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              painPoint: { type: Type.STRING },
              solution: { type: Type.STRING },
              cta: { type: Type.STRING },
            },
            required: ["title", "painPoint", "solution", "cta"],
          },
          B: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              painPoint: { type: Type.STRING },
              solution: { type: Type.STRING },
              cta: { type: Type.STRING },
            },
            required: ["title", "painPoint", "solution", "cta"],
          },
          C: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              painPoint: { type: Type.STRING },
              solution: { type: Type.STRING },
              cta: { type: Type.STRING },
            },
            required: ["title", "painPoint", "solution", "cta"],
          },
        },
        required: ["A", "B", "C"],
      },
    },
    required: ["title", "questions", "results"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: USER_PROMPT_BLUEPRINT,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as QuizData;
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    // Fallback data in case of API failure or quota issues during demo
    return FALLBACK_DATA;
  }
};

const FALLBACK_DATA: QuizData = {
  title: "Der '5 Gespräche pro Woche' Reifegrad-Check",
  questions: [
    {
      id: 1,
      category: "A",
      text: "Wie oft werden deine Posts von deiner idealen Zielgruppe kommentiert?",
      options: [
        { label: "A", text: "Fast nie oder nur von Kollegen/Freunden.", value: 1 },
        { label: "B", text: "Ab und zu, aber unberechenbar.", value: 2 },
        { label: "C", text: "Regelmäßig, ich provoziere gezielt Gespräche.", value: 3 }
      ]
    },
    // Add minimal fallback questions to prevent app crash if API fails
    {
      id: 2,
      category: "B",
      text: "Wie reagieren neue Kontakte auf deine erste Direktnachricht?",
      options: [
        { label: "A", text: "Meistens gar nicht (Ghosting).", value: 1 },
        { label: "B", text: "Manchmal freundlich, aber oft 'kein Interesse'.", value: 2 },
        { label: "C", text: "Oft neugierig und offen für Austausch.", value: 3 }
      ]
    },
    {
      id: 3,
      category: "C",
      text: "Hast du einen definierten Prozess, um Leads systematisch nachzufassen?",
      options: [
        { label: "A", text: "Nein, ich mache das nach Gefühl/Gedächtnis.", value: 1 },
        { label: "B", text: "Ich habe eine Liste, vergesse sie aber oft.", value: 2 },
        { label: "C", text: "Ja, mein CRM/System erinnert mich automatisch.", value: 3 }
      ]
    }
  ],
  results: {
    A: {
      title: "POSTING-BLINDHEIT",
      painPoint: "Du arbeitest hart an deinem Content, wirst aber von den Richtigen nicht gesehen.",
      solution: "Dein größter Hebel ist die Schärfung deiner Hooks und Content-Strategie.",
      cta: "Lass uns deine Sichtbarkeit im 1:1 Gespräch analysieren."
    },
    B: {
      title: "MESSAGING-LECK",
      painPoint: "Du generierst Kontakte, aber verlierst sie im Chat.",
      solution: "Wir müssen deine Ansprache psychologisch optimieren, damit Leads antworten.",
      cta: "Lass uns deine Chat-Verläufe im 1:1 Gespräch optimieren."
    },
    C: {
      title: "KAMPAGNEN-STAU",
      painPoint: "Deine Ergebnisse sind Zufallsprodukte, keine Systematik.",
      solution: "Du brauchst einen skalierbaren Prozess für deine Akquise.",
      cta: "Lass uns deinen Prozess im 1:1 Gespräch aufsetzen."
    }
  }
};
