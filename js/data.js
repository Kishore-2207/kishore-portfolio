/* ==========================================================================
   DATA MANAGER SERVICE SKELETON (data.js)
   ========================================================================== */

/**
 * Fetches portfolio content database configuration.
 * @returns {Promise<Object|null>} Resolved portfolio data.
 */
export async function fetchPortfolioData() {
  try {
    const response = await fetch('./portfolio.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return null;
  }
}
