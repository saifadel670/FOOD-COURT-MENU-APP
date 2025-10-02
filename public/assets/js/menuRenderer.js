/**
 * Menu Renderer (menuRenderer.js)
 * * Contains all functions responsible for manipulating the DOM and rendering UI components.
 * It is detached from data fetching and filtering logic.
 */
import { appConfig } from './appConfig.js';

// Get the main container where the menu items will be rendered
const menuArea = document.getElementById('menu-area');
const searchInput = document.getElementById('search-input');

// Variable to hold the entire unfiltered menu list for the active tab (used for filtering)
let currentRenderedItems = [];

const menuRenderer = {
    
    /**
     * Renders the shimmer loading effect cards.
     * @param {number} count - The number of shimmer cards to render.
     */
    renderShimmer: function(count) {
        let html = '<div class="shimmer-wrapper">';
        
        for (let i = 0; i < count; i++) {
            html += `
                <div class="shimmer-card">
                    <div class="shimmer-circle"></div>
                    <div class="shimmer-lines">
                        <div class="shimmer-line title"></div>
                        <div class="shimmer-line"></div>
                        <div class="shimmer-line short"></div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        menuArea.innerHTML = html;
    },

    /**
     * Renders the actual menu items for the currently active restaurant.
     * @param {Array<Object>} items - The list of menu items to display.
     */
    renderMenuItems: function(items) {
        // Store the items locally so filterMenu can access them later
        currentRenderedItems = items; 
        
        // Render all items initially
        this.displayItems(items);
    },

    /**
     * Displays a subset of items based on the search filter.
     * Called both by renderMenuItems (initially) and filterMenu (on search input).
     * @param {Array<Object>} items - The list of menu items to display.
     */
    displayItems: function(items) {
        if (items.length === 0) {
            this.renderNoData('No Items Found', 'This restaurant menu is currently empty.');
            return;
        }


        let html = '<div class="menu-list">';
        
        items.forEach(item => {
            html += `
                <div class="menu-item-card">
                    <div class="item-image-container">
                        <img src="${item.image || 'https://placehold.co/80x80/cccccc/333333?text=FOOD'}" 
                             alt="${item.title}" class="item-image" 
                             onerror="this.onerror=null; this.src='https://placehold.co/80x80/cccccc/333333?text=FOOD'">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">${item.title}</h4>
                        <p class="item-description">${item.description}</p>
                    </div>
                    <div class="item-price">৳ ${(item.price || 0).toFixed(0)}</div>
                </div>
            `;
        });
        
        html += '</div>';
        menuArea.innerHTML = html;
    },

    /**
     * Filters the currently displayed items based on the search input value.
     * This function is connected to the HTML <input>'s oninput event.
     */
    filterMenu: function() {
        const query = document.getElementById('search-input').value.toLowerCase().trim();
    
        if (!App.isSearching) return; // only filter when in search mode
    
        if (!query) {
            // empty input → show empty menu during search
            this.renderMenuItems([]);
            return;
        }
    
        // filter across all restaurants
        const groupedResults = App.restaurants.map(r => {
            const matchedItems = r.items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                (item.tags || []).some(tag => tag.toLowerCase().includes(query))
            );
            return { ...r, items: matchedItems };
        }).filter(r => r.items.length > 0);
    
        if (groupedResults.length === 0) {
            this.renderNoData('No Results', `No items found matching "${query}"`);
            return;
        }
    
        // Render grouped results
        let html = '';
        groupedResults.forEach(r => {
            html += `<h3 class="menu-group-title">${r.name}</h3>`;
            html += this.generateItemsHTML(r.items);
        });
        document.getElementById('menu-area').innerHTML = html;
    },
    
    // helper to generate menu HTML (reuse your existing card markup)
    generateItemsHTML: function(items) {
        let html = '<div class="menu-list">';
        items.forEach(item => {
            html += `
                <div class="menu-item-card">
                    <div class="item-image-container">
                        <img src="${item.image || 'https://placehold.co/80x80/cccccc/333333?text=FOOD'}"
                             alt="${item.title}" class="item-image"
                             onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=FOOD'">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">${item.title}</h4>
                        <p class="item-description">${item.description}</p>
                    </div>
                    <div class="item-price">৳ ${(item.price || 0).toFixed(0)}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    /**
     * Renders a generic "No Data" or "Error" message.
     * @param {string} title - The main heading for the message.
     * @param {string} message - Detailed explanation.
     */
    renderNoData: function(title, message) {
        menuArea.innerHTML = `
            <div class="no-data-view">
                <i class="fas fa-utensils"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Renders a specific error message for API failures.
     * @param {string} title - The main heading (e.g., 'Failed to Load Menu').
     * @param {string} message - Detailed error explanation (from appConfig).
     */
    renderError: function(title, message) {
        menuArea.innerHTML = `
            <div class="no-data-view">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }
};

export { menuRenderer };
