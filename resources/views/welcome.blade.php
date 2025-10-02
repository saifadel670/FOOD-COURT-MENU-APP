<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Court Central - Dynamic</title>
    <!-- Load Font Awesome for Icons (Search, Error) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <!-- Load Google Font: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <style>
        /* * GLOBAL STYLES & FONT SETUP
         */
        :root {
            --primary-orange: #FF8C42;
            --primary-dark: #333333;
            --secondary-text: #666666;
            --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            --content-width: 450px;
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            /* Default background for areas outside the mobile view */
            background-color: #e5e7eb; 
            display: flex;
            justify-content: center;
        }

        /* * MOBILE VIEW CONTAINER (THE CORE RESPONSIVE RULE)
         */
        .app-container {
            max-width: var(--content-width); 
            width: 100%; 
            background-color: #ffffff;
            box-shadow: var(--card-shadow); 
            min-height: 100vh; 
            overflow-x: hidden; /* Prevent horizontal scroll on mobile */
            display: flex;
            flex-direction: column;
            position: relative; /* For positioning the loading overlay */
        }

        /* * HEADER STYLING 
         */
        .header-bg {
            background-image: linear-gradient(to bottom, #ffc72c, var(--primary-orange));
            height: 180px;
            position: relative;
            padding-top: 20px;
            overflow: hidden;
            box-sizing: border-box;
            padding-bottom: 10px; /* Adjusted padding to better contain tabs */
        }

        /* City silhouette effect using pseudo-element */
        .header-bg::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            /* Placeholder for a complex vector city image (using a simple block shadow effect here) */
            background: linear-gradient(to right, 
                rgba(0,0,0,0.1) 0%, 
                rgba(0,0,0,0.1) 10%, 
                transparent 10%, 
                transparent 20%, 
                rgba(0,0,0,0.15) 20%, 
                rgba(0,0,0,0.15) 35%, 
                transparent 35%,
                transparent 45%,
                rgba(0,0,0,0.2) 45%,
                rgba(0,0,0,0.2) 60%,
                transparent 60%,
                transparent 70%,
                rgba(0,0,0,0.1) 70%,
                rgba(0,0,0,0.1) 100%
            );
            clip-path: polygon(0 100%, 10% 30%, 20% 60%, 35% 20%, 50% 70%, 70% 40%, 85% 80%, 100% 50%, 100% 100%);
            opacity: 0.5;
        }

        .header-content {
            position: relative;
            z-index: 10;
            text-align: center;
            color: white;
        }

        .header-title {
            font-size: 2rem;
            font-weight: 900;
            letter-spacing: 2px;
            margin-top: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header-subtitle {
            font-size: 1rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin-top: -8px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* * RESTAURANT TABS STYLING (Horizontal Scrollable)
         */
        .tabs-container {
            display: flex;
            padding: 0 20px;
            margin-top: 20px;
            gap: 10px;
            overflow-x: scroll; /* Makes the tabs scrollable horizontally */
            -webkit-overflow-scrolling: touch; /* Improves scrolling on iOS */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .tabs-container::-webkit-scrollbar {
            display: none;
        }

        .tab-button {
            flex-shrink: 0; /* Prevents buttons from shrinking */
            padding: 10px 15px; 
            border: none;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-transform: uppercase;
            min-width: 120px; /* Ensure a minimum width for easy tapping */
        }

        .tab-button.active {
            background-color: white;
            color: var(--primary-orange);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid var(--primary-orange);
        }

        .tab-button:not(.active) {
            background-color: rgba(255, 255, 255, 0.4);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
        
        /* * MENU LIST STYLING 
         */
        .menu-list {
            padding: 20px;
            margin-top: 10px;
        }

        .menu-item-card {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 15px;
            background-color: white;
            border-radius: 12px;
            box-shadow: var(--card-shadow);
            transition: transform 0.2s ease;
            cursor: pointer;
        }

        .menu-item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .item-image-container {
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #f0f0f0;
            margin-right: 15px;
        }

        .item-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .item-details {
            flex-grow: 1;
            padding-right: 10px;
        }

        .item-name {
            font-size: 1rem;
            font-weight: 700;
            color: var(--primary-dark);
            margin: 0;
        }

        .item-description {
            font-size: 0.8rem;
            color: var(--secondary-text);
            margin: 2px 0;
        }

        .item-restaurant-name { /* Renamed class for clarity */
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--primary-orange);
            margin: 2px 0 0 0;
        }

        .item-price {
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--primary-dark);
            white-space: nowrap;
        }

        /* * SEARCH BAR STYLING 
         */
        .search-bar-container {
            padding: 20px;
            padding-top: 10px; /* Reduced top padding as back button is removed */
            padding-bottom: 0;
        }

        .search-input-group {
            display: flex;
            align-items: center;
            background-color: #f7f7f7;
            border-radius: 12px;
            padding: 8px 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-input {
            flex-grow: 1;
            border: none;
            background: none;
            outline: none;
            font-size: 1rem;
            padding: 5px 10px 5px 0;
            color: var(--primary-dark);
        }
        
        .search-input::placeholder {
            color: #aaaaaa;
        }

        .search-icon {
            color: #aaaaaa;
            font-size: 1.1rem;
            cursor: pointer;
        }

        /* * LOADING/NO DATA STYLES
         */
        .loading-overlay {
            position: absolute; 
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            background-color: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-orange);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .no-data-view {
            text-align: center;
            padding: 40px 20px;
            color: var(--secondary-text);
            margin-top: 50px;
            width: 100%;
            box-sizing: border-box;
        }

        .no-data-view i {
            font-size: 3rem;
            color: #ccc;
            margin-bottom: 15px;
        }

        .no-data-view h3 {
            margin: 0 0 10px 0;
            font-weight: 600;
            color: var(--primary-dark);
        }
        /* Utility class to hide elements */
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <div class="app-container">
        
        <!-- Loading Overlay (Visible during simulated API call) -->
        <div id="loading-overlay" class="loading-overlay">
            <div class="spinner"></div>
        </div>

        <!-- Header Section (Food Court Central Banner) -->
        <div class="header-bg">
            <div class="header-content">
                <div class="header-title">FOOD COURT</div>
                <div class="header-subtitle">CENTRAL</div>
            </div>
            
            <!-- Restaurant Tabs - Content will be dynamically added here -->
            <div id="tabs-container" class="tabs-container">
                <!-- Dynamic tab buttons go here -->
            </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-container">
            <!-- Back button bar removed as requested -->
            <div class="search-input-group">
                <input type="text" id="search-input" class="search-input" placeholder="Search menu items..." oninput="filterMenu()">
                <i class="fas fa-search search-icon"></i>
            </div>
        </div>
        
        <!-- Menu List & No Data View Container -->
        <div id="menu-area">
            <!-- Dynamic menu list items or No Data view will be inserted here -->
        </div>

    </div>

    <script>
        // --- MOCK API DATA (Replace with your actual Laravel/API fetching logic) ---
        const mockApiData = {
            "selectedRestaurant": 1,
            "restaurants": [
                {
                    "id": 1,
                    "name": "Sunset Diner",
                    "address": "123 Main St, Cityville",
                    "phone": "+1 234 567 890",
                    "rating": 4.5,
                    "items": [
                        { "title": "Classic Cheeseburger", "description": "Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce", "price": 8.99, "image": "https://placehold.co/150x150/d74e4e/ffffff?text=Burger" },
                        { "title": "Caesar Salad", "description": "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing", "price": 6.50, "image": "https://placehold.co/150x150/a8d840/ffffff?text=Salad" },
                        { "title": "Spicy Chicken Wings", "description": "Six pieces of crispy chicken wings tossed in a fiery sauce.", "price": 10.99, "image": "https://placehold.co/150x150/ff8c42/ffffff?text=Wings" }
                    ]
                },
                {
                    "id": 2,
                    "name": "Ocean Breeze Cafe",
                    "address": "456 Ocean Ave, Beach City",
                    "phone": "+1 987 654 321",
                    "rating": 4.7,
                    "items": [
                        { "title": "Grilled Salmon", "description": "Fresh salmon fillet grilled to perfection, served with vegetables", "price": 15.99, "image": "https://placehold.co/150x150/4682b4/ffffff?text=Salmon" },
                        { "title": "Shrimp Tacos", "description": "Soft tortillas filled with spicy shrimp, slaw, and lime crema", "price": 12.50, "image": "https://placehold.co/150x150/ff4500/ffffff?text=Tacos" },
                        { "title": "Mango Smoothie", "description": "Refreshing smoothie made with fresh mango and yogurt", "price": 4.99, "image": "https://placehold.co/150x150/f0a440/ffffff?text=Drink" }
                    ]
                },
                {
                    "id": 3,
                    "name": "Green Garden Bistro",
                    "address": "789 Park Rd, Townsville",
                    "phone": "+1 555 123 456",
                    "rating": 4.3,
                    "items": [
                        { "title": "Veggie Wrap", "description": "Whole wheat wrap stuffed with grilled vegetables and hummus", "price": 7.50, "image": "https://placehold.co/150x150/5f402f/ffffff?text=Wrap" },
                        { "title": "Quinoa Salad", "description": "Healthy quinoa salad with mixed greens, cherry tomatoes, and feta", "price": 8.25, "image": "https://placehold.co/150x150/a8d840/ffffff?text=Quinoa" }
                    ]
                },
                {
                    "id": 4,
                    "name": "Empty Kitchen (No Items)",
                    "address": "No Items Available",
                    "phone": "",
                    "rating": 0,
                    "items": []
                }
            ]
        };

        // Global state to track currently selected restaurant ID
        let currentRestaurantId = null; 
        const menuArea = document.getElementById('menu-area');
        const tabsContainer = document.getElementById('tabs-container');
        const searchInput = document.getElementById('search-input');
        const loadingOverlay = document.getElementById('loading-overlay');

        /**
         * Renders the No Data View for a specific error or general lack of content.
         * @param {string} title
         * @param {string} message
         */
        function renderNoDataView(title, message) {
            menuArea.innerHTML = `
                <div class="no-data-view">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
            `;
            // Hide search bar if there are no items to search
            if (title.includes('No Restaurants')) {
                 searchInput.closest('.search-bar-container').classList.add('hidden');
            } else {
                 searchInput.closest('.search-bar-container').classList.remove('hidden');
            }
        }

        /**
         * Renders the menu items for the currently selected restaurant.
         * @param {number} restaurantId - The ID of the restaurant to display.
         * @param {object} data - The entire mock API data object.
         */
        function renderMenu(restaurantId, data) {
            currentRestaurantId = restaurantId;
            const restaurant = data.restaurants.find(r => r.id === restaurantId);
            
            if (!restaurant || !restaurant.items || restaurant.items.length === 0) {
                renderNoDataView(
                    'No Menu Items Found', 
                    `The menu for ${restaurant ? restaurant.name : 'this restaurant'} is currently unavailable.`
                );
                return;
            }

            // Reset search input for the new tab
            searchInput.value = '';
            
            // Render all items initially
            renderFilteredMenu(restaurant.items, restaurant.name);
        }

        /**
         * Renders the list of menu items (handles filtering).
         * @param {Array} items - Array of menu items to display.
         * @param {string} restaurantName - Name of the restaurant for display.
         * @param {string} filterText - Optional text to filter by.
         */
        function renderFilteredMenu(items, restaurantName, filterText = '') {
            menuArea.innerHTML = `<div class="menu-list"></div>`;
            const menuList = menuArea.querySelector('.menu-list');

            const filteredItems = items.filter(item => {
                const search = filterText.toLowerCase();
                return item.title.toLowerCase().includes(search) || 
                       item.description.toLowerCase().includes(search);
            });
            
            if (filteredItems.length === 0) {
                 renderNoDataView(
                    'No Matching Items', 
                    `We couldn't find any items matching "${filterText}" in ${restaurantName}.`
                );
                return;
            }

            const menuHtml = filteredItems.map(item => `
                <div class="menu-item-card">
                    <div class="item-image-container">
                        <img src="${item.image}" alt="${item.title}" class="item-image" onerror="this.src='https://placehold.co/150x150/cccccc/ffffff?text=Food'">
                    </div>
                    <div class="item-details">
                        <p class="item-name">${item.title}</p>
                        <p class="item-description">${item.description}</p>
                        <p class="item-restaurant-name">${restaurantName}</p>
                    </div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
            `).join('');

            menuList.innerHTML = menuHtml;
        }

        /**
         * Handles filtering the menu based on the search input value.
         */
        function filterMenu() {
            const filterText = searchInput.value.trim();
            const data = mockApiData; 
            const restaurant = data.restaurants.find(r => r.id === currentRestaurantId);

            if (restaurant) {
                renderFilteredMenu(restaurant.items, restaurant.name, filterText);
            }
        }

        /**
         * Renders the scrollable restaurant tabs and sets the active state.
         * @param {object} data - The entire mock API data object.
         * @param {number} selectedId - The ID that should be initially selected.
         */
        function renderTabs(data, selectedId) {
            tabsContainer.innerHTML = ''; // Clear existing tabs
            
            let initialRestaurantId = selectedId;
            // 1. Check if the selectedId exists in the restaurants array
            const foundRestaurant = data.restaurants.find(r => r.id === selectedId);

            // 2. If selectedId is invalid or not found, default to the first restaurant ID
            if (!foundRestaurant && data.restaurants.length > 0) {
                initialRestaurantId = data.restaurants[0].id;
            } else if (data.restaurants.length === 0) {
                // Handled by initialization, but good to check
                return; 
            }

            data.restaurants.forEach(restaurant => {
                const button = document.createElement('button');
                button.className = 'tab-button';
                button.textContent = restaurant.name;
                button.setAttribute('data-id', restaurant.id);
                
                if (restaurant.id === initialRestaurantId) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    // Update active state
                    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Render the new menu
                    renderMenu(restaurant.id, data);
                });

                tabsContainer.appendChild(button);
            });

            // Once tabs are rendered and selection is finalized, render the menu
            renderMenu(initialRestaurantId, data);
            
            // Scroll the selected tab into view (for wide screens with many tabs)
            const activeTab = tabsContainer.querySelector('.tab-button.active');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }

        /**
         * Main function to simulate API fetch and initialize the view.
         */
        function initializeApp() {
            // Simulate API latency (e.g., 500ms)
            setTimeout(() => {
                const data = mockApiData;
                
                // Hide loading overlay
                loadingOverlay.classList.add('hidden');

                // --- GLOBAL DATA CHECK ---
                if (!data || !data.restaurants || data.restaurants.length === 0) {
                    renderNoDataView(
                        'No Restaurants Found', 
                        'The main server returned no restaurant data. Please check the backend configuration.'
                    );
                    return;
                }
                
                // --- INITIAL SELECTION AND RENDERING ---
                const selectedId = data.selectedRestaurant;
                renderTabs(data, selectedId);
                
            }, 500); // Simulated API delay
        }

        // Attach event listener for search functionality
        searchInput.addEventListener('input', filterMenu);

        // Start the application initialization
        window.onload = initializeApp;
    </script>
</body>
</html>
