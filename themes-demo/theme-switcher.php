<?php
/**
 * Plugin Name: Theme Switcher by URL
 * Description: Switches WordPress theme based on URL path
 * Version: 1.0.0
 */

// Hook early to switch theme before WordPress loads
add_filter('stylesheet', 'theme_switcher_get_stylesheet');
add_filter('template', 'theme_switcher_get_template');

function theme_switcher_get_stylesheet($stylesheet) {
    return theme_switcher_get_theme_slug() ?: $stylesheet;
}

function theme_switcher_get_template($template) {
    return theme_switcher_get_theme_slug() ?: $template;
}

function theme_switcher_get_theme_slug() {
    static $theme_slug = null;
    
    if ($theme_slug !== null) {
        return $theme_slug;
    }
    
    // Get original request URI before any rewrites
    $request_uri = $_SERVER['REQUEST_URI'] ?? $_SERVER['REDIRECT_URL'] ?? $_SERVER['PHP_SELF'] ?? '';
    
    // Also check HTTP_HOST and SCRIPT_NAME to reconstruct full URL if needed
    if (isset($_SERVER['HTTP_X_ORIGINAL_URI'])) {
        $request_uri = $_SERVER['HTTP_X_ORIGINAL_URI'];
    }
    
    // Remove leading slash and query string
    $path = trim(parse_url($request_uri, PHP_URL_PATH), '/');
    
    // Check if path starts with a theme slug (e.g., /iranche-default/)
    $path_parts = array_filter(explode('/', $path));
    $first_segment = reset($path_parts) ?: '';
    
    if (empty($first_segment)) {
        $theme_slug = '';
        return $theme_slug;
    }
    
    // Check if it's a valid theme
    $themes_dir = WP_CONTENT_DIR . '/themes/';
    $theme_path = $themes_dir . $first_segment;
    
    if (is_dir($theme_path) && file_exists($theme_path . '/style.css')) {
        $theme_slug = $first_segment;
        
        // Store original URI for reference
        if (!isset($_SERVER['ORIGINAL_REQUEST_URI'])) {
            $_SERVER['ORIGINAL_REQUEST_URI'] = $request_uri;
        }
        
        // Rewrite REQUEST_URI to remove theme slug for WordPress
        $rest_parts = array_slice($path_parts, 1);
        $new_path = empty($rest_parts) ? '/' : '/' . implode('/', $rest_parts);
        
        // Preserve query string
        $query_string = parse_url($request_uri, PHP_URL_QUERY);
        if ($query_string) {
            $new_path .= '?' . $query_string;
        }
        
        // Update server vars
        $_SERVER['REQUEST_URI'] = $new_path;
        $_SERVER['REDIRECT_URL'] = $new_path;
        $_SERVER['SCRIPT_URL'] = $new_path;
        
        return $theme_slug;
    }
    
    $theme_slug = '';
    return $theme_slug;
}

// Hook into query vars to handle theme switching
add_action('parse_request', 'theme_switcher_parse_request', 1);

function theme_switcher_parse_request($wp) {
    // Theme switching is already handled by filters above
    return $wp;
}

// Hook into template redirect to handle root requests
add_action('template_redirect', 'theme_switcher_template_redirect', 1);

function theme_switcher_template_redirect() {
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    $path = trim(parse_url($request_uri, PHP_URL_PATH), '/');
    $path_parts = explode('/', $path);
    $first_segment = $path_parts[0] ?? '';
    
    // If root or no theme slug, use default
    if (empty($first_segment)) {
        return;
    }
    
    // Check if it's a theme slug
    $themes_dir = WP_CONTENT_DIR . '/themes/';
    if (is_dir($themes_dir . $first_segment)) {
        // Remove theme slug from REQUEST_URI for WordPress
        $new_path = '/' . implode('/', array_slice($path_parts, 1));
        if (empty($new_path) || $new_path === '/') {
            $new_path = '/';
        }
        
        $_SERVER['REQUEST_URI'] = $new_path;
        
        // Update QUERY_STRING if needed
        if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
            $_SERVER['REQUEST_URI'] .= '?' . $_SERVER['QUERY_STRING'];
        }
    }
}

