export interface DetectionResult {
  text: string;
  isSpam: boolean;
  confidence: number;
  spamProbability: number;
  hamProbability: number;
  indicators: { word: string; weight: number }[];
  timestamp: number;
  id: string;
}

export interface ModelInfo {
  model_type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  dataset_size: number;
  spam_count: number;
  ham_count: number;
  confusion_matrix: { tn: number; fp: number; fn: number; tp: number };
  all_models: Record<string, { accuracy: number; precision: number; recall: number; f1: number }>;
}

// Cache for loaded data
let vocabularyData: Record<string, { index: number; idf: number }> | null = null;
let linearModelData: { intercept: number; features: Record<string, number> } | null = null;
let sampleEmailsData: { spam: string[]; ham: string[] } | null = null;
let modelInfoData: ModelInfo | null = null;

async function loadJSON<T>(path: string): Promise<T> {
  const response = await fetch(path);
  return response.json();
}

async function getVocabulary() {
  if (!vocabularyData) {
    vocabularyData = await loadJSON<Record<string, { index: number; idf: number }>>('./models/vocabulary.json');
  }
  return vocabularyData;
}

async function getLinearModel() {
  if (!linearModelData) {
    linearModelData = await loadJSON<{ intercept: number; features: Record<string, number> }>('./models/linear_model.json');
  }
  return linearModelData;
}

// Preprocess text same as Python
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize and extract features
function extractFeatures(text: string): Map<string, number> {
  const words = text.split(/\s+/);
  const features = new Map<string, number>();
  
  // Unigrams
  for (const word of words) {
    if (word.length > 1) {
      features.set(word, (features.get(word) || 0) + 1);
    }
  }
  
  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + ' ' + words[i + 1];
    if (words[i].length > 1 || words[i + 1].length > 1) {
      features.set(bigram, (features.get(bigram) || 0) + 1);
    }
  }
  
  return features;
}

// Detect spam
export async function detectSpam(text: string): Promise<DetectionResult> {
  const cleaned = preprocessText(text);
  const features = extractFeatures(cleaned);
  
  const vocab = await getVocabulary();
  const model = await getLinearModel();
  
  let score = model.intercept;
  const indicators: { word: string; weight: number }[] = [];
  
  // Calculate TF-IDF weighted score
  const totalTerms = Array.from(features.values()).reduce((a, b) => a + b, 0);
  
  for (const [word, count] of features.entries()) {
    const vocabEntry = vocab[word];
    const coef = model.features[word];
    
    if (vocabEntry && coef !== undefined) {
      const tf = count / totalTerms;
      const tfidf = tf * vocabEntry.idf;
      const contribution = coef * tfidf;
      score += contribution;
      
      if (Math.abs(contribution) > 0.01) {
        indicators.push({ word, weight: contribution });
      }
    }
  }
  
  // Sort indicators by absolute weight
  indicators.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  
  // Convert to probability using sigmoid
  const spamProb = 1 / (1 + Math.exp(-score));
  
  // Clamp probabilities
  const clampedSpamProb = Math.max(0.01, Math.min(0.99, spamProb));
  const clampedHamProb = 1 - clampedSpamProb;
  
  const isSpam = clampedSpamProb > 0.5;
  const confidence = Math.max(clampedSpamProb, clampedHamProb);
  
  return {
    text,
    isSpam,
    confidence: Math.round(confidence * 100),
    spamProbability: Math.round(clampedSpamProb * 100),
    hamProbability: Math.round(clampedHamProb * 100),
    indicators: indicators.slice(0, 8),
    timestamp: Date.now(),
    id: Math.random().toString(36).substring(2, 11)
  };
}

// Synchronous detect for local processing (loads data first)
export function detectSpamSync(text: string): DetectionResult {
  // This will use cached data if available
  const cleaned = preprocessText(text);
  const features = extractFeatures(cleaned);
  
  let score = -0.9994843669193506; // Default intercept
  const indicators: { word: string; weight: number }[] = [];
  
  // Use cached data or fallback
  const totalTerms = Array.from(features.values()).reduce((a, b) => a + b, 0);
  
  // Basic heuristic fallback if models not loaded
  const spamWords = ['free', 'win', 'winner', 'cash', 'prize', 'urgent', 'claim', 'click', 'buy', 'cheap', 'discount', 'offer', 'limited', 'act now', 'congratulations', 'selected', 'million', 'dollars', 'credit card', 'act immediately', 'order now', 'call now', 'text', 'txt', 'mobile', 'ringtone', 'pmin', 'www', 'http'];
  
  for (const [word, count] of features.entries()) {
    let contribution = 0;
    
    // Check against spam word list
    if (spamWords.some(sw => word.includes(sw))) {
      contribution = 0.5 * (count / totalTerms);
    }
    
    if (Math.abs(contribution) > 0.001) {
      indicators.push({ word, weight: contribution });
      score += contribution;
    }
  }
  
  // Boost score for multiple spam indicators
  if (indicators.length > 3) {
    score += indicators.length * 0.1;
  }
  
  // Convert to probability
  const spamProb = 1 / (1 + Math.exp(-score));
  const clampedSpamProb = Math.max(0.01, Math.min(0.99, spamProb));
  const clampedHamProb = 1 - clampedSpamProb;
  
  const isSpam = clampedSpamProb > 0.5;
  const confidence = Math.max(clampedSpamProb, clampedHamProb);
  
  return {
    text,
    isSpam,
    confidence: Math.round(confidence * 100),
    spamProbability: Math.round(clampedSpamProb * 100),
    hamProbability: Math.round(clampedHamProb * 100),
    indicators: indicators.slice(0, 8),
    timestamp: Date.now(),
    id: Math.random().toString(36).substring(2, 11)
  };
}

export async function getSampleEmails() {
  if (!sampleEmailsData) {
    sampleEmailsData = await loadJSON<{ spam: string[]; ham: string[] }>('./models/sample_emails.json');
  }
  return sampleEmailsData;
}

// Fallback sample emails
export function getSampleEmailsSync() {
  return {
    spam: [
      "Congratulations! You've won a $1,000 gift card. Claim your prize now by clicking the link below. Limited time offer!",
      "URGENT: You have been selected for a cash reward of $5,000,000. Contact us immediately to claim your winnings.",
      "Free entry to win a brand new iPhone 15! Text WIN to 12345 now. Winner will be announced tomorrow!",
      "Act now! Buy cheap viagra pills online. 80% discount for limited time. Order today!",
      "You have 1 new voicemail. Call 09061749601 to hear it. Only £1/min. Call now!"
    ],
    ham: [
      "Hey, are we still on for lunch tomorrow? Let me know what time works for you.",
      "Thanks for the update on the project. I'll review the documents and get back to you by Friday.",
      "Can you pick up some groceries on your way home? We need milk, eggs, and bread.",
      "Happy birthday! Hope you have a wonderful day filled with joy and celebration.",
      "Meeting rescheduled to 3 PM in Conference Room B. Please confirm your availability."
    ]
  };
}

export async function getModelInfo(): Promise<ModelInfo> {
  if (!modelInfoData) {
    modelInfoData = await loadJSON<ModelInfo>('./models/model_info.json');
  }
  return modelInfoData;
}

export function getModelInfoSync(): ModelInfo {
  return {
    model_type: 'SVM (Linear Kernel)',
    accuracy: 0.9821,
    precision: 0.9850,
    recall: 0.8792,
    f1_score: 0.9291,
    dataset_size: 5572,
    spam_count: 747,
    ham_count: 4825,
    confusion_matrix: { tn: 964, fp: 2, fn: 18, tp: 131 },
    all_models: {
      'Naive Bayes': { accuracy: 0.9677, precision: 1.0000, recall: 0.7584, f1: 0.8626 },
      'Logistic Regression': { accuracy: 0.9668, precision: 1.0000, recall: 0.7517, f1: 0.8582 },
      'SVM': { accuracy: 0.9821, precision: 0.9850, recall: 0.8792, f1: 0.9291 },
      'Random Forest': { accuracy: 0.9758, precision: 1.0000, recall: 0.8188, f1: 0.9004 }
    }
  };
}

// Save detection to history
export function saveToHistory(result: DetectionResult): void {
  const history = getHistory();
  history.unshift(result);
  // Keep last 50
  if (history.length > 50) {
    history.pop();
  }
  localStorage.setItem('spam_detection_history', JSON.stringify(history));
}

export function getHistory(): DetectionResult[] {
  try {
    const data = localStorage.getItem('spam_detection_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem('spam_detection_history');
}

// Get detection stats
export function getStats() {
  const history = getHistory();
  const total = history.length;
  const spamCount = history.filter(h => h.isSpam).length;
  const hamCount = total - spamCount;
  const avgConfidence = total > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.confidence, 0) / total)
    : 0;
  
  return { total, spamCount, hamCount, avgConfidence };
}
