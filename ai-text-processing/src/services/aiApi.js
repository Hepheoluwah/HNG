// API Keys and Endpoints
const GOOGLE_LANGUAGE_DETECT_API_KEY = "AlvnQOgXEaDkm1KTvW3ZasTnP5EAdLCnhbhfTzwAE2D5V1t2jyJ3+jjnQWgXOtgO40FeJ2rt7V69DIsxHW/7uA4AAABXeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk1OTk5OTl9";
const GOOGLE_TRANSLATE_API_KEY = "Aoeg49e8gXziww8aMaciOT3ocfAg14TCdd6srBr0/ENCVaog72otR4Or4Qjz9qByZNGl2mbK/pxvft9j0jf8sw0AAABReyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDB9";
const GOOGLE_SUMMARIZER_API_KEY = "ApywZEcawPu3bp6OLLTdoGZKtPjN5sKcNOYQ7FrAJbcOp/vfx7SNIZu8Zxj9gqcIPXzkGd5/KiS1HpvUvKee5gwAAABVeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiQUlTdW1tYXJpemF0aW9uQVBJIiwiZXhwaXJ5IjoxNzUzMTQyNDAwfQ==";
const GOOGLE_SUMMARIZER_ENDPOINT = "https://api.google.com/summarizer"; // Replace with actual endpoint

// Process text: Detect language, optionally summarize if long
export const processText = async (text) => {
  try {
    let detectedLanguage = null;
    let confidence = null;

    // Use window.ai.languageDetector if available, otherwise fallback to Google API
    if (window.ai?.languageDetector) {
      console.log("Using window.ai.languageDetector...");
      const detector = await window.ai.languageDetector.create();
      await detector.ready;
      console.log("Detecting language...");
      const results = await detector.detect(text);
      if (!results || results.length === 0) throw new Error("Could not detect language.");
      detectedLanguage = results[0].detectedLanguage;
      confidence = results[0].confidence;
    } else {
      console.warn("window.ai.languageDetector is unavailable. Using Google Language Detection API.");
      const fallbackResult = await detectLanguageWithGoogle(text);
      if (fallbackResult.error) throw new Error(fallbackResult.error);
      detectedLanguage = fallbackResult.language;
      confidence = fallbackResult.confidence;
    }

    console.log(`Detected Language: ${detectedLanguage} (Confidence: ${confidence})`);

    let summary = null;
    if (text.length > 150) {
      console.log("Text exceeds 150 characters. Summarizing...");
      summary = await summarizeText(text);
    }

    return {
      detectedLanguage,
      confidence,
      summary,
      showSummarizeButton: text.length > 120,
    };
  } catch (error) {
    console.error("Error processing text:", error.message);
    return { error: error.message };
  }
};

// Detect language using Google Translate API as fallback
async function detectLanguageWithGoogle(text) {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_LANGUAGE_DETECT_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.error("Google Language Detection API Error:", data.error.message);
      return { error: data.error.message };
    }
    const detection = data.data.detections[0][0];
    return {
      language: detection.language,
      confidence: detection.confidence,
    };
  } catch (error) {
    console.error("Error with Google Language Detection API:", error);
    return { error: "Hmm... I can't figure out what language this is. Maybe it's from another planet? 🛸" };
  }
}

// Translation functions
export async function translateText(text, targetLanguage, detectedLanguage) {
  const sourceLanguage = detectedLanguage || "en";
  try {
    // If the detected language is unknown
    if (!sourceLanguage) {
      return "Hmm... I can't translate what I can't understand. Are you speaking in riddles? 🤔";
    }

    // If the source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      return "Nice try! But translating English to English won’t make it sound fancier. Try another language! 😆";
    }

    if (window.ai?.translator) {
      const translatorCapabilities = await window.ai.translator.capabilities();
      const availability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);

      if (availability === "no") {
        console.warn(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`);
        return `Oops! I don't speak ${targetLanguage} yet. Give me some time to learn. 😅`;
      } else if (availability === "after-download") {
        console.log(`Downloading language model for ${targetLanguage}...`);
        const translator = await window.ai.translator.create({
          sourceLanguage,
          targetLanguage,
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        console.log(`Language model for ${targetLanguage} downloaded.`);
        return await translator.translate(text);
      } else {
        const translator = await window.ai.translator.create({
          sourceLanguage,
          targetLanguage,
        });
        return await translator.translate(text);
      }
    }
    console.warn("window.ai.translator is not available. Falling back to Google Translate API.");
    return await translateWithGoogle(text, sourceLanguage, targetLanguage);
  } catch (error) {
    console.error("Error with AI translator:", error);
    console.warn("Falling back to Google Translate API.");
    return await translateWithGoogle(text, sourceLanguage, targetLanguage);
  }
}

async function translateWithGoogle(text, sourceLanguage, targetLanguage) {
  const GOOGLE_TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_ENDPOINT}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text",
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error using Google Translate API:", error);
    return "Translation failed. Maybe your text prefers to stay where it is? 🤔";
  }
}

// Summarization functions
export async function summarizeText(text) {
  try {
    if (window.ai?.summarizer) {
      const summarizer = await window.ai.summarizer.create();
      return await summarizer.summarize(text);
    }
    console.warn("window.ai.summarizer is not available. Falling back to Google Summarizer API.");
    return await summarizeWithGoogle(text);
  } catch (error) {
    console.error("Error using built-in summarizer:", error);
    console.warn("Falling back to Google Summarizer API.");
    return await summarizeWithGoogle(text);
  }
}

async function summarizeWithGoogle(text) {
  try {
    const response = await fetch(GOOGLE_SUMMARIZER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GOOGLE_SUMMARIZER_API_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.summary;
  } catch (error) {
    console.error("Error using Google Summarizer API:", error);
    console.warn("Using basic summarization fallback.");
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  }
}
