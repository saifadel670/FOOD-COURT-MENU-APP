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
    restaurants: [],         // [{ slug, name, items: [] }]
    selectedRestaurantSlug: null,
    isSearching: false,

    init: async function() {
        this.setStaticUI();

        // Show shimmer while loading
        menuRenderer.renderShimmer(appConfig.SHIMMER_COUNT);

        // Fetch API
        const data = await menuService.fetchMenuData();

        // Handle empty response
        if (!data?.data?.menus || data.data.menus.length === 0) {
            menuRenderer.renderError('Failed to Load Menu', appConfig.API_ERROR_MESSAGE);
            return;
        }

        // Set banner
        this.setBanner(data.data.banner);

        // Group menus by restaurant_slug
        const grouped = {};
        data.data.menus.forEach(item => {
            const slug = item.restaurant_slug || 'unknown';
            if (!grouped[slug]) {
                grouped[slug] = {
                    slug: slug,
                    name: item.restaurant_name || 'Unknown',
                    items: []
                };
            }
            grouped[slug].items.push({
                title: item.name,
                description: item.description,
                price: item.price,
                image: item.icon,
                tags: item.tags
            });
        });

        this.restaurants = Object.values(grouped);

        // Select first restaurant initially
        this.selectedRestaurantSlug = this.restaurants[0]?.slug || null;

        // Render tabs & initial menu
        this.renderTabs();
        this.renderMenu(this.selectedRestaurantSlug);
    },

    setBanner: function(bannerUrl) {
        const url = bannerUrl || appConfig.defaultBanner;
        const header = document.querySelector('.header-bg');
        const title = document.getElementById('app-title');
        const subtitle = document.getElementById('app-subtitle');
        const img = new Image();
        img.onload = () => {
            // Only set background if image loads successfully
            header.style.backgroundImage = `url('${url}')`;
            header.style.backgroundSize = 'cover';
            header.style.backgroundPosition = 'center';
            title.style.display = 'none';
            subtitle.style.display = 'none';
        };
        img.onerror = () => {
            title.style.display = 'block';
            subtitle.style.display = 'block';
            console.warn('Banner image failed to load. CSS design remains intact.');
        };
    
        img.src = url;
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
        const container = document.getElementById('tabs-container');
        container.innerHTML = '';
        this.restaurants.forEach(r => {
            const isActive = r.slug === this.selectedRestaurantSlug;
            const btn = document.createElement('button');
            btn.className = `tab-button ${isActive ? 'active' : ''}`;
            btn.textContent = r.name;
            btn.onclick = () => {
                this.selectedRestaurantSlug = r.slug;
                document.getElementById('search-input').value = '';
                this.renderTabs();
                this.renderMenu(r.slug);
            };
            container.appendChild(btn);

            if (isActive) {
                setTimeout(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
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
    renderMenu: function(restaurantSlug) {
        const restaurant = this.restaurants.find(r => r.slug === restaurantSlug);
        const menu = restaurant?.items || [];
        menuRenderer.renderMenuItems(menu);
    },

    enterSearchMode: function () {
        this.isSearching = true;

        const appContainer = document.querySelector('.app-container');
        const backButton = document.getElementById('back-button');
        const searchInput = document.getElementById('search-input');

        appContainer.classList.add('search-active');
        backButton.style.display = 'flex';
        searchInput.value = '';

        // Show empty menu when entering search
        menuRenderer.renderMenuItems([]);
    },
    
    exitSearchMode: function() {
        this.isSearching = false;
    
        const appContainer = document.querySelector('.app-container');
        const backButton = document.getElementById('back-button');
        const searchInput = document.getElementById('search-input');
    
        appContainer.classList.remove('search-active');
        backButton.style.display = 'none';
        searchInput.value = '';
        searchInput.blur();
    
        // Restore selected tab menu
        const restaurant = this.restaurants.find(r => r.slug === this.selectedRestaurantSlug);
        menuRenderer.renderMenuItems(restaurant?.items || []);
    }
    
};

// Start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;