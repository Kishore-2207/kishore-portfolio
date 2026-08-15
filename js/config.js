/* ==========================================================================
   GLOBAL APP CONFIGURATIONS (config.js)
   Centralized constants, token configurations, and caching thresholds.
   ========================================================================== */

export const CONFIG = {
  // Personal Details
  github: {
    username: 'Kishore-2207', // GitHub username to query API statistics
    cacheDuration: 6 * 60 * 60 * 1000 // 6 hours cache time (in milliseconds)
  },

  // Web3Forms API Integration for Contact Form
  web3forms: {
    accessKey: '35c0be39-9ae2-4d24-b31f-43bf9e794333' // Replace with valid Web3Forms Access Key
  },

  // Local File Configurations
  data: {
    filePath: './portfolio.json',
    cacheKey: 'kishore_portfolio_cache_v25',
    cacheDuration: 24 * 60 * 60 * 1000 // 24 hours cache time (in milliseconds)
  },

  // UI Toast Preferences
  ui: {
    toastDuration: 4500, // Duration (ms) a toast notification remains visible
    scrollRevealOffset: 80 // Intersection observer triggering offset
  }
};
