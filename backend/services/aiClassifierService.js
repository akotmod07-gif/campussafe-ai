/**
 * CampusSafe AI - Emergency Incident Classifier Service
 * Rule-based classification engine structured for seamless drop-in replacement
 * with LLM / OpenAI / Gemini API endpoints.
 */

const RULES = [
  {
    category: 'Fire',
    severity: 'Critical',
    priority: 'Immediate',
    baseConfidence: 0.96,
    keywords: ['fire', 'smoke', 'burning', 'explosion', 'gas leak', 'flames', 'blaze', 'sparking', 'chemical spill'],
  },
  {
    category: 'Medical',
    severity: 'Critical',
    priority: 'Immediate',
    baseConfidence: 0.95,
    keywords: ['unconscious', 'bleeding', 'chest pain', 'medical', 'collapsed', 'heart attack', 'breathing', 'seizure', 'fainted', 'asthma', 'head injury'],
  },
  {
    category: 'Accident',
    severity: 'High',
    priority: 'Urgent',
    baseConfidence: 0.91,
    keywords: ['accident', 'injured', 'crash', 'collision', 'fallen', 'hit by vehicle', 'bike accident', 'fracture', 'slip', 'stairs fall'],
  },
  {
    category: 'Harassment',
    severity: 'High',
    priority: 'Urgent',
    baseConfidence: 0.93,
    keywords: ['harassment', 'threatening', 'stalking', 'stalker', 'assault', 'violence', 'harassed', 'following me', 'intimidation', 'catcalling', 'fight'],
  },
  {
    category: 'Theft',
    severity: 'Medium',
    priority: 'Normal',
    baseConfidence: 0.88,
    keywords: ['stolen', 'theft', 'missing', 'robbery', 'robbed', 'burgled', 'pickpocket', 'wallet stolen', 'laptop missing', 'bag gone'],
  },
  {
    category: 'Unsafe Area',
    severity: 'Medium',
    priority: 'Normal',
    baseConfidence: 0.85,
    keywords: ['dark area', 'unsafe', 'suspicious', 'broken light', 'street light off', 'trespasser', 'isolated', 'vandalism', 'open manhole', 'hazard'],
  },
];

/**
 * Classifies the incident description
 * @param {string} text - The incident description or title
 * @returns {Object} { category, severity, priority, confidence, matchedKeywords, explanation }
 */
function classifyIncident(text) {
  if (!text || typeof text !== 'string') {
    return {
      category: 'Other',
      severity: 'Low',
      priority: 'Low',
      confidence: 0.5,
      matchedKeywords: [],
      explanation: 'No incident description provided for analysis.',
    };
  }

  const cleanText = text.toLowerCase();
  let bestMatch = null;
  let maxKeywordScore = 0;
  let detectedKeywords = [];

  for (const rule of RULES) {
    const matched = rule.keywords.filter(keyword => {
      // Regex check for word boundaries or phrase
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
      return pattern.test(cleanText) || cleanText.includes(keyword);
    });

    if (matched.length > 0) {
      const score = matched.length * 10 + (rule.severity === 'Critical' ? 5 : 0);
      if (score > maxKeywordScore) {
        maxKeywordScore = score;
        bestMatch = rule;
        detectedKeywords = matched;
      }
    }
  }

  if (bestMatch) {
    const confidenceBoost = Math.min(detectedKeywords.length * 0.02, 0.04);
    const confidence = Math.min(bestMatch.baseConfidence + confidenceBoost, 0.99);

    return {
      category: bestMatch.category,
      severity: bestMatch.severity,
      priority: bestMatch.priority,
      confidence: Number(confidence.toFixed(2)),
      matchedKeywords: detectedKeywords,
      explanation: `Identified keywords [${detectedKeywords.join(', ')}] indicative of a ${bestMatch.category} event. Assigned ${bestMatch.severity} severity with ${bestMatch.priority} response priority.`,
    };
  }

  // Fallback if no specific trigger keywords found
  return {
    category: 'Other',
    severity: 'Medium',
    priority: 'Normal',
    confidence: 0.65,
    matchedKeywords: [],
    explanation: 'General incident detected. Human assessment recommended.',
  };
}

module.exports = { classifyIncident, RULES };
