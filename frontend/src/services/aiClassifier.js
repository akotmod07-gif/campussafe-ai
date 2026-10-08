/**
 * CampusSafe AI - Client Emergency Classifier Engine
 * Rule-based emergency classification with keyword weighting, confidence scoring,
 * and explanation generation. Ready for AI API plug-in.
 */

export const RULES = [
  {
    category: 'Fire',
    severity: 'Critical',
    priority: 'Immediate',
    baseConfidence: 0.98,
    keywords: [
      'fire', 'smoke', 'burning', 'flames', 'explosion', 'gas leak',
      'sparking', 'smell of burning', 'blaze', 'chemical smell',
    ],
  },
  {
    category: 'Medical',
    severity: 'Critical',
    priority: 'Immediate',
    baseConfidence: 0.96,
    keywords: [
      'unconscious', 'bleeding', 'chest pain', 'medical', 'collapsed',
      'fainted', 'breathing', 'heart attack', 'seizure', 'choking', 'convulsion',
    ],
  },
  {
    category: 'Accident',
    severity: 'High',
    priority: 'Urgent',
    baseConfidence: 0.92,
    keywords: [
      'accident', 'injured', 'crash', 'collision', 'hit', 'fallen',
      'fracture', 'bike accident', 'shuttle crash', 'stairs fall',
    ],
  },
  {
    category: 'Harassment',
    severity: 'High',
    priority: 'Urgent',
    baseConfidence: 0.94,
    keywords: [
      'harassment', 'threatening', 'stalking', 'stalker', 'assault',
      'violence', 'harassed', 'following me', 'intimidation', 'catcall', 'fight',
    ],
  },
  {
    category: 'Theft',
    severity: 'Medium',
    priority: 'Normal',
    baseConfidence: 0.88,
    keywords: [
      'stolen', 'theft', 'missing', 'robbery', 'burgled', 'lost wallet',
      'laptop stolen', 'pickpocket', 'phone missing', 'bag stolen',
    ],
  },
  {
    category: 'Unsafe Area',
    severity: 'Medium',
    priority: 'Normal',
    baseConfidence: 0.86,
    keywords: [
      'dark area', 'unsafe', 'suspicious', 'broken light', 'streetlight off',
      'trespasser', 'isolated', 'flickering light', 'prowler', 'vandalism',
    ],
  },
];

/**
 * Live classification function
 * @param {string} text - User typed description
 * @returns {Object} { category, severity, priority, confidence, matchedKeywords, explanation }
 */
export function classifyEmergencyText(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const clean = text.toLowerCase();
  let bestRule = null;
  let highestScore = 0;
  let matchedKeywords = [];

  for (const rule of RULES) {
    const hits = rule.keywords.filter(kw => clean.includes(kw));

    if (hits.length > 0) {
      // Score calculation based on number of hits and urgency
      const score = hits.length * 10 + (rule.severity === 'Critical' ? 5 : 2);
      if (score > highestScore) {
        highestScore = score;
        bestRule = rule;
        matchedKeywords = hits;
      }
    }
  }

  if (bestRule) {
    const boost = Math.min((matchedKeywords.length - 1) * 0.02, 0.03);
    const confidence = Math.min(bestRule.baseConfidence + boost, 0.99);

    return {
      category: bestRule.category,
      severity: bestRule.severity,
      priority: bestRule.priority,
      confidence: Math.round(confidence * 100),
      matchedKeywords,
      explanation: `AI detected keywords: [${matchedKeywords.join(', ')}]. Suggested classification is ${bestRule.category} with ${bestRule.severity} severity and ${bestRule.priority} dispatch priority.`,
    };
  }

  // Fallback for unrecognized keywords
  if (text.trim().length >= 10) {
    return {
      category: 'Other',
      severity: 'Medium',
      priority: 'Normal',
      confidence: 65,
      matchedKeywords: [],
      explanation: 'General incident detected. Standard review priority assigned.',
    };
  }

  return null;
}
