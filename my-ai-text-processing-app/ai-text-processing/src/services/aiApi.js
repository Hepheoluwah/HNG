// export const processText = async (text) => {
//     try {
//         if (!window.ai) throw new Error("AI API is not supported in this browser.");
//         if (!window.ai.languageDetector) throw new Error("Language Detector API is unavailable.");
        
//         console.log("Creating language detector...");
//         const detector = await window.ai.languageDetector.create();
//         await detector.ready;
        
//         console.log("Detecting language...");
//         const results = await detector.detect(text);
//         if (!results || results.length === 0) throw new Error("Could not detect language.");
        
//         const { detectedLanguage, confidence } = results[0];
//         console.log(`Detected Language: ${detectedLanguage} (Confidence: ${confidence})`);

//         let summary = null;
//         if (text.length > 120) {
//             console.log("Text exceeds 120 characters. Summarizing...");

//             if (!window.ai.summarizer) throw new Error("Summarizer API is unavailable.");
//             console.log("Summarizer Available:", window.ai?.summarizer);
            
//             const summarizer = await window.ai.summarizer.create();
//             await summarizer.ready;

//             summary = await summarizer.summarize(text);
//             console.log("Summary:", summary);
//         }

//         return {
//             detectedLanguage,
//             confidence,
//             summary,
//             showSummarizeButton: text.length > 120
//         };
//     } catch (error) {
//         console.error("Error processing text:", error.message);
//         return { error: error.message };
//     }
// };


const GOOGLE_LANGUAGE_DETECT_API_KEY = "AlvnQOgXEaDkm1KTvW3ZasTnP5EAdLCnhbhfTzwAE2D5V1t2jyJ3+jjnQWgXOtgO40FeJ2rt7V69DIsxHW/7uA4AAABXeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiTGFuZ3VhZ2VEZXRlY3Rpb25BUEkiLCJleHBpcnkiOjE3NDk1OTk5OTl9";

export const processText = async (text) => {
    try {
        let detectedLanguage = null;
        let confidence = null;

        // Try using window.ai.languageDetector if available
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
            console.warn("window.ai.languageDetector is unavailable. Falling back to Google Language Detection API.");
            const fallbackResult = await detectLanguageWithGoogle(text);
            if (fallbackResult.error) throw new Error(fallbackResult.error);

            detectedLanguage = fallbackResult.language;
            confidence = fallbackResult.confidence;
        }

        console.log(`Detected Language: ${detectedLanguage} (Confidence: ${confidence})`);

        let summary = null;
        if (text.length > 120) {
            console.log("Text exceeds 120 characters. Summarizing...");
            summary = await summarizeText(text);
        }

        return {
            detectedLanguage,
            confidence,
            summary,
            showSummarizeButton: text.length > 120
        };
    } catch (error) {
        console.error("Error processing text:", error.message);
        return { error: error.message };
    }
};

// Helper function to detect language using Google Translate API
async function detectLanguageWithGoogle(text) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_LANGUAGE_DETECT_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: text
                }),
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
            confidence: detection.confidence
        };
    } catch (error) {
        console.error("Error with Google Language Detection API:", error);
        return { error: "Unable to detect language." };
    }
}

// Helper function to summarize text if needed
async function summarizeText(text) {
    try {
        if (!window.ai?.summarizer) {
            console.warn("Summarizer API unavailable. Skipping summary.");
            return null;
        }

        console.log("Using window.ai.summarizer...");
        const summarizer = await window.ai.summarizer.create();
        await summarizer.ready;
        return await summarizer.summarize(text);
    } catch (error) {
        console.error("Error summarizing text:", error);
        return null;
    }
}





const GOOGLE_TRANSLATE_API_KEY = "Aoeg49e8gXziww8aMaciOT3ocfAg14TCdd6srBr0/ENCVaog72otR4Or4Qjz9qByZNGl2mbK/pxvft9j0jf8sw0AAABReyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiVHJhbnNsYXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDB9";

export async function translateText(text, targetLanguage, detectedLanguage) {
    // const sourceLanguage = "en";
    const sourceLanguage = detectedLanguage || "en";
    console.log("sourceLanguage >>>>>>>>>>>> "  +  sourceLanguage);

    try {
        // First, try using window.ai.translator if available
        if ("ai" in window && "translator" in window.ai) {
            const translatorCapabilities = await window.ai.translator.capabilities();
            const availability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);

            if (availability === "no") {
                console.warn(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`);
            } else {
                if (availability === "after-download") {
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
                }

                // If translation is readily available
                const translator = await window.ai.translator.create({ sourceLanguage, targetLanguage });
                return await translator.translate(text);
            }
        }

        // If window.ai.translator is unavailable, fall back to Google Translate API
        console.warn("window.ai.translator is not available. Falling back to Google Translate API.");
        return await translateWithGoogle(text, sourceLanguage, targetLanguage);

    } catch (error) {
        console.error("Error with AI translator:", error);
        console.warn("Falling back to Google Translate API.");
        return await translateWithGoogle(text, sourceLanguage, targetLanguage);
    }
}

// Helper function to use Google Translate API
async function translateWithGoogle(text, sourceLanguage, targetLanguage) {
    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLanguage,
                    target: targetLanguage,
                    format: "text",
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("Google Translate API Error:", data.error.message);
            return `Error: ${data.error.message}`;
        }

        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error("Error with Google Translate API:", error);
        return "Error: Unable to translate.";
    }
}







// export async function translateText(text, targetLanguage) {
//     try {
//         if (!("ai" in window) || !("translator" in window.ai)) {
//             console.error("Translator API is NOT available.");
//             return "Error: Translation service unavailable.";
//         }

//         // Ensure target language is different from source language
//         const sourceLanguage = "en";
//         if (targetLanguage === sourceLanguage) {
//             console.error("Target language must be different from source language.");
//             return `Error: Cannot translate from ${sourceLanguage} to ${targetLanguage}.`;
//         }

//         // Check if the language pair is available
//         const translatorCapabilities = await window.ai.translator.capabilities();
//         const availability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);

//         if (availability === "no") {
//             console.error(`Translation from ${sourceLanguage} to ${targetLanguage} is not supported.`);
//             return `Error: Cannot translate to ${targetLanguage}.`;
//         }

//         if (availability === "after-download") {
//             console.log(`Downloading language model for ${targetLanguage}...`);

//             const translator = await window.ai.translator.create({
//                 sourceLanguage,
//                 targetLanguage,
//                 monitor(m) {
//                     m.addEventListener("downloadprogress", (e) => {
//                         console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
//                     });
//                 },
//             });

//             console.log(`Language model for ${targetLanguage} downloaded.`);
//             return await translator.translate(text);
//         }

//         // If translation is readily available
//         const translator = await window.ai.translator.create({ sourceLanguage, targetLanguage });
//         return await translator.translate(text);
        
//     } catch (error) {
//         console.error("Error translating text:", error);
//         return "Error: Unable to translate.";
//     }
// }



