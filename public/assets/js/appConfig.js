/**
 * Application Configuration (appConfig.js)
 * * Contains static configuration values, including API endpoints and UI text.
 * Note: Uses a named export (appConfig) to avoid module binding errors.
 */
const appConfig = {
    // API Endpoint
    API_URL: 'https://mocki.io/v1/f958305b-2055-4d4b-97b4-c4b7eb870334',

    defaultBanner: '/assets/images/default-banner.jpg',
    
    // UI Text
    APP_TITLE: 'Food Court Central',
    APP_SUBTITLE: 'Taste the Variety',
    SEARCH_PLACEHOLDER: 'Search menu items...',
    
    // UI Settings
    SHIMMER_COUNT: 5, // Number of shimmer cards to display during loading
    
    // Error Handling
    API_ERROR_MESSAGE: 'Could not connect to the menu server. Please check your connection.',
};

export { appConfig };
