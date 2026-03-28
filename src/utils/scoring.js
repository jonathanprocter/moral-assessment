// MFQ-30 Scoring Algorithm - Verified from official specification
// Questions 6 and 22 are catch questions and NOT included in scoring

import { questions } from '../data/questions.js';
import { averageScores, scoreThresholds } from '../constants/normativeData.js';

// Scoring key: which questions measure each foundation
export const scoringKey = {
  care: [1, 7, 12, 17, 23, 28],
  fairness: [2, 8, 13, 18, 24, 29],
  loyalty: [3, 9, 14, 19, 25, 30],
  authority: [4, 10, 15, 20, 26, 31],
  sanctity: [5, 11, 16, 21, 27, 32]
};

/**
 * Calculate foundation scores from responses
 * @param {Object} responses - Object with question IDs as keys and responses (0-5) as values
 * @returns {Object} Scores for each foundation (0-30 scale)
 */
export const calculateScores = (responses) => {
  const scores = {};
  
  for (const [foundation, questionIds] of Object.entries(scoringKey)) {
    let sum = 0;
    for (const qId of questionIds) {
      const response = responses[qId];
      if (response !== undefined && response !== null) {
        sum += response;
      }
    }
    scores[foundation] = sum;
  }
  
  return scores;
};

/**
 * Check validity of catch questions
 * @param {Object} responses - Object with question IDs as keys and responses (0-5) as values
 * @returns {Object} Validity status and warnings
 */
export const checkCatchQuestions = (responses) => {
  const q6 = responses[6];
  const q22 = responses[22];
  
  const warnings = [];
  let valid = true;
  
  // Q6 (math question) should be low relevance (ideally 0-2)
  if (q6 !== undefined && q6 > 2) {
    warnings.push("Question 6 (math relevance) received an unexpectedly high rating. This may indicate inattentive responding.");
    valid = false;
  }
  
  // Q22 (good vs bad) should be high agreement (ideally 3-5)
  if (q22 !== undefined && q22 < 3) {
    warnings.push("Question 22 (good vs bad) received an unexpectedly low rating. This may indicate inattentive responding.");
    valid = false;
  }
  
  return {
    valid,
    warnings,
    q6Response: q6,
    q22Response: q22
  };
};

/**
 * Get interpretation level for a score
 * @param {number} score - Foundation score (0-30)
 * @returns {string} 'high', 'moderate', or 'low'
 */
export const getInterpretationLevel = (score) => {
  if (score >= scoreThresholds.high) return 'high';
  if (score >= scoreThresholds.moderate) return 'moderate';
  return 'low';
};

/**
 * Calculate comparison with average scores
 * @param {Object} scores - User's foundation scores
 * @returns {Object} Comparison data
 */
export const compareWithAverage = (scores) => {
  const comparison = {};
  
  for (const [foundation, score] of Object.entries(scores)) {
    const average = averageScores[foundation];
    const difference = score - average;
    const percentDifference = ((difference / average) * 100).toFixed(1);
    
    comparison[foundation] = {
      userScore: score,
      average,
      difference: difference.toFixed(1),
      percentDifference,
      higher: difference > 0
    };
  }
  
  return comparison;
};

/**
 * Get highest and lowest foundations
 * @param {Object} scores - Foundation scores
 * @returns {Object} Highest and lowest foundations
 */
export const getExtremes = (scores) => {
  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);
  
  return {
    highest: {
      foundation: entries[0][0],
      score: entries[0][1]
    },
    lowest: {
      foundation: entries[entries.length - 1][0],
      score: entries[entries.length - 1][1]
    }
  };
};

/**
 * Validate that all required questions are answered
 * @param {Object} responses - Response object
 * @returns {Object} Validation result
 */
export const validateResponses = (responses) => {
  const unanswered = [];
  
  for (let i = 1; i <= 32; i++) {
    if (responses[i] === undefined || responses[i] === null) {
      unanswered.push(i);
    }
  }
  
  return {
    valid: unanswered.length === 0,
    unanswered,
    total: 32,
    answered: 32 - unanswered.length
  };
};

/**
 * Calculate percentile rank (simplified estimation)
 * Based on normal distribution assumption
 * @param {number} score - Foundation score
 * @param {number} average - Average score
 * @returns {number} Estimated percentile (0-100)
 */
export const estimatePercentile = (score, average) => {
  // Simplified percentile estimation
  // Assumes standard deviation of ~5 for each foundation
  const sd = 5;
  const zScore = (score - average) / sd;
  
  // Convert z-score to percentile (approximation)
  const percentile = 50 + (zScore * 19.1);
  
  // Clamp between 1 and 99
  return Math.max(1, Math.min(99, Math.round(percentile)));
};
