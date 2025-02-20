import axios from 'axios';

const apiEndpoint = 'https://chrome-ai-api.example.com'; // Replace with the actual API endpoint

// Language Detection API call
export const detectLanguage = async (text) => {
  try {
    const response = await axios.post(`${apiEndpoint}/detect-language`, { text });
    return response.data.language;
  } catch (error) {
    throw new Error('Language detection failed');
  }
};

// Summarization API call
export const summarizeText = async (text) => {
  try {
    const response = await axios.post(`${apiEndpoint}/summarize`, { text });
    return response.data.summary;
  } catch (error) {
    throw new Error('Summarization failed');
  }
};

// Translation API call
export const translateText = async (text, languageCode) => {
  try {
    const response = await axios.post(`${apiEndpoint}/translate`, { text, language: languageCode });
    return response.data.translation;
  } catch (error) {
    throw new Error('Translation failed');
  }
};
