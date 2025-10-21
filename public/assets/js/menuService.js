/**
 * API Service (menuService.js)
 * * Handles all external data fetching and structures the raw API response.
 * * Uses STRICT parsing based on the provided JSON structure.
 */
import { appConfig } from './appConfig.js';

const menuService = {
  fetchMenuData: async function() {
    try {
      const path = window.location.pathname;
      let apiUrl = appConfig.API_URL;

      // Check if path matches /food-courts/{id}
      const match = path.match(/^\/food-courts\/([a-zA-Z0-9_-]+)\/?$/);
      if (match) {
        const id = match[1];
        apiUrl = `${appConfig.API_URL}/${id}`;
      }

      console.log(`DEBUG: Fetching from URL: ${apiUrl}`);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const rawData = await response.json();
      return rawData

    } catch (error) {
      console.error("Fetch API Error:", error);
      throw error;
    }
  }
};

export { menuService };
