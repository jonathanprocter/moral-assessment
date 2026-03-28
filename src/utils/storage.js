// LocalStorage and SessionStorage utilities
import { storageKeys } from '../constants/config.js';

const PROGRESS_EXPIRY_DAYS = 7;

/**
 * Save progress to localStorage
 * @param {Object} responses - Current responses
 * @param {number} currentQuestion - Current question index
 */
export const saveProgress = (responses, currentQuestion) => {
  try {
    const data = {
      responses,
      currentQuestion,
      lastUpdated: Date.now()
    };
    localStorage.setItem(storageKeys.progress, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save progress:', error);
    return false;
  }
};

/**
 * Load progress from localStorage
 * @returns {Object|null} Saved progress or null
 */
export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(storageKeys.progress);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Check if data is less than 7 days old
    const age = Date.now() - data.lastUpdated;
    const maxAge = PROGRESS_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (age > maxAge) {
      clearProgress();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
};

/**
 * Clear saved progress
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(storageKeys.progress);
    return true;
  } catch (error) {
    console.error('Failed to clear progress:', error);
    return false;
  }
};

/**
 * Save completed results to localStorage
 * @param {Object} results - Complete results object
 */
export const saveResults = (results) => {
  try {
    const data = {
      ...results,
      completedAt: Date.now()
    };
    localStorage.setItem(storageKeys.results, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save results:', error);
    return false;
  }
};

/**
 * Load saved results from localStorage
 * @returns {Object|null} Saved results or null
 */
export const loadResults = () => {
  try {
    const saved = localStorage.getItem(storageKeys.results);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load results:', error);
    return null;
  }
};

/**
 * Save API key to sessionStorage (never localStorage)
 * @param {string} provider - 'openai' or 'anthropic'
 * @param {string} apiKey - API key
 */
export const saveApiKey = (provider, apiKey) => {
  try {
    const key = `${storageKeys.apiKey}_${provider}`;
    sessionStorage.setItem(key, apiKey);
    return true;
  } catch (error) {
    console.error('Failed to save API key:', error);
    return false;
  }
};

/**
 * Load API key from sessionStorage
 * @param {string} provider - 'openai' or 'anthropic'
 * @returns {string|null} API key or null
 */
export const loadApiKey = (provider) => {
  try {
    const key = `${storageKeys.apiKey}_${provider}`;
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error('Failed to load API key:', error);
    return null;
  }
};

/**
 * Clear API key from sessionStorage
 * @param {string} provider - 'openai' or 'anthropic'
 */
export const clearApiKey = (provider) => {
  try {
    const key = `${storageKeys.apiKey}_${provider}`;
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear API key:', error);
    return false;
  }
};

/**
 * Clear all stored data
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(storageKeys.progress);
    localStorage.removeItem(storageKeys.results);
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Failed to clear all data:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};
