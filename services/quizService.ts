import { GoogleGenerativeAI } from '@google/genai'; 
import { QuizData, ResultContent, Question, Category } from './types'; 

// *****************************************************************
// 🔑 KORREKTUR: VITE-PRÄFIX FÜR API KEY NÖTIG, DAMIT REACT IHN SIEHT
// *****************************************************************

// 1. Hole den API Key aus der NEUEN Netlify Umgebungsvariable (VITE_GEMINI_API_KEY)
//    Wir nutzen process.env, da Netlify es zur Build-Zeit einfügt.
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY; 

if (!GEMINI_API_KEY) {
  // Wenn der Key nicht gefunden wird, werfen wir einen Fehler (wichtig für Debugging)
  throw new Error("Fehler: Gemini API Key (VITE_GEMINI_API_KEY) wurde nicht gefunden. Bitte in Netlify prüfen.");
}

// 2. Den Gemini Client mit dem korrekten Key initialisieren.
const ai = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY }); 

// *****************************************************************

const prompt = `
  Erstelle einen Reifegrad-Check zum Thema "5 Gespräche pro Woche" für LinkedIn.
  Das Ziel ist es, die Nutzer in den Bereichen Posting, Messaging und Kampagnen zu bewerten.

  1. Fragen (15 Fragen, 5 pro Kategorie):
     - Kategorie A: Posting-Strategie (Content creation, Thought leadership)
     - Kategorie B: Messaging & Beziehungsaufbau (Outreach, Engagement)
     - Kategorie C: Kampagnen & Tools (Sales Navigator, Ads)
     - Jede Frage hat 5 Antwortmöglichkeiten (1 bis 5 Punkte), wobei 5 der beste Wert ist.

  2. Ergebnisse (3 detaillierte Ergebnisse):
     - Ergebnis A: Für Nutzer, die bei Posting-Strategie am schlechtesten abgeschnitten haben.
     - Ergebnis B: Für Nutzer, die bei Messaging am schlechtesten abgeschnitten haben.
     - Ergebnis C: Für Nutzer, die bei Kampagnen am schlechtesten abgeschnitten haben.
     - Jedes Ergebnis sollte einen Titel, eine Zusammenfassung und klare nächste Schritte enthalten.

  Antworte ausschließlich im folgenden JSON-Format und fülle die Daten vollständig aus. Verwende deutsches Vokabular und formuliere die Fragen/Ergebnisse so, dass sie professionell klingen.
  ... (Hier folgt das vollständige QuizData JSON-Schema, das die KI generiert)
`;

export async function generateQuizContent(): Promise<QuizData> {
  // Das Modell, das die Quizdaten generiert.
  const model = 'gemini-2.5-flash'; 

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    // Die Antwort muss als JSON geparst werden
    const jsonString = response.text.trim();
    // Wenn die KI zusätzlichen Text sendet, diesen bereinigen (oft ein Problem)
    const cleanedString = jsonString.startsWith('```json') ? jsonString.substring(7, jsonString.length - 3).trim() : jsonString;
    return JSON.parse(cleanedString) as QuizData;
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    console.error("Received text:", response.text);
    throw new Error("Die KI konnte keine gültige Quiz-JSON-Struktur generieren.");
  }
}
