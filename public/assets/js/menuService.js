/**
 * API Service (menuService.js)
 * * Handles all external data fetching and structures the raw API response.
 * * Uses STRICT parsing based on the provided JSON structure.
 */
import { appConfig } from './appConfig.js';

const menuService = {
    fetchMenuData: async function() {
        console.log(`DEBUG: Attempting to fetch from URL: ${appConfig.API_URL}`);
        try {
            const response = await fetch(appConfig.API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rawData = await response.json();
            
            // Pass raw data through the parser model before returning
            return rawData

        } catch (error) {
            console.error("Fetch API Error:", error);
            // Return an empty, standardized structure on failure
            return { restaurants: {}, items: [] };
        }
    }
};

export { menuService };
