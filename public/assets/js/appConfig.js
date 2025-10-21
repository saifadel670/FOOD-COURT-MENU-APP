/**
 * Application Configuration (appConfig.js)
 * * Contains static configuration values, including API endpoints and UI text.
 * Note: Uses a named export (appConfig) to avoid module binding errors.
 */
const appConfig = {
    // API Endpoint
    API_URL: 'https://api.hariken.xyz/food-court-by-slug',
    
    // UI Text
    APP_TITLE: 'Digital Food Court',
    APP_SUBTITLE: 'Taste the Variety',
    SEARCH_PLACEHOLDER: 'Search menu items...',
    
    // UI Settings
    SHIMMER_COUNT: 5, // Number of shimmer cards to display during loading
    
    // Error Handling
    EMPTY_DATA_ERROR_MESSAGE: "No menu items available at the moment. Please check back later.",
    API_ERROR_MESSAGE: 'We’re having some trouble right now. Please check your internet connection or try again shortly.',
};

export { appConfig };
