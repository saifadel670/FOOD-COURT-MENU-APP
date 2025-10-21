/**
 * Main Application Controller (app.js)
 * * Entry point for the client-side JavaScript application.
 * Coordinates fetching, rendering, and event handling.
 */
import { appConfig } from './appConfig.js';
import { menuService } from './menuService.js';
import { menuRenderer } from './menuRenderer.js';

window.menuRenderer = menuRenderer; // Expose globally for inline events

const App = {
    restaurants: [],
    selectedRestaurantSlug: null,
    isSearching: false,

    /**
     * Initialize the app on load.
     */
    async init() {
        this.setStaticUI();
        menuRenderer.renderShimmer(appConfig.SHIMMER_COUNT);

        try {
            const data = await menuService.fetchMenuData();
            const menus = data?.data?.menus || [];

            if (!menus.length) {
                return menuRenderer.renderError('Failed to Load Menu', appConfig.EMPTY_DATA_ERROR_MESSAGE);
            }

            this.setBanner(data.data.banner);
            this.restaurants = this.groupMenusByRestaurant(menus);
            this.selectedRestaurantSlug = this.restaurants[0]?.slug || null;

            this.renderTabs();
            this.renderMenu(this.selectedRestaurantSlug);
        } catch (err) {
            this.clearUI()
            menuRenderer.renderError('Service Unavailable', appConfig.API_ERROR_MESSAGE);
        }
    },


    clearUI() {
        document.querySelector('.header-bg')?.remove();
        document.querySelector('.search-bar-container')?.remove();
        document.querySelector('tabs-container')?.remove();
    },


    /**
     * Group all menu items by restaurant slug.
     * @param {Array<Object>} menus
     */
    groupMenusByRestaurant(menus) {
        const grouped = menus.reduce((acc, item) => {
            const slug = item.restaurant_slug || 'unknown';
            if (!acc[slug]) {
                acc[slug] = {
                    slug,
                    name: item.restaurant_name || 'Unknown Restaurant',
                    items: [],
                };
            }
            acc[slug].items.push({
                title: item.name,
                description: item.description,
                price: item.price,
                image: item.icon,
                tags: item.tags,
            });
            return acc;
        }, {});

        return Object.values(grouped);
    },

    /**
     * Dynamically set the restaurant banner image.
     * @param {string} bannerUrl
     */
    setBanner(bannerUrl) {
        const url = bannerUrl;
        if (!url) {
            document.querySelector('.header-bg')?.remove();
            return;
        }

        const header = document.querySelector('.header-bg');
        const title = document.getElementById('app-title');
        const subtitle = document.getElementById('app-subtitle');

        const img = new Image();
        img.onload = () => {
            header.style.background = `url('${url}') center/cover no-repeat`;
            title.style.display = subtitle.style.display = 'none';
        };
        img.onerror = () => {
            title.style.display = subtitle.style.display = 'block';
            console.warn('Banner image failed to load. Default styling kept.');
        };

        img.src = url;
    },

    /**
     * Set static UI text and placeholders from config.
     */
    setStaticUI() {
        const { APP_TITLE, APP_SUBTITLE, SEARCH_PLACEHOLDER } = appConfig;
        document.getElementById('app-title').textContent = APP_TITLE;
        document.getElementById('app-subtitle').textContent = APP_SUBTITLE;
        document.getElementById('search-input').placeholder = SEARCH_PLACEHOLDER;
    },

    /**
     * Render horizontal restaurant tabs.
     */
    renderTabs() {
        const container = document.getElementById('tabs-container');
        container.innerHTML = '';

        this.restaurants.forEach(r => {
            const isActive = r.slug === this.selectedRestaurantSlug;
            const btn = document.createElement('button');

            btn.className = `tab-button ${isActive ? 'active' : ''}`;
            btn.textContent = r.name;
            btn.onclick = () => this.onTabSelect(r.slug);

            container.appendChild(btn);
            if (isActive) {
                queueMicrotask(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
            }
        });
    },

    /**
     * Handles tab switching.
     * @param {string} slug
     */
    onTabSelect(slug) {
        if (this.selectedRestaurantSlug === slug) return;

        this.selectedRestaurantSlug = slug;
        document.getElementById('search-input').value = '';

        this.renderTabs();
        this.renderMenu(slug);
    },

    /**
     * Render menu items of the selected restaurant.
     * @param {string} restaurantSlug
     */
    renderMenu(restaurantSlug) {
        const restaurant = this.restaurants.find(r => r.slug === restaurantSlug);
        menuRenderer.renderMenuItems(restaurant?.items || []);
    },

    /**
     * Enable search mode.
     */
    enterSearchMode() {
        this.isSearching = true;
        const appContainer = document.querySelector('.app-container');
        const backButton = document.getElementById('back-button');
        const searchInput = document.getElementById('search-input');

        appContainer.classList.add('search-active');
        backButton.style.display = 'flex';
        searchInput.value = '';

        menuRenderer.renderMenuItems([]); // clear
    },

    /**
     * Exit search mode and restore previous state.
     */
    exitSearchMode() {
        this.isSearching = false;
        const appContainer = document.querySelector('.app-container');
        const backButton = document.getElementById('back-button');
        const searchInput = document.getElementById('search-input');

        appContainer.classList.remove('search-active');
        backButton.style.display = 'none';
        searchInput.value = '';
        searchInput.blur();

        const restaurant = this.restaurants.find(r => r.slug === this.selectedRestaurantSlug);
        menuRenderer.renderMenuItems(restaurant?.items || []);
    },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
