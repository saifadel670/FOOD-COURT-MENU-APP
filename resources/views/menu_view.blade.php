<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Court Central - Dynamic API</title>
    <!-- Load Font Awesome for Icons (Search, Error) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <!-- Load Google Font: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- FIX: Use absolute path (from web root) to correctly locate CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/styles.css') }}">

</head>
<body>
    <div class="app-container">
        
        <!-- Header Section -->
        <div class="header-bg">
            <div class="header-content">
                <!-- Titles now set by JavaScript -->
                <div id="app-title" class="header-title"></div>
                <div id="app-subtitle" class="header-subtitle"></div>
            </div>
            
            <!-- Restaurant Tabs Container -->
            <div id="tabs-container" class="tabs-container">
                <!-- Tabs will be dynamically added here -->
            </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-container">
            <div class="search-input-group">
                <!-- Placeholder text now set by JavaScript -->
                <input type="text" id="search-input" class="search-input" placeholder="" oninput="menuRenderer.filterMenu()">
                <i class="fas fa-search search-icon"></i>
            </div>
        </div>
        
        <!-- Menu List & Shimmer Container -->
        <div id="menu-area">
            <!-- Dynamic menu list items or Shimmer/No Data view will be inserted here -->
        </div>

    </div>

    <!-- FIX: Use absolute path (from web root) to correctly locate main JS module -->
    <!-- The internal JS modules (like appConfig.js) must also be updated. -->
    <script type="module"  src="{{ asset('assets/js/app.js') }}"></script>
</body>
</html>
