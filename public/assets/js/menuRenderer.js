/**
 * Menu Renderer (menuRenderer.js)
 * * Contains all functions responsible for manipulating the DOM and rendering UI components.
 * It is detached from data fetching and filtering logic.
 */
import { appConfig } from './appConfig.js';

const menuArea = document.getElementById('menu-area');
const searchInput = document.getElementById('search-input');

let currentRenderedItems = [];

const menuRenderer = {
  /**
   * Render shimmer loading skeletons.
   * @param {number} count
   */
  renderShimmer(count = 6) {
    const shimmerCards = Array.from({ length: count }, () => `
      <div class="shimmer-card">
        <div class="shimmer-circle"></div>
        <div class="shimmer-lines">
          <div class="shimmer-line title"></div>
          <div class="shimmer-line"></div>
          <div class="shimmer-line short"></div>
        </div>
      </div>
    `).join('');

    menuArea.innerHTML = `<div class="shimmer-wrapper">${shimmerCards}</div>`;
  },

  /**
   * Render menu items.
   * @param {Array<Object>} items
   */
  renderMenuItems(items = []) {
    currentRenderedItems = items;
    this.displayItems(items);
  },

  /**
   * Display items (used initially and during search).
   * @param {Array<Object>} items
   */
  displayItems(items = []) {
    if (!items.length) {
      return this.renderNoData('No Items Found', 'This restaurant menu is currently empty.');
    }

    menuArea.innerHTML = this.generateItemsHTML(items);
  },

  /**
   * Generate menu items HTML.
   * @param {Array<Object>} items
   */
  generateItemsHTML(items = []) {
    const itemCards = items.map(item => `
      <div class="menu-item-card">
        <div class="item-image-container">
          <img 
            src="${item.image || 'https://placehold.co/80x80/cccccc/333333?text=FOOD'}"
            alt="${item.title || 'Menu Item'}"
            class="item-image"
            onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=FOOD'">
        </div>
        <div class="item-details">
          <h4 class="item-name">${item.title || 'Untitled Item'}</h4>
          <p class="item-description">${item.description || ''}</p>
        </div>
        <div class="item-price">৳ ${(item.price ?? 0).toFixed(0)}</div>
      </div>
    `).join('');

    return `<div class="menu-list">${itemCards}</div>`;
  },

  /**
   * Filter items by search query.
   */
  filterMenu() {
    const query = searchInput.value.toLowerCase().trim();
    if (!App.isSearching) return;

    if (!query) {
      this.renderMenuItems([]);
      return;
    }

    const groupedResults = App.restaurants
      .map(r => ({
        ...r,
        items: r.items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          (item.tags || []).some(tag => tag.toLowerCase().includes(query))
        )
      }))
      .filter(r => r.items.length > 0);

    if (!groupedResults.length) {
      return this.renderNoData('No Results', `No items found matching "${query}"`);
    }

    const html = groupedResults.map(r => `
      <h3 class="menu-group-title">${r.name}</h3>
      ${this.generateItemsHTML(r.items)}
    `).join('');

    menuArea.innerHTML = html;
  },

  /**
   * Render "no data" message.
   * @param {string} title
   * @param {string} message
   */
  renderNoData(title, message) {
    menuArea.innerHTML = `
      <div class="no-data-view">
        <i class="fas fa-utensils"></i>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
  },

  /**
   * Render error view.
   * @param {string} title
   * @param {string} message
   */
  renderError(title, message) {
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
