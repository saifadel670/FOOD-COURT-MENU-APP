/**
 * Main Application Controller (app.js)
 * * Entry point for the client-side JavaScript application.
 * Coordinates fetching, rendering, and event handling.
 */
import { appConfig } from './appConfig.js';
import { menuService } from './MenuService.js';
import { menuRenderer } from './menuRenderer.js';

// Attach menuRenderer globally so HTML events (oninput) can access it
// We use 'window.menuRenderer' for the HTML attribute (oninput="menuRenderer.filterMenu()")
window.menuRenderer = menuRenderer;

const App = {
    // Store the fetched data structure globally for easy access by other modules
    restaurants: [],
    
    // Store the ID of the currently selected restaurant tab
    selectedRestaurantId: null,

    /**
     * Initializes the application.
     * 1. Sets UI static text.
     * 2. Renders shimmer effect.
     * 3. Fetches data.
     * 4. Renders tabs and initial menu.
     */
    init: async function() {
        this.setStaticUI();
        
        // 2. Start shimmer immediately
        menuRenderer.renderShimmer(appConfig.SHIMMER_COUNT);
        
        // 3. Fetch data
        const data = await menuService.fetchMenuData();

        if (Object.keys(data.restaurants).length === 0) {
            menuRenderer.renderError('Failed to Load Menu', appConfig.API_ERROR_MESSAGE);
            return;
        }

        this.restaurants = data.restaurants;
        this.determineInitialSelection()
        this.renderTabs();
        
    },

    /**
     * Sets the static text content from appConfig.
     */
    setStaticUI: function() {
        document.getElementById('app-title').textContent = appConfig.APP_TITLE;
        document.getElementById('app-subtitle').textContent = appConfig.APP_SUBTITLE;
        document.getElementById('search-input').placeholder = appConfig.SEARCH_PLACEHOLDER;
    },

    determineInitialSelection: function() {
        const firstId = this.restaurants[0]?.id;
        this.selectedRestaurantId = parseInt(firstId);
        this.renderMenu(this.selectedRestaurantId);
    },
    


    /**
     * Renders the scrollable restaurant tabs.
     */
    renderTabs: function() {
        const tabsContainer = document.getElementById('tabs-container');
        tabsContainer.innerHTML = '';
        
        this.restaurants.forEach(item => {
            const isActive = parseInt(item.id) === (this.selectedRestaurantId || 1);
            
            const tabButton = document.createElement('button');
            tabButton.className = `tab-button ${isActive ? 'active' : ''}`;
            tabButton.textContent = item.name || 'N/A';
            tabButton.dataset.id = item.id;
            tabButton.onclick = () => this.handleTabClick(parseInt(item.id));
            
            tabsContainer.appendChild(tabButton);
            
            // Scroll the active tab into view on initial load
            if (isActive) {
                setTimeout(() => tabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
            }
        });
    },

    /**
     * Handles the tab click event, switching the active menu view.
     * @param {number} id - The ID of the clicked restaurant.
     */
    handleTabClick: function(id) {
        if (this.selectedRestaurantId === id) return;

        this.selectedRestaurantId = id;

        // Reset search input when switching tabs
        document.getElementById('search-input').value = '';

        // Update active class
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.id) === id) {
                btn.classList.add('active');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        this.renderMenu(id);
    },

    /**
     * Renders the menu items filtered by the selected restaurant ID.
     * @param {number} restaurantId - The ID of the restaurant whose menu to show.
     */
    renderMenu: function(restaurantId) {
        const filteredItems = this.restaurants.filter(item => item.id === restaurantId);
        const menu = filteredItems[0]?.items || []
        menuRenderer.renderMenuItems(menu);
    }
};

// Start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
