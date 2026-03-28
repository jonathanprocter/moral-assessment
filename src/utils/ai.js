// AI API integration utilities
import { questions } from '../data/questions.js';
import { foundationNames, averageScores } from '../constants/normativeData.js';

/**
 * Generate AI prompt for moral foundations analysis
 * @param {Object} scores - Foundation scores
 * @param {Object} responses - All question responses
 * @param {Object} catchQuestionStatus - Catch question validation
 * @returns {string} Formatted prompt
 */
export const generateAIPrompt = (scores, responses, catchQuestionStatus) => {
  const responseDetails = questions
    .filter(q => !q.catch)
    .map(q => `Q${q.id}: "${q.text}" - Response: ${responses[q.id]}`)
    .join('\n');
  
  return `You are an expert in moral psychology and Jonathan Haidt's Moral Foundations Theory. Analyze the following MFQ-30 results and provide personalized insights.

## Participant's Scores (0-30 scale):
- ${foundationNames.care}: ${scores.care} (Average: ${averageScores.care})
- ${foundationNames.fairness}: ${scores.fairness} (Average: ${averageScores.fairness})
- ${foundationNames.loyalty}: ${scores.loyalty} (Average: ${averageScores.loyalty})
- ${foundationNames.authority}: ${scores.authority} (Average: ${averageScores.authority})
- ${foundationNames.sanctity}: ${scores.sanctity} (Average: ${averageScores.sanctity})

## Attention Check Status: ${catchQuestionStatus.valid ? 'PASSED' : 'WARNING'}
${catchQuestionStatus.warnings.length > 0 ? '\nWarnings: ' + catchQuestionStatus.warnings.join(' ') : ''}

## Detailed Responses:
${responseDetails}

Please provide:

1. **Profile Summary** (2-3 paragraphs): An overall characterization of this person's moral psychology, what drives their sense of right and wrong, and how they likely approach ethical dilemmas.

2. **Notable Patterns** (3-5 bullet points): Highlight any particularly interesting combinations, contrasts between foundations, or scores that stand out.

3. **Potential Blind Spots** (2-3 points): Areas where this profile might lead to misunderstanding others with different moral foundations.

4. **Strengths** (2-3 points): Moral strengths suggested by this profile.

5. **Reflection Questions** (3 questions): Thoughtful questions for the person to consider based on their profile.

Keep your analysis warm, non-judgmental, and psychologically informed. Avoid political labeling. Focus on helping the person understand themselves and others better.`;
};

/**
 * Call OpenAI API
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - OpenAI API key
 * @param {string} model - Model identifier
 * @returns {Promise<string>} AI response
 */
export const callOpenAI = async (prompt, apiKey, model = 'gpt-4o') => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert in moral psychology and Moral Foundations Theory. Provide insightful, non-judgmental analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

/**
 * Call Anthropic API
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - Anthropic API key
 * @param {string} model - Model identifier
 * @returns {Promise<string>} AI response
 */
export const callAnthropic = async (prompt, apiKey, model = 'claude-sonnet-4-5-20250929') => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
};

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @param {string} provider - 'openai' or 'anthropic'
 * @returns {boolean} Whether key format is valid
 */
export const validateApiKey = (apiKey, provider) => {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  if (provider === 'openai') {
    return apiKey.startsWith('sk-');
  } else if (provider === 'anthropic') {
    return apiKey.startsWith('sk-ant-');
  }
  
  return false;
};

/**
 * Get AI insights
 * @param {Object} params - Parameters object
 * @returns {Promise<string>} AI-generated insights
 */
export const getAIInsights = async ({ scores, responses, catchQuestionStatus, provider, apiKey, model }) => {
  // Validate API key
  if (!validateApiKey(apiKey, provider)) {
    throw new Error('Invalid API key format');
  }
  
  // Generate prompt
  const prompt = generateAIPrompt(scores, responses, catchQuestionStatus);
  
  // Call appropriate API
  if (provider === 'openai') {
    return await callOpenAI(prompt, apiKey, model);
  } else if (provider === 'anthropic') {
    return await callAnthropic(prompt, apiKey, model);
  } else {
    throw new Error('Invalid provider');
  }
};
