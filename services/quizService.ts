import { GoogleGenerativeAI } from '@google/genai'; 
import { QuizData, ResultContent, Question, Category } from './types'; 

// *****************************************************************
// 🚨 ACHTUNG: UNSICHERER TEST-CODE (NUR ZUM DEBUGGEN!)
// *****************************************************************

// ERSETZEN SIE HIER DIESEN PLATZHALTER MIT IHREM ECHTEN GEMINI API KEY!
// Beispiel: const GEMINI_API_KEY = "AIzaSyDHw2UB8JUR3u6A3FtQsmmFU4xk0VBp6Hk";
const GEMINI_API_KEY = "IHR_ECHTER_GEMINI_API_KEY_HIER_EINFÜGEN"; 

// 2. Den Gemini Client mit dem hart kodierten Key initialisieren.
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
    // Wenn die KI zusätzlichen Text sendet (oft ein Problem), diesen bereinigen.
    const cleanedString = jsonString.startsWith('```json') ? jsonString.substring(7, jsonString.length - 3).trim() : jsonString;
    return JSON.parse(cleanedString) as QuizData;
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    console.error("Received text:", response.text);
    throw new Error("Die KI konnte keine gültige Quiz-JSON-Struktur generieren.");
  }
}
