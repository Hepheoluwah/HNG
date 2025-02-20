// Configuration Constants
const SUMMARIZATION_THRESHOLD = 150;
const SHOW_SUMMARIZE_BUTTON_THRESHOLD = 120;

/**
 * Process text by detecting its language and summarizing if the text is long.
 * Uses Chrome's built-in Origin Trial API (window.ai.languageDetector) exclusively.
 */
export const processText = async (text) => {
  try {
    if (!window.ai || !window.ai.languageDetector) {
      throw new Error("Chrome Origin Trial language detector API is not available.");
    }
    const detector = await window.ai.languageDetector.create();
    await detector.ready;
    const results = await detector.detect(text);
    if (!results || results.length === 0) {
      throw new Error("Could not detect language.");
    }
    const detectedLanguage = results[0].detectedLanguage;
    const confidence = results[0].confidence;

    // Summarize text if it exceeds the threshold
    let summary = null;
    if (text.length > SUMMARIZATION_THRESHOLD) {
      if (!window.ai.summarizer) {
        throw new Error("Chrome Origin Trial summarizer API is not available.");
      }
      const summarizer = await window.ai.summarizer.create();
      summary = await summarizer.summarize(text);
    }

    return {
      detectedLanguage,
      confidence,
      summary,
      showSummarizeButton: text.length > SHOW_SUMMARIZE_BUTTON_THRESHOLD,
    };
  } catch (error) {
    console.error("Error processing text:", error.message);
    return { error: error.message };
  }
};

/**
 * Translate text using Chrome's built-in Origin Trial translator API.
 */
export async function translateText(text, targetLanguage, detectedLanguage) {
  const sourceLanguage = detectedLanguage || "en";
  if (!window.ai || !window.ai.translator) {
    return "Chrome Origin Trial translator API is not available.";
  }
  if (sourceLanguage === targetLanguage) {
    return "Source and target languages are the same.";
  }
  try {
    const translatorCapabilities = await window.ai.translator.capabilities();
    const availability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);
    if (availability === "no") {
      return `Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`;
    }
    let translator;
    if (availability === "after-download") {
      translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
    } else {
      translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage,
      });
    }
    return await translator.translate(text);
  } catch (error) {
    console.error("Translator error:", error);
    return "Translation failed. Please try again.";
  }
}

/**
 * Summarize text using Chrome's built-in Origin Trial summarizer API.
 */
export async function summarizeText(text) {
  try {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error("Chrome Origin Trial summarizer API is not available.");
    }
    const summarizer = await window.ai.summarizer.create();
    return await summarizer.summarize(text);
  } catch (error) {
    console.error("Summarizer error:", error);
    return "Summarization failed. Please try again.";
  }
}
